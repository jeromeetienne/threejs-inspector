var PanelWin3js	= PanelWin3js	|| {}




/**
 * inject a function and run it on a object3d
 * @param  {Function} fct  - the function to call
 */
PanelWin3js.evalJsCode	= function(jsCode){
	chrome.devtools.inspectedWindow.eval( jsCode, function(result, isException){
		if( isException ){
			console.error('in panel-injector.js: Exception while eval()', jsCode)
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
		}else{
			// console.log('result = ', result)
		}
	});		
}
