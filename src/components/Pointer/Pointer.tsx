import { StyleSheet, View, type ViewStyle } from 'react-native';
import { Body } from '../Body';
import { Action } from '../Action';
import type { Measure, TourStep } from '../../types';
import { useStore } from '../../stores/useStore';
import { useEffect, useMemo, useRef, useState } from 'react';
import { StepHeader } from '../StepHeader/StepHeader';

type Props = {
  step: TourStep;
  onClose: () => void;
  layoutMeasure?: Measure;
};
export const Pointer = ({ step, onClose, layoutMeasure }: Props) => {
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

  const styles = useMemo(() => {
    const MARGIN_HORIZONTAL = 15;
    const PADDING_HIRIZONTAL = 10;

    const centerOfElementOnScreen =
      (ref?.pageX ?? 0) -
      (PADDING_HIRIZONTAL + MARGIN_HORIZONTAL) +
      (ref?.width ?? 0) / 2;

    return StyleSheet.create({
      pointer: {
        backgroundColor: theme.bgColor,
        marginHorizontal: MARGIN_HORIZONTAL,
        shadowColor: '#000000',
        shadowOpacity: 0.5,
        borderRadius: 5,
        paddingHorizontal: PADDING_HIRIZONTAL,
        paddingVertical: 8,
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
      tip: {
        width: 10,
        height: 10,
        position: 'absolute',
        ...(uiMode === 'Bottom' ? { top: -5 } : { bottom: -5 }),
        left: centerOfElementOnScreen,
        backgroundColor: theme.bgColor,
        transform: 'rotate(45deg)',
      },
      dimmer: {
        position: 'absolute',
        backgroundColor: '#000000cc',
      },
      dimmer1: {
        left: 0,
        width: ref?.pageX,
        height: '100%',
      },
      dimmer2: {
        left: ref?.pageX,
        width: '100%',
        height: ref?.pageY,
      },
      dimmer3: {
        top: (ref?.pageY ?? 0) + (ref?.height ?? 0),
        left: ref?.pageX,
        width: '100%',
        height: '100%',
      },
      dimmer4: {
        top: ref?.pageY,
        left: (ref?.pageX ?? 0) + (ref?.width ?? 0),
        width: '100%',
        height: ref?.height,
      },
    });
  }, [ref, theme, uiMode]);

  return (
    <>
      {ref && (
        <>
          <View
            style={
              {
                ...styles.dimmer,
                ...styles.dimmer1,
              } as ViewStyle
            }
          />
          <View
            style={
              {
                ...styles.dimmer,
                ...styles.dimmer2,
              } as ViewStyle
            }
          />
          <View
            style={
              {
                ...styles.dimmer,
                ...styles.dimmer3,
              } as ViewStyle
            }
          />
          <View
            style={
              {
                ...styles.dimmer,
                ...styles.dimmer4,
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
            <View style={styles.tip} />
            <StepHeader {...{ title, onClose }} />
            <View style={styles.pointerBody}>
              {!!content && <Body content={content} />}
            </View>
            <View style={styles.pointerFooter}>
              {actions.map((action) => {
                return <Action key={action.id} {...{ action, onClose }} />;
              })}
            </View>
          </View>
        </>
      )}
    </>
  );
};
