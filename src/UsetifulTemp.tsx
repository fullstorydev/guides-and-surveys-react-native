import { useEffect, type PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import type { UsetifulTag } from './types';
import { useTargetting } from './hooks/useTargetting';
import { useProgressorUpdate } from './hooks/useProgressorUpdate';
import { useActiveExperienceStore } from './stores/useActiveExperienceStore';
import Survey from './Survey';
import { useDataStore } from './stores/useDataStore';
import type { Survey as SurveyType } from './types';

type Props = {
  token: string;
  tags?: UsetifulTag;
} & PropsWithChildren;

export const UsetifulTemp = ({ children, token, tags }: Props) => {
  const initialize = useDataStore((s) => s.initialize);
  useEffect(() => {
    initialize(token, tags);
  }, [initialize, tags, token]);

  useTargetting();
  useProgressorUpdate();

  const activeExperience = useActiveExperienceStore((s) => s.activeExperience);

  const renderContent = () => {
    // TODO only surveys for now
    switch (activeExperience?.type) {
      case 'survey':
        return (
          <View style={[styles.usetifulLayer, styles.surveyContainer]}>
            <Survey survey={activeExperience!.experience as SurveyType} />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {children}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  surveyContainer: {
    backgroundColor: '#000000cc',
    justifyContent: 'flex-start',
  },
  usetifulLayer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#000000cc',
  },
});
