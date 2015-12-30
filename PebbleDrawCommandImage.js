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
