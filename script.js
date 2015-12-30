function getThisPartyStarted() {
	document.body.appendChild(createUploadForm());
}

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

function drawPDC(pdc, name) {
	var canvas = document.createElement('canvas');
	canvas.width = pdc.viewBox.width;
	canvas.height = pdc.viewBox.height;
	var context = canvas.getContext('2d');
	context.fillStyle = 'purple';
	context.fillRect(0, 0, canvas.width, canvas.height);
	pdc.draw(context);

	var figure = document.createElement('figure');
	figure.appendChild(canvas);

	if(name) {
		var caption = document.createElement('figcaption');
		caption.textContent = name;

		figure.appendChild(caption);
	}

	document.body.appendChild(figure);
}

function filePicked(event) {
	var file = event.target.files[0];
	readPDC(file, function(pdc) {
		drawPDC(pdc, file.name);
	});
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

addEventListener('load', getThisPartyStarted);
