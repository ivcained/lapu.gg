// Mock implementation for @pigment-css/react to support React 19
// This provides stub implementations for the styled API

/* eslint-disable @typescript-eslint/no-unused-vars */

// The styled function is called like: styled("div")({ styles })
// So it needs to return a function that can be called with styles
export function styled(tag: any) {
  // Return a function that accepts styles and returns the tag
  return function (_styles?: any) {
    // Return a simple passthrough component or the tag itself
    return tag;
  };
}

export function css(..._args: any[]) {
  return "";
}

export function keyframes(..._args: any[]) {
  return "";
}

const mockExports = {
  styled,
  css,
  keyframes,
};

export default mockExports;
