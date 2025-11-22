// Mock implementation for @pigment-css/react to support React 19
// This is a minimal mock that provides the necessary exports

export function styled(component: any) {
  return component;
}

export function css(...args: any[]) {
  return "";
}

export function keyframes(...args: any[]) {
  return "";
}

export default {
  styled,
  css,
  keyframes,
};
