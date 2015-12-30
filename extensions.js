ArrayBuffer.prototype.getInt8 = function getInt8(index) {
	return new Int8Array(this.slice(index, index + 1))[0];
};

ArrayBuffer.prototype.getInt16 = function getInt16(index) {
	return new Int16Array(this.slice(index, index + 2))[0];
};

ArrayBuffer.prototype.getInt32 = function getInt32(index) {
	return new Int32Array(this.slice(index, index + 4))[0];
};

ArrayBuffer.prototype.getUint8 = function getUint8(index) {
	return new Uint8Array(this.slice(index, index + 1))[0];
};

ArrayBuffer.prototype.getUint16 = function getUint16(index) {
	return new Uint16Array(this.slice(index, index + 2))[0];
};

ArrayBuffer.prototype.getUint32 = function getUint32(index) {
	return new Uint32Array(this.slice(index, index + 4))[0];
};
