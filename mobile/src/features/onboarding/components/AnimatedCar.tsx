import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import Svg, {
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";

import { easeInOutSine, getRoutePose } from "../lib/routePath";
import { CAR_TRIP_MS, ROUTE_PATH_D, ROUTE_VIEWBOX } from "../styles/tokens";

type Props = {
  width: number;
  height: number;
  reduceMotion?: boolean;
  duration?: number;
};

function PremiumCarSvg() {
  return (
    <Svg height={36} viewBox="-32 -16 64 32" width={36}>
      <Defs>
        <LinearGradient gradientUnits="userSpaceOnUse" id="carBodyPaintLive" x1={-16} x2={16} y1={-2} y2={2}>
          <Stop offset="0" stopColor="#0B4E3C" />
          <Stop offset="0.42" stopColor="#1F8E66" />
          <Stop offset="0.72" stopColor="#56C88B" />
          <Stop offset="1" stopColor="#95EBB0" />
        </LinearGradient>
        <LinearGradient gradientUnits="userSpaceOnUse" id="carHighlightPaintLive" x1={-3} x2={7} y1={-8} y2={8}>
          <Stop offset="0" stopColor="#F2FFE9" stopOpacity={0.78} />
          <Stop offset="1" stopColor="#F2FFE9" stopOpacity={0} />
        </LinearGradient>
        <LinearGradient gradientUnits="userSpaceOnUse" id="carCabinPaintLive" x1={-9} x2={9} y1={0} y2={0}>
          <Stop offset="0" stopColor="#061A16" />
          <Stop offset="1" stopColor="#14372F" />
        </LinearGradient>
        <LinearGradient gradientUnits="userSpaceOnUse" id="carGlassPaintLive" x1={0} x2={0} y1={-7} y2={7}>
          <Stop offset="0" stopColor="#275847" />
          <Stop offset="1" stopColor="#081C18" />
        </LinearGradient>
        <RadialGradient cx="50%" cy="50%" id="carHeadGlowLive" r="50%">
          <Stop offset="0" stopColor="#DFFF99" stopOpacity={0.88} />
          <Stop offset="1" stopColor="#DFFF99" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <G>
        <Line opacity={0.7} stroke="rgba(217,255,111,0.28)" strokeLinecap="round" strokeWidth={1.5} x1={-26} x2={-14} y1={-5} y2={-5} />
        <Line opacity={0.55} stroke="rgba(217,255,111,0.28)" strokeLinecap="round" strokeWidth={1.5} x1={-30} x2={-14} y1={0} y2={0} />
        <Line opacity={0.4} stroke="rgba(217,255,111,0.28)" strokeLinecap="round" strokeWidth={1.5} x1={-26} x2={-14} y1={5} y2={5} />
        <Ellipse cx={0} cy={0.8} fill="rgba(0,0,0,0.20)" rx={16.2} ry={10.6} />
        <Ellipse cx={15.7} cy={0} fill="url(#carHeadGlowLive)" rx={8.5} ry={8.5} />
        <Rect fill="#031713" height={3.2} rx={1.3} width={5.8} x={-9.8} y={-9.3} />
        <Rect fill="#031713" height={3.2} rx={1.3} width={5.8} x={4} y={-9.3} />
        <Rect fill="#031713" height={3.2} rx={1.3} width={5.8} x={-9.8} y={6.1} />
        <Rect fill="#031713" height={3.2} rx={1.3} width={5.8} x={4} y={6.1} />
        <Path
          d="M-13.7 -5.2 C -12 -9 -6.8 -11.3 0 -11.3 C 6.8 -11.3 12 -9 13.7 -5.2 L 15.2 -1.8 C 15.7 -0.7 15.7 0.7 15.2 1.8 L 13.7 5.2 C 12 9 6.8 11.3 0 11.3 C -6.8 11.3 -12 9 -13.7 5.2 L -15.2 1.8 C -15.7 0.7 -15.7 -0.7 -15.2 -1.8 Z"
          fill="url(#carBodyPaintLive)"
          stroke="rgba(241,255,225,0.76)"
          strokeWidth={0.95}
        />
        <Path d="M-13.7 -5.2 C -11.8 -1.6 -11.8 1.6 -13.7 5.2 L -15.2 1.8 C -15.7 0.7 -15.7 -0.7 -15.2 -1.8 Z" fill="rgba(8,53,42,0.34)" />
        <Path
          d="M-4.8 -8.4 C -1.4 -10 4.6 -9.2 9.1 -6.2 C 11.2 -4.8 12.7 -3 13.5 -1.6 C 10.1 -3.6 5.5 -4.7 0.2 -4.4 C -2.2 -4.2 -4 -4.1 -5.8 -3.3 C -6.7 -5.1 -6.4 -7.3 -4.8 -8.4 Z"
          fill="url(#carHighlightPaintLive)"
          opacity={0.92}
        />
        <Path
          d="M-9 -5.9 C -7.2 -8.3 -3.9 -9.4 0 -9.4 C 3.9 -9.4 7.2 -8.3 9 -5.9 C 10.5 -4 11.4 -1.7 11.6 0 C 11.4 1.7 10.5 4 9 5.9 C 7.2 8.3 3.9 9.4 0 9.4 C -3.9 9.4 -7.2 8.3 -9 5.9 C -10.5 4 -11.4 1.7 -11.6 0 C -11.4 -1.7 -10.5 -4 -9 -5.9 Z"
          fill="rgba(226,255,219,0.12)"
          stroke="rgba(255,255,255,0.10)"
          strokeWidth={0.4}
        />
        <Path
          d="M-8.1 -5.1 C -6.6 -7.1 -3.6 -8 0 -8 C 3.6 -8 6.6 -7.1 8.1 -5.1 C 9.25 -3.6 10.1 -1.4 10.28 0 C 10.1 1.4 9.25 3.6 8.1 5.1 C 6.6 7.1 3.6 8 0 8 C -3.6 8 -6.6 7.1 -8.1 5.1 C -9.25 3.6 -10.1 1.4 -10.28 0 C -10.1 -1.4 -9.25 -3.6 -8.1 -5.1 Z"
          fill="url(#carCabinPaintLive)"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={0.55}
        />
        <Path
          d="M-6.2 -4.45 C -4.95 -5.9 -2.75 -6.65 0 -6.65 C 2.75 -6.65 4.95 -5.9 6.2 -4.45 C 7.08 -3.35 7.82 -1.55 7.95 0 C 7.82 1.55 7.08 3.35 6.2 4.45 C 4.95 5.9 2.75 6.65 0 6.65 C -2.75 6.65 -4.95 5.9 -6.2 4.45 C -7.08 3.35 -7.82 1.55 -7.95 0 C -7.82 -1.55 -7.08 -3.35 -6.2 -4.45 Z"
          fill="url(#carGlassPaintLive)"
        />
        <Path d="M0 -6.35 V6.35" stroke="rgba(255,255,255,0.14)" strokeLinecap="round" strokeWidth={0.65} />
        <Path d="M-4.8 0 H4.8" opacity={0.82} stroke="rgba(255,255,255,0.14)" strokeLinecap="round" strokeWidth={0.65} />
        <Ellipse cx={-6.9} cy={-7.8} fill="rgba(255,255,255,0.18)" rx={1.4} ry={0.45} />
        <Ellipse cx={6.9} cy={-7.8} fill="rgba(255,255,255,0.18)" rx={1.4} ry={0.45} />
        <Ellipse cx={-6.9} cy={7.7} fill="rgba(255,255,255,0.18)" rx={1.4} ry={0.45} />
        <Ellipse cx={6.9} cy={7.7} fill="rgba(255,255,255,0.18)" rx={1.4} ry={0.45} />
        <Rect fill="#FF7F5F" height={2.35} rx={0.85} width={1.85} x={-14.2} y={-4.25} />
        <Rect fill="#FF7F5F" height={2.35} rx={0.85} width={1.85} x={-14.2} y={1.95} />
        <Rect fill="#E4FF9C" height={2.25} rx={1} width={2.9} x={12.5} y={-4.45} />
        <Rect fill="#E4FF9C" height={2.25} rx={1} width={2.9} x={12.5} y={2.2} />
      </G>
    </Svg>
  );
}

export function AnimatedCar({
  width,
  height,
  reduceMotion = false,
  duration = CAR_TRIP_MS,
}: Props) {
  const cycle = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const scaleX = width / ROUTE_VIEWBOX.width;
  const scaleY = height / ROUTE_VIEWBOX.height;
  const carScale = Math.min(scaleX, scaleY) * 1.15;

  useEffect(() => {
    const applyPose = (value: number) => {
      const goingForward = value <= 1;
      const raw = goingForward ? value : 2 - value;
      const progress = reduceMotion ? 0.5 : easeInOutSine(raw);
      const pose = getRoutePose(progress, goingForward);
      translateX.setValue(pose.x * scaleX - 18 * carScale);
      translateY.setValue(pose.y * scaleY - 12 * carScale);
      rotate.setValue(pose.angle);
    };

    if (reduceMotion) {
      applyPose(0.5);
      return;
    }

    applyPose(0);
    const listenerId = cycle.addListener(({ value }) => applyPose(value));
    const animation = Animated.loop(
      Animated.timing(cycle, {
        toValue: 2,
        duration: duration * 2,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    );
    animation.start();

    return () => {
      animation.stop();
      cycle.removeListener(listenerId);
      cycle.setValue(0);
    };
  }, [carScale, cycle, duration, reduceMotion, rotate, scaleX, scaleY, translateX, translateY]);

  return (
    <View style={[styles.wrap, { width, height }]}>
      <Svg
        accessibilityElementsHidden
        height={height}
        importantForAccessibility="no-hide-descendants"
        preserveAspectRatio="none"
        style={StyleSheet.absoluteFill}
        viewBox={`0 0 ${ROUTE_VIEWBOX.width} ${ROUTE_VIEWBOX.height}`}
        width={width}
      >
        <Path
          d={ROUTE_PATH_D}
          fill="none"
          stroke="rgba(217,255,111,0.09)"
          strokeLinecap="round"
          strokeWidth={18}
        />
        <Path
          d={ROUTE_PATH_D}
          fill="none"
          stroke="rgba(217,255,111,0.68)"
          strokeDasharray="6 7"
          strokeLinecap="round"
          strokeWidth={2.2}
        />
      </Svg>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.carLayer,
          {
            transform: [
              { translateX },
              { translateY },
              {
                rotate: rotate.interpolate({
                  inputRange: [-360, 360],
                  outputRange: ["-360deg", "360deg"],
                }),
              },
              { scale: carScale },
            ],
          },
        ]}
      >
        <PremiumCarSvg />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: "visible",
  },
  carLayer: {
    height: 36,
    left: 0,
    position: "absolute",
    top: 0,
    width: 36,
  },
});
