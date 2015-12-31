function PDCCanvas(pdc, canvas) {
	this.pdc = pdc;
	this.overflow = Math.ceil(pdc.getOverflow());
	this.context = canvas.getContext('2d');
	this.backgroundColor = 'purple';
	canvas.width = this.pdc.viewBox.width + 2 * this.overflow;
	canvas.height = this.pdc.viewBox.height + 2 * this.overflow;
}

PDCCanvas.prototype.draw = function draw(time) {
	this.context.save();
	this.context.fillStyle = this.backgroundColor;
	this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);

	this.context.translate(this.overflow, this.overflow);

	if(this.overflow > 0) {
		this.context.lineWidth = 1;
		this.context.strokeStyle = 'white';
		this.context.beginPath();
		this.context.rect(0, 0, this.pdc.viewBox.width, this.pdc.viewBox.height);
		this.context.stroke();
	}

	this.pdc.draw(this.context, time);

	this.context.restore();
};
