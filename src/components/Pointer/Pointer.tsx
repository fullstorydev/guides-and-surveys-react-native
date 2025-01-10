import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { Body } from '../Body';
import { Action } from '../Action';
import type { Measure, TourStep } from '../../types';
import { useStore } from '../../stores/useStore';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CrossBtn } from '../Cross';

type Props = {
  step: TourStep;
  onColse: () => void;
  layoutMeasure?: Measure;
};
export const Pointer = ({ step, onColse, layoutMeasure }: Props) => {
  const { title, actions, content, element } = step;
  const theme = useStore((s) => s.theme);

  const pointerRef = useRef<View>(null);

  const [uiMode, SetUiMode] = useState<'Bottom' | 'Top'>('Bottom');
  const [pointerTopMargin, setPointerMargin] = useState<number>(0);

  const refs = useStore((s) => s.pointers);
  const ref = refs[element];
  useEffect(() => {
    if (ref && layoutMeasure) {
      if (ref.y > layoutMeasure.height / 2) {
        SetUiMode('Top');
      } else {
        SetUiMode('Bottom');
      }
    }
  }, [layoutMeasure, layoutMeasure?.height, ref]);
  useEffect(() => {
    if (ref) {
      if (uiMode === 'Bottom') {
        setPointerMargin(ref.pageY + ref.height + 10);
      } else {
        pointerRef?.current?.measure((_x, _y, _width, height) => {
          setPointerMargin(ref.pageY - height - 10);
        });
      }
    }
  }, [pointerRef, ref, uiMode]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        pointer: {
          backgroundColor: theme.bgColor,
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
          fontSize: theme.fontSize,
          color: theme.fontColor,
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
      }),
    [theme]
  );

  return (
    <>
      {ref && (
        <>
          <View
            style={
              {
                ...styles.dimmer,
                left: 0,
                width: ref.pageX,
                height: '100%',
              } as ViewStyle
            }
          />
          <View
            style={
              {
                ...styles.dimmer,
                left: ref.pageX,
                width: '100%',
                height: ref?.pageY,
              } as ViewStyle
            }
          />
          <View
            style={
              {
                ...styles.dimmer,
                top: ref.pageY + ref.height,
                left: ref?.pageX,
                width: '100%',
                height: '100%',
              } as ViewStyle
            }
          />
          <View
            style={
              {
                ...styles.dimmer,
                top: ref.pageY,
                left: ref.pageX + ref.width,
                width: '100%',
                height: ref?.height,
              } as ViewStyle
            }
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
              <CrossBtn onColse={onColse} />
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
