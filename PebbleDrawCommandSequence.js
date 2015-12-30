function PebbleDrawCommandSequence(arrayBuffer) {
	var reader = new BufferReader(arrayBuffer);

	reader.read32(); //magic

	if(reader.read32() !== reader.remainingBytes)
		throw new Error("PDCS truncated");

	this.version = reader.read8();

	if(reader.read8() !== 0)
		throw new Error("Reserved byte 9 must be 0.");

	this.viewBox = readViewBox(reader);

	this.playCount = reader.read16();

	this.frames = new Array(reader.read16());

	var startTime = 0;
	for(var i = 0; i < this.frames.length; i++) {
		this.frames[i] = readFrame(reader);
		this.frames[i].startTime = startTime;
		startTime += this.frames[i].duration;
	}
}

PebbleDrawCommandSequence.prototype.getFrame = function getFrame(time) {
	return this.frames.find(function checkFrameTiming(frame) {
		return frame.startTime + frame.duration >= time;
	}) || this.frames[this.frames.length - 1];
};

PebbleDrawCommandSequence.prototype.draw = function draw(context, time) {
	var commands = this.getFrame(time).commands;
	for(var i = 0; i < commands.length; i++)
		commands[i].draw(context);
};

PebbleDrawCommandSequence.prototype.drawFrame = function drawFrame(context, frame) {
	var commands = this.frames[frame].commands;
	for(var i = 0; i < commands.length; i++)
		commands[i].draw(context);
};

Object.defineProperty(PebbleDrawCommandSequence.prototype, 'duration', {
	get: function getDuration() {
		var lastFrame = this.frames[this.frames.length - 1];
		return lastFrame.startTime + lastFrame.duration;
	}
});

function readFrame(reader) {
	var frame = {};
	frame.duration = reader.read16();
	var numCommands = reader.read16();
	frame.commands = new Array(numCommands);
	for(var i = 0; i < numCommands; i++)
		frame.commands[i] = new PebbleDrawCommand(reader);
	return frame;
}
