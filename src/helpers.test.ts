import { determineLowestHighestC } from "./helpers";

describe("helpers", () => {
  describe("determineLowestHighestC", () => {
    it("should determine the lowest and highest when obvious", () => {
      expect(determineLowestHighestC([61, 62, 63])).toEqual({
        lowestMidiNote: 60,
        highestMidiNote: 72
      });
    });

    it("should determine the lowest and highest when have equals", () => {
      expect(determineLowestHighestC([60, 62, 72])).toEqual({
        lowestMidiNote: 60,
        highestMidiNote: 72
      });
    });

    it("should determine the lowest and highest when off a little", () => {
      expect(determineLowestHighestC([59, 62, 73])).toEqual({
        lowestMidiNote: 48,
        highestMidiNote: 84
      });
    });
  });
});
