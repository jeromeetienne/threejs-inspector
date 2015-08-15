//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////


// post process on constructor		
THREE.WebGLRenderer = Inspect3js.overloadPostProcess( THREE.WebGLRenderer, function() {
	// Inspect3js.instrumentWebGLRendererInstance( this );
	
	
});
	
// // post process on renderer.r¡
//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////

var countRendering	= 0

var rafHijacker	= new RafHijacker()
rafHijacker.fps = 10
// rafHijacker.startAsTimer()
rafHijacker.preFunction = function(){
	console.log('before')
	// countRendering	= 0
}
rafHijacker.postFunction = function(){
	// console.log('rendering per frame', countRendering)
	// console.log('after')
}
