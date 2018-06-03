import * as React from 'react'
import * as ReactDOM from 'react-dom'
import data from './sample'
import ReactMidiVisualizer from './react-midi-visualizer'

const BPM = 120
const audioContext: AudioContext = new AudioContext()
const allOscs: OscillatorNode[] = []
let startTime = null

let alreadyStarted = false

function render(startTime = 0) {
	ReactDOM.render(
		<ReactMidiVisualizer
			audioContext={audioContext}
			height={500}
			width={800}
			startTime={startTime}
			notes={data[0].midiJson.tracks[0].notes}
		/>,
		document.getElementById('app')
	)
}

function startRecording() {
	startTime = audioContext.currentTime
	if (alreadyStarted) {
		restartAudioContext()
	}
	alreadyStarted = true
	render(startTime)
}

async function restartAudioContext() {
	allOscs.forEach(osc => {
		osc.disconnect()
	})
}

render()

ReactDOM.render(<button onClick={startRecording.bind(this)}>Start</button>, document.getElementById('btn'))
