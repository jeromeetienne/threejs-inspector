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
//		Wrap function with postCall
//////////////////////////////////////////////////////////////////////////////////
Inspect3js.overloadPreProcess	= function( originalFunction, preProcessFct ) {
	return function() {
		preProcessFct.apply( this, arguments )
		var returnValue = originalFunction.apply( this, arguments );
		return returnValue;
	}
}

//////////////////////////////////////////////////////////////////////////////////
//		THREE.WebGLRenderer
//////////////////////////////////////////////////////////////////////////////////

Inspect3js.instrumentWebGLRendererInstance	= function(renderer){
	var previousFct = renderer.render;
console.log('instrumentWebGLRendererInstance', renderer)
	renderer.render = function(scene, camera) {
		previousFct.apply( renderer, arguments );
		
countRendering++;
// console.trace()
		// PUT your code here
		console.log('render')
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

//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////
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
