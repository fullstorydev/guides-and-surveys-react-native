import { useEffect, useState, type PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import type { UsetifulTag, Measure } from './types';
import { useTargeting } from './hooks/useTargeting';
import { useProgressorUpdate } from './hooks/useProgressorUpdate';
import { useActiveExperienceStore } from './stores/useActiveExperienceStore';
import Survey from './Survey';
import { useDataStore } from './stores/useDataStore';
import type { Survey as SurveyType } from './types';
import { Tour } from './Tour';
// TODO remove this once we combine stores
import { useStore } from './stores/useStore';

type Props = {
  token: string;
  tags?: UsetifulTag;
} & PropsWithChildren;

export const Usetiful = ({ children, token, tags }: Props) => {
  // TODO remove this once we combine stores
  const initializeOldStore = useStore((s) => s.initialize);
  const initialize = useDataStore((s) => s.initialize);

  useEffect(() => {
    initialize(token, tags);
    // TODO integrate Tour store
    // initializeOldStore(token, tags);
  }, [initialize, initializeOldStore, tags, token]);

  useTargeting();
  useProgressorUpdate();
  const [layoutMeasure, setLayoutMeasure] = useState<Measure>();
  const availableTour = useStore((s) => s.availableTour);
  const activeExperience = useActiveExperienceStore((s) => s.activeExperience);

  const renderContent = () => {
    switch (activeExperience?.type) {
      case 'survey':
        return <Survey survey={activeExperience!.experience as SurveyType} />;
    }

    // TODO migrate to activeExperience
    if (availableTour) {
      return <Tour layoutMeasure={layoutMeasure as Measure} />;
    }

    return null;
  };

  return (
    <View
      style={styles.container}
      onLayout={(e) => {
        e.target.measure((x, y, width, height, pageX, pageY) => {
          if (
            ![x, y, width, height, pageX, pageY].some((i) => i === undefined)
          ) {
            setLayoutMeasure({ x, y, width, height, pageX, pageY } as Measure);
          }
        });
      }}
    >
      {children}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
