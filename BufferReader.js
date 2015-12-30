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
	return new Int8Array(this.getN(8))[0];
};

BufferReader.prototype.read16 = function() {
	return new Int16Array(this.getN(16))[0];
};

BufferReader.prototype.read32 = function() {
	return new Int32Array(this.getN(32))[0];
};

BufferReader.prototype.read8U = function() {
	return new Uint8Array(this.getN(8))[0];
};

BufferReader.prototype.read16U = function() {
	return new Uint16Array(this.getN(16))[0];
};

BufferReader.prototype.read32U = function() {
	return new Uint32Array(this.getN(32))[0];
};

Object.defineProperty(BufferReader.prototype, 'remainingBytes', {
	get: function() {
		return this.buffer.byteLength - this.offset;
	}
});
