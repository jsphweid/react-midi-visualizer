# react-conductor

conductor for simple time signatures based off the browser's highly accurate starting clock

# usage

currently you can use by passing like so:

```
    <ReactConductor
        audioContext={audioContext}
        height={500}
        width={500}
        bpm={BPM}
        startTime={startTime}
        options={{ acceleration: 0.8 }}
    />
```

Options is an object that is completely optional and can contain any of these properties:

```
	acceleration?: number
	lineWidth?: number
	circleRadius?: number
	fps?: number
```

The rest of the props are required.

The image will be boring and static until you pass in a startTime that is anything but null / 0.
