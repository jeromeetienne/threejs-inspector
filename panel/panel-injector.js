var PanelWin3js	= PanelWin3js	|| {}




/**
 * inject a function and run it on a object3d
 * @param  {Function} fct  - the function to call
 */
PanelWin3js.evalJsCode	= function(jsCode){
	chrome.devtools.inspectedWindow.eval( jsCode, function(result, isException){
		if( isException ){
			console.error('in panel-injector.js: Exception while eval()', jsCode)
			console.error(isException.value)
		}else{
			// console.log('result = ', result)
		}
	});
}

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

	chrome.devtools.inspectedWindow.eval( jsCode, function(result, isException){
		if( isException ){
			console.error('in panel-injector.js: Exception while eval()', jsCode)
			console.error(isException.value)
		}else{
			// console.log('result = ', result)
		}
	});
}

//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////


/**
 * inject a property into the object3d
 * @param  {String} property - the property to Modify
 * @param  {any} value    - the value to set
 */
PanelWin3js.propertyOnObject3d	= function(property, value){
	var editor = PanelWin3js.editor
	
	PanelWin3js.plainFunction(function(property, value){
		console.log('in panel-injector.js: change property', property, 'value', value)

		if( InspectedWin3js.selected === null )	console.error('in panel-injector.js: an object should be selected')

		var object3dUuid = InspectedWin3js.selected.uuid
		InspectedWin3js.ChangeProperty(object3dUuid, property, value)

	}, [property, value])	
}

/**
 * inject a function and run it on a object3d
 * @param  {Function} fct  - the function to call
 * @param  {Array} args - the arguments of the function to call
 */
PanelWin3js.functionOnObject3d	= function(fct, args){
	var editor = PanelWin3js.editor
	if( args === undefined ) args = []
	
	var jsCode	= 'InspectedWin3js.ChangeObject3dFunction'
			+ '('
				+ JSON.stringify(editor.selected.uuid)
			+ ', '
				+ fct.toString()
			+ ', '
				+ JSON.stringify(args)
			+ ')'
// console.log('functionOnObject3d', jsCode)

	chrome.devtools.inspectedWindow.eval( jsCode, function(result, isException){
		if( isException ){
			console.error('in panel-injector.js: Exception while eval()', jsCode)
			console.error(isException.value)
		}else{
			// console.log('result = ', result)
		}
	});		
}

//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////

PanelWin3js.injectInspectedWinScripts	= function(){
	// read the inspected-win scripts content
	var content	= ''
	content += readFile('inspected-win/00-inspected-win-prefix.js')
	content += readFile('inspected-win/10-inspected-win-changeobject3d.js')
	content += readFile('inspected-win/10-inspected-win-classnames.js')
	content += readFile('inspected-win/10-inspected-win-object3dtojson.js')
	content += readFile('inspected-win/50-inspected-win-main.js')
	content += readFile('inspected-win/99-inspected-win-suffix.js')
	
	// eval it
	chrome.devtools.inspectedWindow.eval( content, function(result, isException){
		if( isException ){
			console.error('Exception while eval() inspected-win scripts')
			console.error(isException.value)
		}else{
			// console.log('result = ', result)
		}
	})


	return

	function readFile(url){
		var request = new XMLHttpRequest();
		request.open('GET', url, false);  // `false` makes the request synchronous
		request.send(null);
		console.assert(request.status === 200)
		var content = request.responseText
		return content
	}	
}
