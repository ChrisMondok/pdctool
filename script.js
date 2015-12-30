addEventListener('load', function getThisPartyStarted() {
	document.body.appendChild(createUploadForm());
	requestAnimationFrame(drawAll);
});

var viewers = [];

function createUploadForm() {
	var form = document.createElement('form');
	var label = document.createElement('label');
	label.textContent = 'Choose a PDC file';
	form.appendChild(label);

	var input = document.createElement('input');
	input.type = 'file';
	input.multiple = true;
	label.appendChild(input);

	input.addEventListener('change', filePicked);
	return form;
}

function filePicked(event) {
	for(var i = 0; i < event.target.files.length; i++) {
		var file = event.target.files[i];
		readPDC(file, function addViewer(pdc) {
			var figure = document.createElement('figure');

			var viewer = new PDCViewer(pdc);
			this.viewers.push(viewer);
			viewer.appendTo(figure);

			var remove = document.createElement('button');
			remove.textContent = 'X';

			var caption = document.createElement('figcaption');
			caption.textContent = file.name;
			caption.appendChild(remove);
			figure.insertBefore(caption, figure.firstChild);

			remove.addEventListener('click', function removeViewer() {
				viewers.splice(viewers.indexOf(viewer), 1);
				document.body.removeChild(figure);
			});

			document.body.appendChild(figure);
		});
	}
	event.target.value = '';
}

function readPDC(file, callback) {
	var reader = new FileReader();

	reader.addEventListener('error', function(e) {
		alert("Error reading file.");
	});
	reader.addEventListener('load', function fileLoaded(e) {
		callback(loadPDC(e.target.result));
	});

	reader.readAsArrayBuffer(file);
}

function loadPDC(arrayBuffer) {
	var reader = new BufferReader(arrayBuffer);

	var magic = [0,0,0,0].map(function getChar() {
		return String.fromCharCode(reader.read8());
	}).join('');

	switch (magic) {
		case "PDCI":
			return new PebbleDrawCommandImage(arrayBuffer);
		case "PDCS":
			return new PebbleDrawCommandSequence(arrayBuffer);
		default:
			throw new Error("Bad magic.");
	}
}

var lastTs = 0;
function drawAll(ts) {
	var delta = ts - lastTs;
	lastTs = ts;

	for(var i = 0; i < viewers.length; i++)
		viewers[i].draw(delta);

	requestAnimationFrame(drawAll);
}
