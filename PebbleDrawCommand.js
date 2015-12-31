function PebbleDrawCommand(reader) {
	if(!(reader instanceof BufferReader))
		throw new Error("reader must be a BufferReader.");

	this.type = reader.read8();
	if(this.type === 0)
		throw new Error('Invalid command type.');
	this.flags = reader.read8();
	this.strokeColor = getColor(reader.read8U());
	this.strokeWidth = reader.read8U();
	this.fillColor = getColor(reader.read8U());

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
	if(this.hidden)
		return;
	ctx.lineWidth = this.strokeWidth;
	ctx.lineCap = 'round';

	ctx.fillStyle = this.fillColor.color;
	ctx.strokeStyle = this.strokeColor.color;

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

PebbleDrawCommand.prototype.getBounds = function() {
	return this.points.map(function(point) {
		return {
			min: {x: point.x, y: point.y},
			max: {x: point.x, y: point.y}
		};
	}).reduce(extendBounds);
};

Object.defineProperty(PebbleDrawCommand.prototype, 'hidden', {
	get: function isHidden() {
		return this.flags & 1;
	},
	set: function setHidden(h) {
		if(h)
			this.flags |= 1;
		else
			this.flags &= 254;
	}
});

function extendBounds(a, b) {
	return {
		min: {
			x: Math.min(a.min.x, b.min.x),
			y: Math.min(a.min.y, b.min.y)
		},
		max: {
			x: Math.max(a.max.x, b.max.x),
			y: Math.max(a.max.y, b.max.y)
		}
	};
}

function drawPath(ctx) {
	ctx.beginPath();

	for(var i = 0; i < this.points.length; i++)
		ctx.lineTo(this.points[i].x, this.points[i].y);

	if(!this.open) {
		ctx.closePath();
		ctx.fill();
	}

	if(this.strokeWidth)
		ctx.stroke();
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
