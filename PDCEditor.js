function PDCEditor(form) {
	this.pdc = null;
	this.pdcCanvas = null;
	this.bindToDom(form);
	this.frame = 0;
	this.command = null;
}

PDCEditor.prototype.draw = function() {
	if(!this.pdc)
		return;
	
	if(this.pdc.frames)
		this.pdcCanvas.draw(this.pdc.frames[this.frame].startTime);
	else
		this.pdcCanvas.draw(0);
};

PDCEditor.prototype.bindToDom = function(form) {
	this.form = form;
	this.canvas = form.querySelector('canvas');
	form.commandProperties.disabled = true;

	this.form.frame.addEventListener('input', function(e) {
		this.setFrame(Number(e.target.value));
	}.bind(this));

	['change', 'click'].forEach(function(et) {
		this.form.commands.addEventListener(et, function(e) {
			this.setCommand(this.commandList[e.target.value]);
		}.bind(this));
	}, this);

	['change', 'input'].forEach(function(et) {
		Array.prototype.forEach.call(this.form.commandProperties.elements, function(el) {
			el.addEventListener(et, function() {
				this.command[el.name] = getInputValueThatDoesntSuck(el);
			}.bind(this));
		}, this);
	}, this);

	new PebbleColorPicker(form.strokeColor);
	new PebbleColorPicker(form.fillColor);
};

PDCEditor.prototype.setPdc = function(pdc) {
	this.pdc = pdc;
	this.pdcCanvas = new PDCCanvas(pdc, this.canvas);

	if(pdc instanceof PebbleDrawCommandSequence) {
		this.form.querySelector('[data-role=frameLabel]').style.display = 'block';
		this.form.frame.max = pdc.frames.length;
		this.setFrame(0);
	}
	else {
		this.setCommandList(pdc.commands);
		this.form.querySelector('[data-role=frameLabel]').style.display = 'none';
	}
};

PDCEditor.prototype.setFrame = function(frame) {
	this.frame = frame;
	this.form.frame.value = frame;
	if(this.pdc && this.pdc.frames)
		this.setCommandList(this.pdc.frames[frame].commands);
};

PDCEditor.prototype.setCommandList = function(cl) {
	var i = 0;

	if(this.command && this.commandList)
		i = this.commandList.indexOf(this.command);

	this.commandList = cl;
	this.buildCommandList(cl);
	this.setCommand(cl[Math.min(i, cl.length - 1)]);
};

PDCEditor.prototype.setCommand = function(command) {
	if(this.command == command)
		return;
	this.command = command;
	if(command) {
		this.form.commandProperties.disabled = false;
		this.form.commands.value = this.commandList.indexOf(command);
		Array.prototype.forEach.call(this.form.commandProperties.elements, function(el) {
			if(command[el.name] !== undefined)
				setInputValueThatDoesntSuck(el, command[el.name]);
		}, this);
	}
	else
		this.form.commandProperties.disabled = true;
};

PDCEditor.prototype.buildCommandList = function(commands) {
	var select = this.form.commands;

	while(select.firstChild)
		select.removeChild(this.form.commands.firstChild);

	commands.map(function(command, index) {
		var option = document.createElement('option');
		option.value = index;
		option.textContent = getCommandName(command);
		return option;
	}).forEach(select.appendChild, select);
};

function getCommandName(command) {
	if(command.name)
		return command.name;

	switch(command.type) {
		case 1:
			return "Path ("+command.points.length+" points)";
		case 2:
			return "Circle (radius "+command.radius+")";
		case 3:
			return "Precise path ("+command.points.length+" points)";
		default:
			return "Invalid command.";
	}
}

function getInputValueThatDoesntSuck(input) {
	switch(input.type) {
		case "number":
			return Number(input.value);
		case "checkbox":
			return input.checked;
		default:
			if(input.hasAttribute('data-numeric'))
				return Number(input.value);
			if(input.hasAttribute('data-color'))
				return colors.find(function(c) {
					return c.color == input.value;
				});
			return input.value;
	}
}

function setInputValueThatDoesntSuck(input, value) {
	switch(input.type) {
		case "checkbox":
			return input.checked = value;
		default:
			if(input.hasAttribute('data-color'))
				return input.value = value.color;
			return input.value = value;
	}
}
