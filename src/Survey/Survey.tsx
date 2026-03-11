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
import { useForm, Controller } from 'react-hook-form';
import { type Survey as SurveyType, SURVEY_ACTION_TYPES } from '../types';
import { Action } from '../components/Action';
import { CrossBtn } from '../components/Cross';
import { NPS } from '../components/NPS/NPS';
import { OpenQuestion } from '../components/OpenQuestion/OpenQuestion';
import {
  updateSurveyStarted,
  updateSurveyProgress,
  updateSurveyClosed,
  updateSurveyCompleted,
} from '../stores/util/surveyProgress';
import { saveSurveyAnswer } from '../stores/util/surveyAnswers';
import { useActiveExperienceStore } from '../stores/useActiveExperienceStore';
import { useDataStore } from '../stores/useDataStore';
import { createSurveyStyles } from './createSurveyStyles';

const Survey = ({ survey }: { survey: SurveyType }) => {
  const selfClosed = useActiveExperienceStore((s) => s.selfClosed);
  const setSelfClosed = useActiveExperienceStore((s) => s.setSelfClosed);
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
  }, [survey.id, survey.name, survey.pages, surveyProgress]);

  // Filter to only supported question types
  const supportedQuestions =
    currentPage?.questions.filter(
      (q) => q.type === 'nps' || q.type === 'open'
    ) || [];

  const onSubmit = (data: any) => {
    if (!currentPage) {
      return;
    }

    // Save each answer
    Object.entries(data).forEach(([questionId, value]) => {
      const question = supportedQuestions.find((q) => q.id === questionId);
      if (question && value !== undefined && value !== null && value !== '') {
        saveSurveyAnswer(
          survey.id,
          questionId,
          question.type,
          value as string | number,
          currentPage.id,
          currentPage.name
        );
      }
    });

    const nextPageIndex = currentPageIndex + 1;
    const nextPage = survey.pages[nextPageIndex];

    if (nextPage) {
      updateSurveyProgress(survey.id, nextPage.id);
    } else {
      updateSurveyCompleted(survey.id);
    }
  };

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
        { damping: 400, stiffness: 1000 },
        () => runOnJS(onComplete)()
      );
    },
    [translateY, screenHeight]
  );

  // Wrapped in useCallback so it can be passed to runOnJS, which requires a stable JS function reference
  const dismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  const handleClose = useCallback(() => {
    Keyboard.dismiss();
    animateOut(() => {
      updateSurveyClosed(survey.id);
      setSelfClosed(true);
    });
  }, [animateOut, survey.id, setSelfClosed]);

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
              { damping: 400, stiffness: 1000 },
              () => {
                runOnJS(updateSurveyClosed)(survey.id);
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
      survey.id,
      translateY,
    ]
  );

  // Don't show if:
  // - No valid page to display
  // - User closed this survey in current session
  if (!currentPage || selfClosed) {
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
            {currentPage.closeButton && (
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
                    questionYPositions.current[index] = e.nativeEvent.layout.y;
                  }}
                  style={styles.questionContainer}
                >
                  <Controller
                    control={control}
                    name={question.id}
                    rules={{ required: question.required }}
                    render={({ field: { onChange, value } }) => {
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
                        />
                      );
                    }}
                  />
                </View>
              ))}
              <View style={styles.modalFooter}>
                {currentPage.actions.map((action) => {
                  const handleActionPress = () => {
                    if (action.type === SURVEY_ACTION_TYPES.CONFIRM_SURVEY) {
                      handleSubmit(onSubmit)();
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
          </Animated.View>
        </GestureDetector>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

export default Survey;
