function PebbleDrawCommandImage(arrayBuffer) {
	if(!(arrayBuffer instanceof ArrayBuffer))
		throw new Error("Cannot instantiate PDCI without array buffer.");
	validatePDCI(arrayBuffer);

	var reader = new BufferReader(arrayBuffer.slice(8));
	this.version = reader.read8();
	reader.read8(); //reserved value
	this.viewBox = readViewBox(reader);
	this.commands = readCommandList(reader);
}

PebbleDrawCommandImage.prototype.draw = function(context) {
	this.commands.forEach(function(command) {
		command.draw(context);
	});
};

function validatePDCI(arrayBuffer) {
	var magic = new Int8Array(arrayBuffer.slice(0, 4));

	if(!magic.every(function(n, index) { return "PDCI".charCodeAt(index) == n; }))
		throw new Error("Bad magic.");

	var size = arrayBuffer.getInt32(4);
	if(arrayBuffer.byteLength != size + 8)
		throw new Error("Incomplete PDCI.");

	if(arrayBuffer.getInt8(9) !== 0)
		throw new Error("Reserved byte 9 must be 0.");
}
