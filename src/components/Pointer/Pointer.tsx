import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Body } from '../Body';
import { Action } from '../Action';
import type { Measure, TourStep } from '../../types';
import { useStore } from '../../stores/useStore';
import { useEffect, useRef, useState } from 'react';

type Props = {
  step: TourStep;
  onColse: () => void;
  layoutMeasure?: Measure;
};
export const Pointer = ({ step, onColse, layoutMeasure }: Props) => {
  const { title, actions, content, element } = step;

  const pointerRef = useRef<View>(null);

  const [uiMode, SetUiMode] = useState<'Bottom' | 'Top'>('Bottom');
  const [pointerTopMargin, setPointerMargin] = useState<number>(0);

  const refs = useStore((s) => s.elementRefs);
  const ref = refs[element];

  const [measure, setMeasure] = useState<Measure>();

  useEffect(() => {
    if (ref && ref.current) {
      //@ts-ignore
      ref?.current.measure((x, y, width, height, pageX, pageY) => {
        if (![x, y, width, height, pageX, pageY].some((i) => i === undefined)) {
          setMeasure({ x, y, width, height, pageX, pageY });
        }
      });
    }
  }, [ref]);
  useEffect(() => {
    if (measure && layoutMeasure) {
      if (measure.y > layoutMeasure.height / 2) {
        SetUiMode('Top');
      } else {
        SetUiMode('Bottom');
      }
    }
  }, [layoutMeasure, layoutMeasure?.height, measure, measure?.y]);
  useEffect(() => {
    if (measure) {
      if (uiMode === 'Bottom') {
        setPointerMargin(measure.pageY + measure.height + 10);
      } else {
        pointerRef?.current?.measure((_x, _y, _width, height) => {
          setPointerMargin(measure.pageY - height - 10);
        });
      }
    }
  }, [measure, pointerRef, uiMode]);

  return (
    <>
      {measure && (
        <>
          <View
            style={{
              ...styles.dimmer,
              left: 0,
              width: measure.pageX,
              height: '100%',
            }}
          />
          <View
            style={{
              ...styles.dimmer,
              left: measure.pageX,
              width: '100%',
              height: measure.pageY,
            }}
          />
          <View
            style={{
              ...styles.dimmer,
              top: measure.pageY + measure?.height,
              left: measure.pageX,
              width: '100%',
              height: '100%',
            }}
          />
          <View
            style={{
              ...styles.dimmer,
              top: measure.pageY,
              left: measure.pageX + measure.width,
              width: '100%',
              height: measure.height,
            }}
          />
          <View
            style={{
              ...styles.pointer,
              marginTop: pointerTopMargin,
            }}
            ref={pointerRef}
          >
            <View style={styles.pointerHeader}>
              <Text style={styles.pointerText}>{title}</Text>
              <TouchableOpacity style={styles.crossBtn} onPress={onColse}>
                <Text>X</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.pointerBody}>
              {!!content && <Body content={content} />}
            </View>
            <View style={styles.pointerFooter}>
              {actions.map((action) => {
                return <Action key={action.id} {...{ action, onColse }} />;
              })}
            </View>
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  pointer: {
    backgroundColor: '#fff',
    marginHorizontal: '5%',
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  pointerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  pointerFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  pointerText: {
    textAlign: 'center',
  },
  pointerBody: {
    paddingVertical: 8,
  },
  crossBtn: {
    fontSize: 16,
    width: 20,
    height: 20,
    alignItems: 'flex-end',
  },
  dimmer: {
    position: 'absolute',
    backgroundColor: '#000000cc',
  },
});
