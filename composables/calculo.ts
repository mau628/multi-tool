export const roundUp = (num: number, precision: number = 2): number => {
  precision = Math.pow(10, precision)
  return Math.ceil(num * precision) / precision
}