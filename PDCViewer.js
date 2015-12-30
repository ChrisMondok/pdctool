function PDCViewer(pdc) {
	this.pdc = pdc;
	this.node = this.createDom(pdc);
	this.backgroundColor = 'purple';
	this.draw();
	if(pdc instanceof PebbleDrawCommandSequence) {
		this.elapsed = 0;
		this.playing = true;
	}
}

PDCViewer.prototype.appendTo = function(node) {
	node.appendChild(this.node);
};

PDCViewer.prototype.draw = function(dt) {
	this.context.fillStyle = this.backgroundColor;
	this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
	if(this.playing) {
		this.elapsed += dt;
		if(this.elapsed > this.pdc.duration)
			this.elapsed = 0;
	}
	this.pdc.draw(this.context, this.elapsed || 0);
	this.updateControls();
};

PDCViewer.prototype.createDom = function(pdc) {
	var canvas = document.createElement('canvas');
	canvas.width = pdc.viewBox.width;
	canvas.height = pdc.viewBox.height;
	var context = canvas.getContext('2d');
	this.context = canvas.getContext('2d');

	var node = document.createElement('div');
	node.appendChild(canvas);

	if(pdc instanceof PebbleDrawCommandSequence)
		node.appendChild(this.createPlaybackControls());

	return node;
};

PDCViewer.prototype.createPlaybackControls = function() {
	var controls = document.createElement('div');
	controls.className = 'playback-controls';

	var play = document.createElement('button');
	play.textContent = 'Play / Pause';
	play.className = 'play-pause';
	controls.appendChild(play);

	play.addEventListener('click', function togglePlayback() {
		this.playing = !this.playing;
	}.bind(this));

	var rewind = document.createElement('button');
	rewind.textContent = 'Rewind';
	controls.appendChild(rewind);

	rewind.addEventListener('click', function rewind() {
		this.elapsed = 0;
		this.node.querySelector('.playback-controls .scrubber').value = 0;
	}.bind(this));

	var scrubber = document.createElement('input');
	scrubber.type = 'range';
	scrubber.className = 'scrubber';
	scrubber.min = 0;
	scrubber.max = this.pdc.duration;
	controls.appendChild(scrubber);

	scrubber.addEventListener('input', function(e) {
		this.elapsed = Number(e.target.value);
	}.bind(this));

	var timeDisplay = document.createElement('div');
	timeDisplay.className = 'time-display';
	controls.appendChild(timeDisplay);

	return controls;
};

PDCViewer.prototype.updateControls = function() {
	var controls = this.node.querySelector('.playback-controls');
	if(!controls)
		return;

	controls.querySelector('.play-pause').textContent = this.playing ? 'Pause' : 'Play';
	if(this.playing)
		controls.querySelector('.scrubber').value = this.elapsed;
	controls.querySelector('.time-display').textContent = Math.round(this.elapsed) + ' / ' + this.pdc.duration;
};
