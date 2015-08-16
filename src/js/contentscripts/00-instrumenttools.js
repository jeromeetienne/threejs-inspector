/**
 * define content script namespace
 * @type {Object}
 */
window.Inspect3js	= window.Inspect3js	|| {}


//////////////////////////////////////////////////////////////////////////////////
//		Wrap function with postCall
//////////////////////////////////////////////////////////////////////////////////
Inspect3js.overloadPostProcess	= function( originalFunction, postProcessFct ) {
	return function() {
		var returnValue = originalFunction.apply( this, arguments );
		returnValue = postProcessFct.apply( this, [ returnValue, arguments ] ) || returnValue;
		return returnValue;
	}
}


//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////
Inspect3js._classNames = [];

Inspect3js.getClassName		= function( object ) {
	for( var j in Inspect3js._classNames ) {
		if( object instanceof THREE[ Inspect3js._classNames[ j ] ] ) {
			var result = Inspect3js._classNames[j]
			return result;
		}
	}

	debugger; // dafuc?
}	
/**
 * extract all constructors functions name from three.js
 */
Inspect3js.extractClassNames	= function() {
	for( var property in THREE ){
		if( typeof THREE[ property ] !== 'function' )	continue
		// NOTE: unshift is key here to get proper inheritance
		// - https://github.com/spite/ThreeJSEditorExtension/issues/9
		Inspect3js._classNames.unshift( property );
	}
}
