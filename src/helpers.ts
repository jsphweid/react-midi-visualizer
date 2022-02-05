import { SegmentRangeType } from "./types";

export const determineLowestHighestC = (
  midiNotes: number[]
): SegmentRangeType => {
  const maxMidi = Math.max(...midiNotes);
  const minMidi = Math.min(...midiNotes);
  const allCs = Array(255)
    .fill(null)
    .map((_, i) => i)
    .filter(num => num % 12 === 0);
  return {
    lowestMidiNote: allCs.reverse().filter(num => num <= minMidi)[0],
    highestMidiNote: allCs.reverse().filter(num => num >= maxMidi)[0]
  };
};
