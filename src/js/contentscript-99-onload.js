/**
 * code to inject into the inspected page
 */
function inject_99_OnLoad() {

/**
 * define content script namespace
 * @type {Object}
 */
window.Inspect3js	= window.Inspect3js	|| {}


//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////
function checkThreeJs() {
	var isThreejsPresent = (window.THREE && window.THREE.REVISION) ? true : false

	if( isThreejsPresent === false ) {
		console.log('three.js not present', window.THREE.REVISION)
		setTimeout( checkThreeJs, 10 );
		return
	}

	console.log('three.js inpector: Injected in THREE.js', window.THREE.REVISION)
	
	Inspect3js.injectInThreejs();
}

checkThreeJs();

//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////

// console.assert(window.__Injected === undefined)
// if( window.__Injected === true )	return

window.__Injected = true;

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

// if window already got loaded, 
if( document.readyState === 'complete' ){
	onLoad()
}


} // End of the containing function
