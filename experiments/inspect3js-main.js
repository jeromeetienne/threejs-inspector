
//////////////////////////////////////////////////////////////////////////////////
//		Comments
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
//		THREE.WebGLRenderer
//////////////////////////////////////////////////////////////////////////////////
// post process on constructor		
THREE.WebGLRenderer = Inspect3js.overloadPostProcess( THREE.WebGLRenderer, function() {
	Inspect3js.instrumentWebGLRendererInstance( this );
});

Inspect3js.instrumentWebGLRendererInstance(renderer)

//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////


var countRendering	= 0

var rafHijacker	= new RafHijacker()

// rafHijacker.startAsTimer()
rafHijacker.preFunction = function(){
	console.log('before')
	countRendering	= 0
}
rafHijacker.postFunction = function(){
	console.log('rendering per frame', countRendering)
	// console.log('after')
}
