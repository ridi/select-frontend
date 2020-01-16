const ridiSelectPrefixRegex = /^(?=select)/;

export function getBaseUrl(host: string): string {
  return host.startsWith('select.')
    ? host.split('.')
      .filter((part) => !ridiSelectPrefixRegex
        .test(part))
      .join('.')
    : host;
}
