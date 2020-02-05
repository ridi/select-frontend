export function prefixDot(string?: string) {
  return string && string.length > 0 ? `.${string}` : '';
}

export function getSectionStringForTracking(
  serviceTitle: string,
  pageTitle: string,
  uiPartTitle?: string,
  filter?: string,
) {
  return `${serviceTitle}${prefixDot(pageTitle)}${prefixDot(uiPartTitle)}${prefixDot(filter)}`;
}

export function mixedMiscTracking(miscTracking: string, miscObject: string) {
  const miscTrackingJSON = JSON.parse(miscTracking);
  const miscObjectJSON = JSON.parse(miscObject);

  return JSON.stringify({
    ...miscTrackingJSON,
    ...miscObjectJSON,
  });
}
