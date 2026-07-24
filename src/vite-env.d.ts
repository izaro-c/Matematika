/// <reference types="vite/client" />

declare module '*.mdx' {
  const MDXComponent: (props: Record<string, unknown>) => JSX.Element;
  export default MDXComponent;
}

interface ImportMetaEnv {
  readonly VITE_EDITOR_API_URL?: string;
}

declare namespace JXG {
  interface LabelOptions {
    cssClass?: string;
    highlightCssClass?: string;
  }
}
