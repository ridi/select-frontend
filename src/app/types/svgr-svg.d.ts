declare module '*.svg' {
  const SvgElement: React.ComponentType<React.SVGProps<SVGElement>>;
  export = SvgElement;
}
