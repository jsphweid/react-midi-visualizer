import * as React from "react";
import * as ReactDOM from "react-dom";

import { sample1, sample2, sample3 } from "./sample";
import ReactMidiVisualizer from "./react-midi-visualizer";

const samples = [sample1, sample2, sample3];

function App() {
  const [ac, setAc] = React.useState<AudioContext | null>(null);
  const [startTime, setStartTime] = React.useState<number | null>(null);
  const [sampleIndex, setSampleIndex] = React.useState(0);

  async function startAudioContext() {
    const ac = new AudioContext();
    while (!ac.currentTime) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    setAc(ac);
    return ac;
  }

  async function start() {
    const ac = await startAudioContext();
    setStartTime(ac.currentTime);
  }

  function handleChange() {
    setSampleIndex(sampleIndex + 1);
  }

  return (
    <>
      <button onClick={start}>start</button>
      <button onClick={handleChange}>change</button>
      <br />
      <ReactMidiVisualizer
        audioContext={ac}
        height={500}
        width={800}
        startTime={startTime}
        notes={samples[sampleIndex % samples.length]}
        options={{
          fps: 120,
          keyboardHeight: 200,
          pixelsPerSecondFall: 200
        }}
      />
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
