//////////////////////////////////////////////////////////////////////////////////
//		kludge to get threejs.org/examples to work
//////////////////////////////////////////////////////////////////////////////////

// (function(){
// 	window.x3js_window = window
// 	
// 	var isOnThreejsExamples = location.hostname === 'threejs.org' && location.pathname === '/examples/'
// 
// InspectedWin3js.log('isOnThreejsExamples', isOnThreejsExamples)
// 	if( isOnThreejsExamples === true ){
// 		x3js_window = window.frames[0].frameElement.contentWindow
// 	}
// })();

(function inspectedWinScript(){
	//////////////////////////////////////////////////////////////////////////////////
	//		kludge to get threejs.org/examples to work
	//////////////////////////////////////////////////////////////////////////////////
	// var window = x3js_window
	// var THREE = x3js_window.THREE
	
	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////

	// make sure it is loaded only once
	if( window.InspectedWin3js !== undefined ){
	        InspectedWin3js.log('in 00-injected_script-init.js: already injected, bailing out')
	        return
	}

	//////////////////////////////////////////////////////////////////////////////////
	//                Comments
	//////////////////////////////////////////////////////////////////////////////////

	// declare namespace
	var InspectedWin3js = {}
	// export namespace globally
	window.InspectedWin3js = InspectedWin3js
	
	InspectedWin3js.REVISION	= '1.9.11'
	
	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
	// determine which environment we run in thanks to the version number
	// - simple principle: even patch number are dev version, odd patch number are production versions
	InspectedWin3js.ENVIRONMENT	= parseInt(InspectedWin3js.REVISION.split('.').pop()) % 2 ? 'dev' : 'prod'
	
	// remove InspectedWin3js.log in production
	if( InspectedWin3js.ENVIRONMENT === 'prod' ){
		InspectedWin3js.log = function(){}
	}else{
		InspectedWin3js.log = function(){
			console.log.apply(console, arguments);
		}
	}

	//////////////////////////////////////////////////////////////////////////////////
	//                detection
	//////////////////////////////////////////////////////////////////////////////////
	InspectedWin3js.hasTHREEJS = window.THREE !== undefined ? true : false
	if( InspectedWin3js.hasTHREEJS ){
		InspectedWin3js.log('in 00-injected_script-init.js: three.js is present version', THREE.REVISION)
	}else{
		InspectedWin3js.log('in 00-injected_script-init.js: three.js is NOT present.')
	}
