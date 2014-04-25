// No need to give a filename extension .CSX will be used by default.
function RestructToCSX(r, filename) {
	var size = r.size;
	
	for (var i=0;i<r.formats.length;i++) {
		//console.log(r.formats[i].type + ' ' + r.formats[i].name);
		var type = r.formats[i].type;
		if (typeof(type) === 'object') type = 'object';
		var dataSize;
		var arrayLen = 0;

		var lbracket = type.indexOf('[');
		if (lbracket>-1) {
			arrayLen = type.substr(lbracket,type.length-1);
		}

		switch (type) {
			case 'object': // Need a way to get object name...
				dataSize = r.formats[i].size;
			break;
			case 'boolean':
				dataSize = 4;
			break;
			case 'nibble':
			    dataSize = 1; // Could be array... Check the length
			break;
			case 'int8ls':
				dataSize = 8;
			break;
			case 'int8lu':
				dataSize = 8;
			break;
			case 'int8bs':
				dataSize = 8;
			break;
			case 'int8bu':
				dataSize = 8;
			break;
			case 'int16ls':
				dataSize = 2;
			break;
			case 'int16lu':
				dataSize = 2;
			break;
			case 'int16bs':
				dataSize = 2;
			break;
			case 'int16bu':
				dataSize = 2;
			break;
			case 'int24ls':
				dataSize = 3;
			break;
			case 'int24lu':
				dataSize = 3;
			break;
			case 'int24bs':
				dataSize = 3;
			break;
			case 'int24bu':
				dataSize = 3;
			break;
			case 'int32ls':
				dataSize = 4;
			break;
			case 'int32lu':
				dataSize = 4;
			break;
			case 'int32bs':
				dataSize = 4;
			break;
			case 'int32bu':
				dataSize = 4;
			break;
			case 'int40ls':
				dataSize = 5;
			break;
			case 'int40lu':
				dataSize = 5;
			break;
			case 'int40bs':
				dataSize = 5;
			break;
			case 'int40bu':
				dataSize = 5;
			break;
			case 'int48ls':
				dataSize = 6;
			break;
			case 'int48lu':
				dataSize = 6;
			break;
			case 'int48bs':
				dataSize = 6;
			break;
			case 'int48bu':
				dataSize = 6;
			break;
			case 'string':
				dataSize = 1; // Check length
			break;
			case 'float32l':
				dataSize = 4;
			break;
		}

		console.log('Type: '+type+' Size: '+dataSize);
		if (r.formats[i].name == 'Necklace') {
			global.test = r.formats[i];
			console.log(r.formats[i]);
		}
	}
}