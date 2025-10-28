import { system, type Config } from 'styled-system'

const config: Config = {
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
}

export const animation = system(config)
