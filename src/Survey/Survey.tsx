import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  ScrollView,
} from 'react-native-gesture-handler';
import { useForm, Controller, type FieldErrors } from 'react-hook-form';
import { type Survey as SurveyType, SURVEY_ACTION_TYPES } from '../types';
import { Action } from '../components/Action';
import { CrossBtn } from '../components/Cross';
import { NPS } from '../components/NPS/NPS';
import { OpenQuestion } from '../components/OpenQuestion/OpenQuestion';
import ThankYouPage from '../components/ThankYouPage';
import {
  updateSurveyStarted,
  updateSurveyProgress,
  updateSurveyClosed,
  updateSurveyCompleted,
} from '../stores/util/surveyProgress';
import { saveSurveyAnswer } from '../stores/util/surveyAnswers';
import {
  fsTrackSurveyStateChanged,
  fsTrackSurveyPageSeen,
  fsTrackQuestionAnswered,
} from '../utils/fsEvents';
import { useActiveExperienceStore } from '../stores/useActiveExperienceStore';
import { useDataStore } from '../stores/useDataStore';
import { createSurveyStyles } from './createSurveyStyles';

const Survey = ({ survey }: { survey: SurveyType }) => {
  const selfClosed = useActiveExperienceStore((s) => s.selfClosed);
  const setSelfClosed = useActiveExperienceStore((s) => s.setSelfClosed);
  const showingThankYou = useActiveExperienceStore((s) => s.showingThankYou);
  const setShowingThankYou = useActiveExperienceStore(
    (s) => s.setShowingThankYou
  );
  const theme = useActiveExperienceStore((s) => s.theme);

  const { control, handleSubmit } = useForm();

  const surveyProgress = useDataStore((s) =>
    s.getCurrentProgressorData().uf_surveys?.find((sp) => sp.id === survey.id)
  );

  const currentPageIndex = useMemo(
    () =>
      surveyProgress
        ? survey.pages.findIndex((p) => p.id === surveyProgress.currentPageId)
        : 0,
    [survey.pages, surveyProgress]
  );

  const currentPage = useMemo(
    () =>
      currentPageIndex >= 0 ? survey.pages[currentPageIndex] : survey.pages[0],
    [survey.pages, currentPageIndex]
  );

  // Initialize survey in store if it's new
  useEffect(() => {
    if (surveyProgress) {
      return;
    }

    const firstPage = survey.pages[0];
    if (!firstPage || !firstPage.id) {
      console.error(`Survey ${survey.id} has no pages or first page has no ID`);
      return;
    }

    updateSurveyStarted(survey.id, survey.name, firstPage.id);
    fsTrackSurveyStateChanged(survey, firstPage, 0, 'started');
  }, [survey, surveyProgress]);

  // Fire "Survey Page Seen" when showing any page
  useEffect(() => {
    if (!currentPage) {
      return;
    }

    fsTrackSurveyPageSeen(survey, currentPage, currentPageIndex);
  }, [survey, currentPage, currentPageIndex]);

  // Filter to only supported question types
  const supportedQuestions = useMemo(
    () =>
      currentPage?.questions.filter(
        (q) => q.type === 'nps' || q.type === 'open'
      ) || [],
    [currentPage]
  );

  const saveAnswers = useCallback(
    (data: any) => {
      if (!currentPage) {
        return;
      }
      Object.entries(data).forEach(([questionId, value]) => {
        const question = supportedQuestions.find((q) => q.id === questionId);
        if (question && value !== undefined && value !== null && value !== '') {
          const answer = value as string | number;
          saveSurveyAnswer(
            survey.id,
            questionId,
            question.type,
            answer,
            currentPage.id,
            currentPage.name
          );
          const questionIndex = currentPage.questions.findIndex(
            (q) => q.id === questionId
          );
          fsTrackQuestionAnswered(
            survey,
            currentPage,
            currentPageIndex,
            question,
            questionIndex >= 0 ? questionIndex : 0,
            answer
          );
        }
      });
    },
    [currentPage, supportedQuestions, survey, currentPageIndex]
  );

  const styles = useMemo(() => createSurveyStyles(theme), [theme]);

  const screenHeight = Dimensions.get('window').height;
  const translateY = useSharedValue(screenHeight);
  const scrollY = useSharedValue(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const questionYPositions = useRef<number[]>([]);
  const focusedQuestionIndex = useRef<number>(-1);

  const handleQuestionFocus = useCallback((index: number) => {
    focusedQuestionIndex.current = index;
  }, []);

  useEffect(() => {
    const subscription = Keyboard.addListener('keyboardDidShow', () => {
      const index = focusedQuestionIndex.current;
      const y = questionYPositions.current[index];
      if (index >= 0 && y !== undefined) {
        scrollViewRef.current?.scrollTo({ y, animated: true });
      }
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (currentPage && !selfClosed) {
      questionYPositions.current = [];
      focusedQuestionIndex.current = -1;
      translateY.value = withSpring(0, { damping: 400, stiffness: 1000 });
    }
  }, [currentPage, selfClosed, translateY]);

  const animatedModalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const animatedContainerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [screenHeight * 0.3, screenHeight * 0.6],
      [1, 0],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const animateOut = useCallback(
    (onComplete: () => void) => {
      translateY.value = withSpring(
        screenHeight,
        { damping: 200, stiffness: 400 },
        () => runOnJS(onComplete)()
      );
    },
    [translateY, screenHeight]
  );

  const trackSurveyStateChanged = useCallback(
    (state: 'started' | 'completed' | 'closed') => {
      fsTrackSurveyStateChanged(survey, currentPage!, currentPageIndex, state);
    },
    [survey, currentPage, currentPageIndex]
  );

  const onSubmit = useCallback(
    (data: any) => {
      Keyboard.dismiss();
      saveAnswers(data);

      const nextPageIndex = currentPageIndex + 1;
      const nextPage = survey.pages[nextPageIndex];

      if (nextPage) {
        updateSurveyProgress(survey.id, nextPage.id);
      } else if (survey.showThankYouMessage && survey.thankYouMessage) {
        updateSurveyCompleted(survey.id);
        trackSurveyStateChanged('completed');
        setShowingThankYou(true);
      } else {
        animateOut(() => {
          trackSurveyStateChanged('completed');
          updateSurveyCompleted(survey.id);
        });
      }
    },
    [
      saveAnswers,
      currentPageIndex,
      setShowingThankYou,
      animateOut,
      survey,
      trackSurveyStateChanged,
    ]
  );

  const onError = (fieldErrors: FieldErrors) => {
    const firstErrorIndex = supportedQuestions.findIndex(
      (q) => fieldErrors[q.id]
    );
    if (firstErrorIndex >= 0) {
      const y = questionYPositions.current[firstErrorIndex];
      if (y !== undefined) {
        scrollViewRef.current?.scrollTo({ y, animated: true });
      }
    }
  };

  // Wrapped in useCallback so it can be passed to runOnJS, which requires a stable JS function reference
  const dismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  const handleClose = useCallback(() => {
    Keyboard.dismiss();
    animateOut(() => {
      updateSurveyClosed(survey.id);
      setSelfClosed(true);
      trackSurveyStateChanged('closed');
    });
  }, [animateOut, survey, setSelfClosed, trackSurveyStateChanged]);

  const isDismissGesture = useRef(false);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .simultaneousWithExternalGesture(scrollViewRef)
        .onBegin(() => {
          isDismissGesture.current = scrollY.value <= 0;
        })
        .onUpdate((e) => {
          if (isDismissGesture.current && e.translationY > 0) {
            translateY.value = e.translationY;
          }
        })
        .onEnd((e) => {
          if (!isDismissGesture.current) {
            return;
          }
          const shouldDismiss = e.translationY > 350 || e.velocityY > 2000;
          if (shouldDismiss) {
            runOnJS(dismissKeyboard)();
            translateY.value = withSpring(
              screenHeight,
              { damping: 200, stiffness: 400 },
              () => {
                if (!showingThankYou) {
                  runOnJS(trackSurveyStateChanged)('closed');
                }
                runOnJS(updateSurveyClosed)(survey.id);
                runOnJS(setShowingThankYou)(false);
                runOnJS(setSelfClosed)(true);
              }
            );
          } else {
            translateY.value = withSpring(0, { damping: 400, stiffness: 1000 });
          }
        }),
    [
      dismissKeyboard,
      screenHeight,
      scrollY,
      setSelfClosed,
      setShowingThankYou,
      survey.id,
      translateY,
      trackSurveyStateChanged,
      showingThankYou,
    ]
  );

  // Don't show if:
  // - No valid page to display and not on thank you page
  // - User closed this survey in current session
  if ((!currentPage && !showingThankYou) || selfClosed) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.modal, animatedModalStyle]}>
            {showingThankYou && survey.thankYouMessage ? (
              <ThankYouPage
                content={survey.thankYouMessage.content}
                theme={theme}
                onClose={() =>
                  animateOut(() => {
                    setShowingThankYou(false);
                    setSelfClosed(true);
                  })
                }
              />
            ) : (
              <>
                {currentPage?.closeButton && (
                  <View style={styles.modalHeader}>
                    <CrossBtn
                      onClose={handleClose}
                      color={theme.surveyCloseIconColor}
                    />
                  </View>
                )}
                <ScrollView
                  ref={scrollViewRef}
                  contentContainerStyle={styles.modalBody}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  onScroll={(e) => {
                    scrollY.value = e.nativeEvent.contentOffset.y;
                  }}
                  scrollEventThrottle={16}
                >
                  {supportedQuestions.map((question, index) => (
                    <View
                      key={question.id}
                      onLayout={(e) => {
                        questionYPositions.current[index] =
                          e.nativeEvent.layout.y;
                      }}
                      style={styles.questionContainer}
                    >
                      <Controller
                        control={control}
                        name={question.id}
                        rules={{ required: question.required }}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => {
                          if (question.type === 'nps') {
                            return (
                              <NPS
                                value={value}
                                onChange={onChange}
                                leftLabel={question.minimalValueLabel}
                                rightLabel={question.maximalValueLabel}
                                theme={theme}
                                question={question.question}
                                required={question.required}
                                titleAlignment={question.alignment}
                                hasError={!!error}
                              />
                            );
                          }

                          // question.type === 'open'
                          return (
                            <OpenQuestion
                              value={value || ''}
                              onChange={onChange}
                              theme={theme}
                              question={question.question}
                              required={question.required}
                              titleAlignment={question.alignment}
                              placeholder={question.placeholderText}
                              onFocus={() => handleQuestionFocus(index)}
                              hasError={!!error}
                            />
                          );
                        }}
                      />
                    </View>
                  ))}
                  <View style={styles.modalFooter}>
                    {currentPage?.actions.map((action) => {
                      const handleActionPress = () => {
                        if (
                          action.type === SURVEY_ACTION_TYPES.CONFIRM_SURVEY
                        ) {
                          handleSubmit(onSubmit, onError)();
                        } else if (
                          action.type === SURVEY_ACTION_TYPES.CLOSE_SURVEY
                        ) {
                          handleClose();
                        } else {
                          // TODO: Implement show later logic
                          handleClose();
                        }
                      };

                      return (
                        <Action
                          key={action.id}
                          value={action.value}
                          styleType={action.styleType}
                          theme={theme}
                          onPress={handleActionPress}
                        />
                      );
                    })}
                  </View>
                </ScrollView>
              </>
            )}
          </Animated.View>
        </GestureDetector>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

export default Survey;
