/**
 * code to inject into the inspected page
 */
function inject_20_Select() {

/**
 * define content script namespace
 * @type {Object}
 */
window.Inspect3js	= window.Inspect3js	|| {}


//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////

Inspect3js._objectsCache = {}

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
			id: null, 
		}, '*');
		return
	}


	var object = Inspect3js._objectsCache[ uuid ];		
	var data = Inspect3js._object3dToJSON(object);

	window.postMessage( {
		source: 'ThreejsEditor', 
		method: 'objectSelected', 
		id: uuid, 
		data: JSON.stringify( data )
	}, '*');
}



} // End of the containing function
