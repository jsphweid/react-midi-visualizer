export interface ReactMidiVisualizerOptionsType {
	fps?: number
	keyboardHeight?: number
	pixelsPerSecondFall?: number
}

export interface SegmentRangeType {
	lowestMidiNote: number
	highestMidiNote: number
}

export interface PointType {
	x: number
	y: number
}

export interface NoteToDrawType {
	point: PointType
	depressed: boolean
}
