(function(){

	// console.log = function(){}

	// make sure it is loaded only once
	if( window.InspectedWin3js !== undefined ){
	        console.log('in 00-injected_script-init.js: already injected, bailing out')
	        return                
	}

	//////////////////////////////////////////////////////////////////////////////////
	//                Comments
	//////////////////////////////////////////////////////////////////////////////////

	// declare namespace
	var InspectedWin3js = {}
	// export namespace globally
	window.InspectedWin3js = InspectedWin3js

	//////////////////////////////////////////////////////////////////////////////////
	//                detection
	//////////////////////////////////////////////////////////////////////////////////
	InspectedWin3js.hasTHREEJS = window.THREE !== undefined ? true : false
	if( InspectedWin3js.hasTHREEJS ){
		console.log('in 00-injected_script-init.js: three.js is present version', THREE.REVISION)
	}else{
		console.log('in 00-injected_script-init.js: three.js is NOT present.')
	}
