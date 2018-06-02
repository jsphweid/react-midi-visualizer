export const determineLowestHighestC = (midiNotes: number[]): { lowestC: number; highestC: number } => {
	const maxMidi = Math.max(...midiNotes)
	const minMidi = Math.min(...midiNotes)
	const allCs = Array(255)
		.fill(null)
		.map((_, i) => i)
		.filter(num => num % 12 === 0)
	return {
		lowestC: allCs.reverse().filter(num => num <= minMidi)[0],
		highestC: allCs.reverse().filter(num => num >= maxMidi)[0]
	}
}
