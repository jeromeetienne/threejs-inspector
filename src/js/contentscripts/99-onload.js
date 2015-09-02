/**
 * code to inject into the inspected page
 */
;(function(){
	
/**
 * define content script namespace
 * @type {Object}
 */
window.Inspect3js	= window.Inspect3js	|| {}


Inspect3js.rafThrottler	= new RafThrottler()

//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////
function checkThreeJs() {
	var isThreejsPresent = window.THREE && window.THREE.REVISION;

	if(!isThreejsPresent) {
		console.log('three.js not present')
		setTimeout( checkThreeJs, 10 );
		return
	}

	Inspect3js.injectInThreejs();
}

checkThreeJs();

//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////

function onLoad(){
	window.postMessage({
		source: 'ThreejsEditor', 
		method: 'init'
	}, '*');	
}
/** 
 * signal devtool panel that the injection is completed
 */
window.addEventListener( 'load', onLoad)

// if window already got loaded, call onLoad() manually
if( document.readyState === 'complete' ){
	onLoad()
}




})()
