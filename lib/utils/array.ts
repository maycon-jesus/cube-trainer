export function randomFromArr<T>(arr: T[]): [T, number] {
  const n = Math.floor(Math.random() * arr.length)
  return [arr[n]!, n]
}