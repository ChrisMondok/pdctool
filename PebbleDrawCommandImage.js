function PebbleDrawCommandImage(arrayBuffer) {
	var reader = new BufferReader(arrayBuffer);

	reader.read32(); //magic

	if(reader.read32() !== reader.remainingBytes)
		throw new Error("PDCI truncated");

	this.version = reader.read8();

	if(reader.read8() !== 0)
		throw new Error("Reserved byte 9 must be 0.");

	this.viewBox = readViewBox(reader);
	this.commands = readCommandList(reader);
}

PebbleDrawCommandImage.prototype.draw = function drawImage(context, time) {
	for(var i = 0; i < this.commands.length; i++)
		this.commands[i].draw(context);
};

PebbleDrawCommandImage.prototype.getOverflow = function() {
	var bounds = this.getBounds();
	var under = -Math.min(bounds.min.x, bounds.min.y);
	var over = Math.max(bounds.max.x - this.viewBox.width, bounds.max.y - this.viewBox.height);
	return Math.max(under, over);
};

PebbleDrawCommandImage.prototype.getBounds = function getBounds() {
	return this.commands.map(function(cmd) {
		return cmd.getBounds();
	}).reduce(extendBounds, {
		min: {x: 0, y: 0},
		max: {x: this.viewBox.width, y: this.viewBox.height}
	});
};

function readViewBox(reader) {
	var width = reader.read16(),
		height = reader.read16();
	return { width: width, height: height };
}

function readCommandList(reader) {
	var commands = new Array(reader.read16());

	for(var i = 0; i < commands.length; i++)
		commands[i] = new PebbleDrawCommand(reader);

	return commands;
}
