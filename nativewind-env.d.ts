/// <reference types="nativewind/types" />

// Allow CSS imports for NativeWind
declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}
