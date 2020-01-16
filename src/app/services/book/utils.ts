export function formatFileSize(size: number): string {
  if (!size) {
    return '';
  }
  const oneMegabyte = 1024;
  return `${(size / oneMegabyte).toFixed(1)}MB`;
}

export function formatFileCount(count: number): string {
  if (!count) {
    return '';
  }

  let floorNums = 0;
  let unit = '';

  if (count < 1000) {
    // DO NOTHING
  } else if (count < 10000) {
    floorNums = Number(Math.round(count / 100)) / 10;
    unit = '천';
  } else if (count < 100000000) {
    floorNums = Number(Math.round(count / 1000)) / 10;
    unit = '만';
  }

  return (
    floorNums > 0 ? `약 ${floorNums}${unit} 자` : ''
  );
}
