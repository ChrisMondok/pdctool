function PebbleDrawCommand(reader) {
	if(!(reader instanceof BufferReader))
		throw new Error("reader must be a BufferReader.");

	this.type = reader.read8();
	if(this.type === 0)
		throw new Error('Invalid command type.');
	this.flags = reader.read8();
	this.strokeColor = reader.read8U();
	this.strokeWidth = reader.read8U();
	this.fillColor = reader.read8U();

	var openOrRadius = reader.read16();
	if(this.type == 2)
		this.radius = openOrRadius;
	else
		this.open = !!openOrRadius;
	
	var numPoints = reader.read16();

	this.points = new Array(numPoints);

	for(var i = 0; i < numPoints; i++)
		this.points[i] = readPoint(reader, this.type == 3);
}

PebbleDrawCommand.prototype.draw = function drawCommand(ctx) {
	ctx.lineWidth = this.strokeWidth;
	ctx.lineCap = 'round';

	ctx.fillStyle = getColor(this.fillColor).color;
	ctx.strokeStyle = getColor(this.strokeColor).color;

	switch(this.type) {
		case 1:
		case 3:
			drawPath.call(this, ctx);
			break;
		case 2:
			drawCircle.call(this, ctx);
			break;
		default:
			throw new Error("Draw command of type %d not implemented", this.type);
	}
};

function drawPath(ctx) {
	ctx.beginPath();

	for(var i = 0; i < this.points.length; i++)
		ctx.lineTo(this.points[i].x, this.points[i].y);

	if(this.open)
		ctx.stroke();
	else {
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}
}

function drawCircle(ctx) {
	for(var i = 0; i < this.points.length; i++) {
		var point = this.points[i];
		ctx.beginPath();
		ctx.arc(point.x, point.y, this.radius, 0, 2 * Math.PI, false);
		ctx.fill();
		ctx.stroke();
	}
}

function readPoint(reader, precise) {
	var point = {};

	var x = reader.read16();
	var y = reader.read16();

	if(precise) {
		x /= 8;
		y /= 8;
	}

	point.x = x;
	point.y = y;
	return point;
}

function toPrecise(sixteenBits) {
	return sixteenBits/8;
}
