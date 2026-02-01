import {
  LeftSquare,
  MiddleTriangle,
  RightCircle,
} from "@/assets/images/svg/distill-parts";
import { MotiView } from "moti";
import { View } from "react-native";
import { Easing } from "react-native-reanimated";

export const ActivityLoader = () => {
  const animationDistance = 8;
  const animationDuration = 600;
  const delayBetweenAnimations = 150;

  return (
    <View
      style={{
        height: 32,
        width: 32,
        flexDirection: "row",
        gap: 8,
      }}
    >
      <MotiView
        from={{ translateY: -animationDistance }}
        animate={{ translateY: animationDistance }}
        transition={{
          type: "timing",
          duration: animationDuration,
          delay: 0,
          easing: Easing.inOut(Easing.cubic),
          loop: true,
          repeatReverse: true,
        }}
      >
        <LeftSquare />
      </MotiView>

      <MotiView
        from={{ translateY: animationDistance }}
        animate={{ translateY: -animationDistance }}
        transition={{
          type: "timing",
          duration: animationDuration,
          delay: delayBetweenAnimations,
          easing: Easing.inOut(Easing.cubic),
          loop: true,
          repeatReverse: true,
        }}
      >
        <MiddleTriangle style={{ transform: [{ translateY: -16 }] }} />
      </MotiView>

      <MotiView
        from={{ translateY: -animationDistance }}
        animate={{ translateY: animationDistance }}
        transition={{
          type: "timing",
          duration: animationDuration,
          delay: delayBetweenAnimations * 2,
          easing: Easing.inOut(Easing.cubic),
          loop: true,
          repeatReverse: true,
        }}
      >
        <RightCircle />
      </MotiView>
    </View>
  );
};
