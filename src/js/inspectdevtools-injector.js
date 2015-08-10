var InspectDevTools	= InspectDevTools	|| {}

/**
 * inject a property into the object3d
 * @param  {String} property - the property to Modify
 * @param  {any} value    - the value to set
 */
InspectDevTools.propertyOnObject3d	= function(property, value){
	var data	= {
		property: property,
		value	: value
	}
	
	var jsCode	= 'Inspect3js.ChangeProperty( "' + editor.selected.uuid + '",' + JSON.stringify(data) + ' )'
	chrome.devtools.inspectedWindow.eval( jsCode );		
}



/**
 * inject a function and run it on a object3d
 * @param  {Function} fct  - the function to call
 */
InspectDevTools.plainFunction	= function(fct, args){
	if( args === undefined ) args = []
	
	var jsCode	= '('
				+ fct.toString()
			+ ').apply(null, '
				+ JSON.stringify(args)
			+ ')'

	chrome.devtools.inspectedWindow.eval( jsCode );
}

/**
 * inject a function and run it on a object3d
 * @param  {Function} fct  - the function to call
 * @param  {Array} args - the arguments of the function to call
 */
InspectDevTools.functionOnObject3d	= function(fct, args){
	if( args === undefined ) args = []
	
	var jsCode	= 'Inspect3js.ChangeObject3dFunction'
			+ '('
				+ JSON.stringify(editor.selected.uuid)
			+ ', '
				+ fct.toString()
			+ ', '
				+ JSON.stringify(args)
			+ ')'
// console.log('functionOnObject3d', jsCode)

	chrome.devtools.inspectedWindow.eval( jsCode );		
}
