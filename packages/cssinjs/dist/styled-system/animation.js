// src/styled-system/animation.ts
import { system } from "styled-system";
var config = {
  animation: true,
  animationName: true,
  animationDuration: true,
  animationTimingFunction: true,
  animationDelay: true,
  animationIterationCount: true,
  animationDirection: true,
  animationFillMode: true,
  animationPlayState: true,
  animationTimeline: true,
  animationRange: true,
  animationRangeStart: true,
  animationRangeEnd: true,
  AnimationComposition: true
};
var animation = system(config);
export {
  animation
};
