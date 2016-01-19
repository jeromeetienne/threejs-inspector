(function(){

	// make sure it is loaded only once
	if( window.InspectedWin3js !== undefined ){
	        console.log('in 00-injected_script-init.js: already injected, bailing out')
	        return                
	}


	//////////////////////////////////////////////////////////////////////////////////
	//                detection
	//////////////////////////////////////////////////////////////////////////////////
	var hasTHREEJS = window.THREE !== undefined ? true : false
	if( hasTHREEJS ){
		console.log('in 00-injected_script-init.js: three.js is present version', THREE.REVISION)
	}else{
		console.log('in 00-injected_script-init.js: three.js is NOT present. bailing out')
	        return
	}

	//////////////////////////////////////////////////////////////////////////////////
	//                Comments
	//////////////////////////////////////////////////////////////////////////////////

	// declare namespace
	var InspectedWin3js = {}
	// export namespace globally
	window.InspectedWin3js = InspectedWin3js
