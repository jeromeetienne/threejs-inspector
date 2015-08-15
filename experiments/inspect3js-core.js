var Inspect3js	= Inspect3js || {}


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
//		Wrap function with postCall
//////////////////////////////////////////////////////////////////////////////////
Inspect3js.overloadPreProcess	= function( originalFunction, preProcessFct ) {
	return function() {
		preProcessFct.apply( this, arguments )
		var returnValue = originalFunction.apply( this, arguments );
		return returnValue;
	}
}
