/**
 * define content script namespace
 * @type {Object}
 */
window.Inspect3js	= window.Inspect3js	|| {}


//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////

/**
 * Change a property in a object - called from devtool panel 
 * 
 * @param {String} id   - object uid
 * @param {String} data - property name e.g. "position.x"
 */
Inspect3js.ChangeProperty = function( object3dUUID, data ) {
	// console.log('ChangeProperty', data.property, 'to', data.value)
	var object3d = Inspect3js._objectsCache[ object3dUUID ];
	var curObject = object3d;
	
	var fields = data.property.split( '.' );
	for( var fieldIndex = 0; fieldIndex < fields.length; fieldIndex++ ) {
		var fieldName = fields[fieldIndex]

		var matchArray = fieldName.match(/(.*)\[(\d+)\]/)
		if( matchArray !== null ){
			var indexInArray = matchArray === null ? -1 : parseInt(matchArray[2], 10)
			fieldName = matchArray[1]
		}else{
			var indexInArray = -1				
		}

		if( fieldIndex === fields.length - 1 ) {
			if( indexInArray === -1 )	curObject[ fieldName ] = data.value;
			else 				curObject[ fieldName ][indexInArray] = data.value;
		} else {
			if( indexInArray === -1 )	curObject = curObject[ fieldName ];
			else 				curObject = curObject[ fieldName ][indexInArray];
		}				
	}
}

/**
 * Call a function on a object3d 
 * 
 * @param {String} object3dUUID   - object uid
 * @param {Function} fct - the function to call
 * @param {Array} data - the parameters to send to function
 */
Inspect3js.ChangeObject3dFunction = function( object3dUUID, fct, args ) {
	// console.log('ChangeObject3dFunction', fct.toString(), args)
	var object3d = Inspect3js._objectsCache[ object3dUUID ];
	console.assert(object3d instanceof THREE.Object3D)
	var newArgs	= args.slice(0)
	newArgs.unshift(object3d); 
	
	fct.apply(null, newArgs)
}
