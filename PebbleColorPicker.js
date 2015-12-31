function PebbleColorPicker(select) {
	colors.map(function(color) {
		var option = document.createElement('option');
		option.value = color.color;
		option.textContent = color.name;
		option.style.backgroundColor = color.color;
		if(color.color.startsWith('#'))
			option.style.color = getBrightness(color.color) >= 0.5 ? 'black' : 'white';
		return option;
	}).forEach(select.appendChild, select);

	select.setAttribute('data-color', true);
}

function getBrightness(hex) {
	if(!hex.startsWith('#') || hex.length != 7)
		throw new Error("Not a hex color: "+hex);

	var channels = [0,0,0].map(function(x, i) {
		return parseInt(hex.substr(2*i+1, 2), 16)/255;
	});

	return (Math.max.apply(Math, channels) + Math.min.apply(Math, channels)) / 2;
}
