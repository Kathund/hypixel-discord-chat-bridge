// eslint-disable-next-line import/prefer-default-export
export function Delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
