import * as React from "react";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Rect,
  Stop,
  SvgProps,
} from "react-native-svg";
export const LeftSquare = (props: SvgProps) => (
  <Svg width={11} height={35} fill="none" {...props}>
    <Rect
      width={10.667}
      height={10.667}
      fill="#fff"
      rx={2.667}
      fillOpacity={1}
    />
    <Path fill="url(#a)" d="M0 5.333h10.667v29.333H0z" />
    <Defs>
      <LinearGradient
        id="a"
        x1={5.333}
        x2={5.333}
        y1={5.333}
        y2={34.667}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#fff" stopOpacity={0.25} />
        <Stop offset={1} stopColor="#fff" stopOpacity={0} />
      </LinearGradient>
    </Defs>
  </Svg>
);

export const MiddleTriangle = (props: SvgProps) => (
  <Svg width={11} height={54} fill="none" {...props}>
    <Path fill="url(#a)" d="M0 5.333h10.667v48H0z" />
    <Path
      fill="#fff"
      fillOpacity={1}
      d="M1.238 7.335c-1.65-.825-1.65-3.179 0-4.003L7.426.239c1.489-.744 3.24.338 3.24 2.002v6.185c0 1.663-1.751 2.745-3.24 2.002L1.238 7.335Z"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={5.333}
        x2={5.333}
        y1={5.333}
        y2={53.333}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#fff" stopOpacity={0.25} />
        <Stop offset={1} stopColor="#fff" stopOpacity={0} />
      </LinearGradient>
    </Defs>
  </Svg>
);

export const RightCircle = (props: SvgProps) => (
  <Svg width={11} height={35} fill="none" {...props}>
    <Circle cx={5.333} cy={5.333} r={5.333} fill="#fff" fillOpacity={1} />
    <Path fill="url(#a)" d="M0 5.333h10.667v29.333H0z" />
    <Defs>
      <LinearGradient
        id="a"
        x1={5.333}
        x2={5.333}
        y1={5.333}
        y2={34.667}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#fff" stopOpacity={0.25} />
        <Stop offset={1} stopColor="#fff" stopOpacity={0} />
      </LinearGradient>
    </Defs>
  </Svg>
);
