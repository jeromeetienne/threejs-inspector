/**
 * define content script namespace
 * @type {Object}
 */
window.Inspect3js	= window.Inspect3js	|| {}


//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////

Inspect3js._objectsCache = {}

Inspect3js.purgeObsoleteObjects	= function(){
	Object.keys(Inspect3js._objectsCache).forEach(function(objectUuid){
		var object3d	= Inspect3js._objectsCache[objectUuid]
		console.assert( object3d instanceof THREE.Object3D === true )
		if( object3d.parent )	return
		if( object3d instanceof THREE.Scene )	return
		if( object3d instanceof THREE.Camera )	return
		console.log('no parent object3d', object3d, object3d.name)
		Inspect3js.reccursiveRemoveObject(object3d)
	})
}



//////////////////////////////////////////////////////////////////////////////////
//		Inspect3js.UISelect
//////////////////////////////////////////////////////////////////////////////////

Inspect3js._lastSelectedUuid	= null

Inspect3js.getSelected	= function(){
	var uuid = Inspect3js._lastSelectedUuid
	return this.getObjectByUuid(uuid)
}
Inspect3js.getObjectByUuid	= function(uuid){
	var object = Inspect3js._objectsCache[uuid]
	if( object === undefined )	return null
	return object
}

/**
 * selection in the UI - called from devtools
 * 
 * @param {String} uuid - the selection object.uuid
 */
Inspect3js.UISelect = function( uuid ) {
	// console.log('UISelect', uuid)

	this._lastSelectedUuid	= uuid

	// used to deselect
	if( uuid === null ){
		window.postMessage( {
			source: 'ThreejsEditor', 
			method: 'objectSelected', 
			object3dUuid: null, 
		}, '*');
		return
	}


	var object = Inspect3js._objectsCache[ uuid ];		
	var data = Inspect3js._object3dToJSON(object);

	window.postMessage( {
		source: 'ThreejsEditor', 
		method: 'objectSelected', 
		object3dUuid: uuid, 
		data: data	// JSON.stringify( data )
	}, '*');
}
