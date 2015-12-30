function BufferReader(arrayBuffer) {
	if(!(arrayBuffer instanceof ArrayBuffer))
		throw new Error("Expected an ArrayBuffer, got %O", arrayBuffer);

	this.offset = 0;
	this.buffer = arrayBuffer;
}

BufferReader.prototype.getN = function(n) {
	if(n % 8)
		throw new Error("N must be a multiple of 8.");
	var o = this.offset;
	this.offset += n/8;

	if(this.offset > this.buffer.byteLength)
		throw new Error("Buffer underrun!");

	return this.buffer.slice(o, this.offset);
};

BufferReader.prototype.read8 = function() {
	return this.getN(8).getInt8(0);
};

BufferReader.prototype.read16 = function() {
	return this.getN(16).getInt16(0);
};

BufferReader.prototype.read32 = function() {
	return this.getN(32).getInt32(0);
};

BufferReader.prototype.read8U = function() {
	return this.getN(8).getUint8(0);
};

BufferReader.prototype.read16U = function() {
	return this.getN(16).getUint16(0);
};

BufferReader.prototype.read32U = function() {
	return this.getN(32).getUint32(0);
};

Object.defineProperty(BufferReader.prototype, 'remainingBytes', {
	get: function() {
		return this.buffer.byteLength - this.offset;
	}
});
