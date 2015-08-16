var Inspect3js	= Inspect3js || {}


/**
 * instrument instanced objectsCache WebGLRenderer/Object3D in window.*
 * - aka totally ignore any others in closure or elsewhere ...
 */
Inspect3js.instrumentGlobalObjects	= function() {
	var propertiesToIgnore = [ 'webkitStorageInfo', 'webkitIndexedDB' ];

	for( var property in window ) { 
		var toBeIgnored = propertiesToIgnore.indexOf( property ) >= 0 ? true : false
		if( toBeIgnored === true ) continue;

		Inspect3js.instrumentObject( window[property] )
	}	
}
//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////

Inspect3js.instrumentObject	= function(object){
	if( object instanceof THREE.WebGLRenderer ) {
		Inspect3js.instrumentWebGLRendererInstance( object );			
	}
}
