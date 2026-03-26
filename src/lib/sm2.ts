/**
 * SuperMemo-2 (SM-2) Algorithm
 * 
 * @param quality 0-5 (0: total blackout, 5: perfect response)
 * @param interval previous interval (days)
 * @param repetition previous repetition count
 * @param easeFactor previous ease factor (default 2.5)
 */
export function calculateSM2(quality: number, interval: number, repetition: number, easeFactor: number) {
  let nextInterval: number;
  let nextRepetition: number;
  let nextEaseFactor: number;

  if (quality >= 3) {
    // Correct response
    if (repetition === 0) {
      nextInterval = 1;
    } else if (repetition === 1) {
      nextInterval = 6;
    } else {
      nextInterval = Math.round(interval * easeFactor);
    }
    nextRepetition = repetition + 1;
  } else {
    // Incorrect response
    nextInterval = 1;
    nextRepetition = 0;
  }

  // Calculate next ease factor
  nextEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (nextEaseFactor < 1.3) nextEaseFactor = 1.3;

  return {
    interval: nextInterval,
    repetition: nextRepetition,
    easeFactor: nextEaseFactor,
    nextReview: new Date(Date.now() + nextInterval * 24 * 60 * 60 * 1000)
  };
}
