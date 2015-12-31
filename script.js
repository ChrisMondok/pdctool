addEventListener('load', function getThisPartyStarted() {
	var list = document.querySelector('#pdc-list');
	list.querySelector('input[type=file]').addEventListener('change', filePicked);
	requestAnimationFrame(drawAll);
	document.body.className = 'list';
	editor = new PDCEditor(document.querySelector('[data-role=editor]'));
	document.querySelector('[data-action=back]').addEventListener('click', function() {
		document.body.className = 'list';
	});
});

var editor = null;

var viewers = [];

function filePicked(event) {
	var list = document.querySelector('#pdc-list');
	for(var i = 0; i < event.target.files.length; i++) {
		var file = event.target.files[i];
		readPDC(file, function addViewer(pdc) {
			var template = document.querySelector('template[data-role=viewer]').content;
			var content = document.importNode(template, true);
			var figure = content.querySelector('figure');

			var viewer = new PDCViewer(pdc, content);
			this.viewers.push(viewer);
			viewer.backgroundColor = list.querySelector('input[type=color]').value || 'purple';

			content.querySelector('.name').textContent = file.name;

			content.querySelector('[data-action=delete]').addEventListener('click', function removeViewer() {
				viewers.splice(viewers.indexOf(viewer), 1);
				list.removeChild(figure);
			});

			content.querySelector('[data-action=edit]').addEventListener('click', function () {
				edit(pdc);
			});

			list.insertBefore(figure, list.querySelector('form'));
		});
	}
	event.target.value = '';
}

function edit(pdc) {
	document.body.className = 'edit';
	editor.setPdc(pdc);
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
	editor.draw();

	requestAnimationFrame(drawAll);
}
