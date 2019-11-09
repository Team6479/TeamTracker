export function mean(array: Array<number>) {
  if (array.length === 0) {return 0};
  return array.reduce((total, value) => total + value) / array.length;
}
