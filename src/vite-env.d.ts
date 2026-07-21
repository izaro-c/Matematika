declare module '*.mdx' {
  const MDXComponent: (props: Record<string, unknown>) => JSX.Element;
  export default MDXComponent;
}

declare namespace JXG {
  interface LabelOptions {
    cssClass?: string;
    highlightCssClass?: string;
  }
}

