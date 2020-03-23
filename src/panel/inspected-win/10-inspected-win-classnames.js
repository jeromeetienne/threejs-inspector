//////////////////////////////////////////////////////////////////////////////////
//		To guess the three.js classname
//////////////////////////////////////////////////////////////////////////////////
InspectedWin3js._threeJSClassNames = [];

InspectedWin3js.getThreeJSClassName		= function( obj ) {
	for( var j in InspectedWin3js._threeJSClassNames ) {
		if( obj.constructor.name === InspectedWin3js._threeJSClassNames[j]) {
			var result = InspectedWin3js._threeJSClassNames[j]
			return result;
		}
	}

	debugger; // dafuc?
}	

/**
 * extract all constructors functions name from three.js
 */
InspectedWin3js.extractThreeJSClassNames	= function() {
        InspectedWin3js.log('in 10-injected-script-classnames.js: extract three.js classnames')
	for( var property in THREE ){
		if( typeof THREE[ property ] !== 'function' )	continue
		// NOTE: unshift is key here to get proper inheritance
		// - https://github.com/spite/ThreeJSEditorExtension/issues/9
		InspectedWin3js._threeJSClassNames.unshift( property );
	}
}
