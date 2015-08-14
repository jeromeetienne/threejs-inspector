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
//		THREE.WebGLRenderer
//////////////////////////////////////////////////////////////////////////////////

// THREE.WebGLRenderer = Inspect3js.overloadPostProcess( THREE.WebGLRenderer, function() {
// 	Inspect3js.instrumentWebGLRendererInstance( this );
// });

Inspect3js.instrumentWebGLRendererInstance	= function(renderer){
	var previousFct = renderer.render;
	renderer.render = function(scene, camera) {
		previousFct.apply( renderer, arguments );
		
		onPostRender(renderer, scene, camera)
	}
}


//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////

Inspect3js.instrumentObject	= function(object){
	if( object instanceof THREE.WebGLRenderer ) {
		console.log('dddd')
		Inspect3js.instrumentWebGLRendererInstance( object );			
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
		var toBeIgnored = propertiesToIgnore.indexOf( property ) >= 0 ? true : false
		if( toBeIgnored === true ) continue;

		Inspect3js.instrumentObject( window[property] )
	}	
}

Inspect3js.instrumentWindowGlobals()
