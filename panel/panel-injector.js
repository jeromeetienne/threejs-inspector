var PanelWin3js	= PanelWin3js	|| {}


/**
 * inject a function and run it on a object3d
 * @param  {Function} fct  - the function to call
 */
PanelWin3js.plainFunction	= function(fct, args){
	if( args === undefined ) args = []
	
	var jsCode	= '('
				+ fct.toString()
			+ ').apply(null, '
				+ JSON.stringify(args)
			+ ')'

	PanelWin3js.evalJsCode(jsCode)
}

/**
 * inject a function and run it on a object3d
 * @param  {Function} fct  - the function to call
 */
PanelWin3js.evalJsCode	= function(jsCode){
	chrome.devtools.inspectedWindow.eval( jsCode, function(result, isException){
		if( isException ){
			console.error('Exception while eval()', jsCode)
		}else{
			// console.log('result = ', result)
		}
	});
}
