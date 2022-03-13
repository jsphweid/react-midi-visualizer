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

  let lowestMidiNote = allCs.reverse().filter(num => num <= minMidi)[0];
  let highestMidiNote = allCs.reverse().filter(num => num >= maxMidi)[0];

  // If there is only 1 note (and it's a C), then at least display an octave...
  if (lowestMidiNote === highestMidiNote) {
    lowestMidiNote -= 12;
  }

  return { lowestMidiNote, highestMidiNote };
};
