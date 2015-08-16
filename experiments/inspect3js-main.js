
//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////


Inspect3js._objectsCache = {}

/**
 * renderer/scene/camera are the 3 main elements
 * - i can hook everything from there
 * - create all the objects in a ._objectsCache
 * - 
 */

Inspect3js.instrumentWebGLRendererInstance	= function(renderer){

	renderer.render = Inspect3js.overloadPostProcess( renderer.render, function(scene, camera) {
		countRendering++
		// console.log('render', countRendering)
		
		
		
		
	})

}

	
//////////////////////////////////////////////////////////////////////////////////
//		THREE.WebGLRenderer
//////////////////////////////////////////////////////////////////////////////////

// post process on constructor		
THREE.WebGLRenderer = Inspect3js.overloadPostProcess( THREE.WebGLRenderer, function() {
	Inspect3js.instrumentWebGLRendererInstance( this );
});

// trying to catch already created objects
Inspect3js.instrumentGlobalObjects()

//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////

var countRendering	= 0

var rafThrottler	= new RafThrottler()

// rafThrottler.startAsTimer()
rafThrottler.preFunction = function(){
	// console.log('before')
}
rafThrottler.postFunction = function(){
	if( countRendering ){
		console.log('rendering per frame', countRendering)
	}
	// console.log('after')
	countRendering	= 0
}

console.log('Inspect3js loaded')
