import * as React from "react";
import * as ReactDOM from "react-dom";

import { sample1, sample2 } from "./sample";
import ReactMidiVisualizer from "./react-midi-visualizer";

function App() {
  const [ac, setAc] = React.useState<AudioContext | null>(null);
  const [startTime, setStartTime] = React.useState<number | null>(null);
  const [notes, setNotes] = React.useState(sample1);

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
    setNotes(notes === sample1 ? sample2 : sample1);
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
        notes={notes}
        options={{
          fps: 60,
          keyboardHeight: 200,
          pixelsPerSecondFall: 200
        }}
      />
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
