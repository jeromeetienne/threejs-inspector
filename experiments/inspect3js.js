var Inspect3js	= Inspect3js || {}


//////////////////////////////////////////////////////////////////////////////////
//		Wrap function with postCall
//////////////////////////////////////////////////////////////////////////////////
Inspect3js.overloadPostProcess	= function( originalFunction, postProcessFct ) {
	return function() {
		var returnValue = originalFunction.apply( this, arguments );
		returnValue = postProcessFct.apply( this, [ returnValue, arguments ] ) || returnValue;
		return returnValue;
	}
}

//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////


var renderings	= {}

function onPostRender(renderer, scene, camera){
	// record this rendering
	var key	= scene.uuid + '-' + camera.uuid
	renderings[key]	= {
		scene	: scene,
		camera	: camera,
	}
}

//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////

Inspect3js.instrumentWebGLRenderer	= function(renderer){
	var previousFunction = renderer.render;
	renderer.render = function(scene, camera) {
		previousFunction.apply( renderer, arguments );
		
		onPostRender(renderer, scene, camera)
	}
}
Inspect3js.instrumentObject	= function(object){
	if( object instanceof THREE.WebGLRenderer ) {
		Inspect3js.instrumentWebGLRenderer( object );			
	}else if( object instanceof THREE.Object3D ) {
		// reccursiveAddObject( object );
	}
}

//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////
/**
 * instrument instanced objectsCache WebGLRenderer/Object3D in window.*
 * - aka totally ignore any others in closure or elsewhere ...
 */
Inspect3js.instrumentWindowGlobals	= function() {
	var propertiesToIgnore = [ 'webkitStorageInfo', 'webkitIndexedDB' ];

	for( var property in window ) { 
		if( propertiesToIgnore.indexOf( property ) >= 0 ) continue;
		Inspect3js.instrumentObject( window[property] )
	}	
}

Inspect3js.instrumentWindowGlobals()
