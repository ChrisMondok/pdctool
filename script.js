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

function drawPDCI(pdci, name) {
	var canvas = document.createElement('canvas');
	canvas.width = pdci.viewBox.width;
	canvas.height = pdci.viewBox.height;
	var context = canvas.getContext('2d');
	context.fillStyle = 'purple';
	context.fillRect(0, 0, canvas.width, canvas.height);
	pdci.draw(context);

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
	readPDCI(file, function(pdci) {
		drawPDCI(pdci, file.name);
	});
}

function readPDCI(file, callback) {
	var reader = new FileReader();

	reader.addEventListener('error', function(e) {
		alert("Error reading file.");
	});
	reader.addEventListener('load', function(e) {
		callback(new PebbleDrawCommandImage(e.target.result));
	});

	reader.readAsArrayBuffer(file);
}

addEventListener('load', getThisPartyStarted);
