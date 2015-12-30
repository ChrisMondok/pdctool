function getThisPartyStarted() {
	document.body.appendChild(createUploadForm());
}

var viewers = [];

function createUploadForm() {
	var form = document.createElement('form');
	var label = document.createElement('label');
	label.textContent = 'Choose a PDC file';
	form.appendChild(label);

	var input = document.createElement('input');
	input.type = 'file';
	label.appendChild(input);

	input.addEventListener('change', filePicked);
	return form;
}

function filePicked(event) {
	var file = event.target.files[0];
	if(!file)
		return;
	readPDC(file, function(pdc) {
		var viewer = new PDCViewer(pdc, file.name);
		this.viewers.push(viewer);
		viewer.appendTo(document.body);
	});
	event.target.value = '';
}

function readPDC(file, callback) {
	var reader = new FileReader();

	reader.addEventListener('error', function(e) {
		alert("Error reading file.");
	});
	reader.addEventListener('load', function(e) {
		callback(loadPDC(e.target.result));
	});

	reader.readAsArrayBuffer(file);
}

function loadPDC(arrayBuffer) {
	var reader = new BufferReader(arrayBuffer);

	var magic = [0,0,0,0].map(function() {
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

	viewers.forEach(function(v) {
		v.draw(delta);
	});

	requestAnimationFrame(drawAll);
}

requestAnimationFrame(drawAll);

addEventListener('load', getThisPartyStarted);
