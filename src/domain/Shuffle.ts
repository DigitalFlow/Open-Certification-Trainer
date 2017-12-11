// Shuffles array in-place
export default function shuffle<T>(array: Array<T>): void {
  let j, x, i;

  if (!array) {
    return;
  }

  for (i = array.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = array[i];
      array[i] = array[j];
      array[j] = x;
  }
}
