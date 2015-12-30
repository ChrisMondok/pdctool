function PDCViewer(pdc, dom) {
	this.pdc = pdc;
	this.backgroundColor = 'purple';
	this.bindToDom(dom);
	this.draw();
	if(pdc instanceof PebbleDrawCommandSequence) {
		this.elapsed = 0;
		this.playing = true;
	}
}

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

PDCViewer.prototype.bindToDom = function(dom) {
	var canvas = dom.querySelector('canvas');
	canvas.width = this.pdc.viewBox.width;
	canvas.height = this.pdc.viewBox.height;

	var context = canvas.getContext('2d');
	this.context = canvas.getContext('2d');

	this.playbackControls = dom.querySelector('.playback-controls');
	this.playbackControls.style.display = this.pdc instanceof PebbleDrawCommandSequence
		? 'block'
		: 'none';

	var play = dom.querySelector('button[data-action=toggle]');

	play.addEventListener('click', function togglePlayback() {
		this.playing = !this.playing;
	}.bind(this));

	var rewind = dom.querySelector('[data-action=rewind]');
	rewind.addEventListener('click', function rewind() {
		this.elapsed = 0;
		this.playbackControls.querySelector('[data-action=seek]').value = 0;
	}.bind(this));

	var scrubber = dom.querySelector('[data-action=seek]');
	scrubber.min = 0;
	scrubber.max = this.pdc.duration;

	scrubber.addEventListener('input', function(e) {
		this.elapsed = Number(e.target.value);
	}.bind(this));
};

PDCViewer.prototype.updateControls = function() {
	this.playbackControls.querySelector('[data-action=toggle]').textContent = this.playing ? 'Pause' : 'Play';
	if(this.playing)
		this.playbackControls.querySelector('[data-action=seek]').value = this.elapsed;

	this.playbackControls.querySelector('.elapsed').textContent = (Math.floor(this.elapsed) / 1000).toFixed(3);
	this.playbackControls.querySelector('.duration').textContent = (this.pdc.duration / 1000).toFixed(3);
};
