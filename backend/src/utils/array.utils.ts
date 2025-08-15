// Fisher-Yates (aka Knuth) Shuffle algoritmi
export function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length,
    randomIndex;

  // Massivda elementlar qolguncha...
  while (currentIndex !== 0) {
    // Qolgan elementlardan tasodifiy birini tanlaymiz...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // Va uni joriy element bilan almashtiramiz.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
