import * as React from "react";
import Svg, {
  Circle,
  ClipPath,
  Defs,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
  SvgProps,
} from "react-native-svg";
const SvgComponent = (props: SvgProps) => (
  <Svg width={135} height={36} fill="none" {...props}>
    <Rect
      width={33.75}
      height={33.75}
      x={1.125}
      y={1.125}
      stroke="#fff"
      strokeWidth={2.25}
      rx={10.125}
      strokeOpacity={1}
    />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.25}
      d="M24.75 13.5a3.375 3.375 0 1 0 0-6.75 3.375 3.375 0 0 0 0 6.75ZM11.25 21.375a3.375 3.375 0 1 0 0-6.75 3.375 3.375 0 0 0 0 6.75ZM24.75 29.25a3.375 3.375 0 1 0 0-6.75 3.375 3.375 0 0 0 0 6.75ZM14.164 19.699l7.684 4.477M21.836 11.824 14.164 16.3M74.25 13.5l4.5 4.5-4.5 4.5M56.25 18h22.5"
      strokeOpacity={1}
    />
    <G clipPath="url(#a)">
      <Rect width={36} height={36} x={99} fill="url(#b)" rx={12} />
      <Path fill="url(#c)" d="M114.375 11.25h6v27h-6z" />
      <Rect
        width={6}
        height={6}
        x={102.375}
        y={18.75}
        fill="#fff"
        rx={1.5}
        fillOpacity={1}
      />
      <Path
        fill="#fff"
        d="M115.071 13.126c-.928-.464-.928-1.788 0-2.252l3.481-1.74a1.26 1.26 0 0 1 1.823 1.126v3.48a1.26 1.26 0 0 1-1.823 1.126l-3.481-1.74Z"
        fillOpacity={1}
      />
      <Circle cx={129.375} cy={22.5} r={3} fill="#fff" fillOpacity={1} />
      <Path fill="url(#d)" d="M126.375 22.5h6V39h-6z" />
      <Path fill="url(#e)" d="M102.375 21.75h6v16.5h-6z" />
    </G>
    <Defs>
      <LinearGradient
        id="b"
        x1={117}
        x2={117}
        y1={0}
        y2={36}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#484848" stopOpacity={1} />
        <Stop offset={1} stopColor="black" stopOpacity={1} />
      </LinearGradient>
      <LinearGradient
        id="c"
        x1={117.375}
        x2={117.375}
        y1={11.25}
        y2={38.25}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#fff" stopOpacity={0.25} />
        <Stop offset={1} stopColor="#fff" stopOpacity={0} />
      </LinearGradient>
      <LinearGradient
        id="d"
        x1={129.375}
        x2={129.375}
        y1={22.5}
        y2={39}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#fff" stopOpacity={0.25} />
        <Stop offset={1} stopColor="#fff" stopOpacity={0} />
      </LinearGradient>
      <LinearGradient
        id="e"
        x1={105.375}
        x2={105.375}
        y1={21.75}
        y2={38.25}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#fff" stopOpacity={0.25} />
        <Stop offset={1} stopColor="#fff" stopOpacity={0} />
      </LinearGradient>
      <ClipPath id="a">
        <Rect
          width={36}
          height={36}
          x={99}
          fill="#fff"
          rx={12}
          fillOpacity={1}
        />
      </ClipPath>
    </Defs>
  </Svg>
);
export { SvgComponent as ShareGuideGlyph };
