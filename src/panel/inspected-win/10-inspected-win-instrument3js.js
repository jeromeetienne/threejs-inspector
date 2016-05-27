//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////

InspectedWin3js.functionAddPostProcess	= function( originalFunction, postProcessFct ) {
	return function() {
		var returnValue = originalFunction.apply( this, arguments );
		postProcessFct.apply( this, [ returnValue, arguments ] )
		return returnValue;
	}
}

InspectedWin3js.instrumentThreejs	= function(){	
	var timeout = null
	function onSceneChange(){
		clearTimeout(timeout)
		timeout = setTimeout(function(){
			console.log('update treeview now')
			InspectedWin3js.captureScene()
		}, 100)
	}

	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////

	// post process on object3d.add()
	THREE.Object3D.prototype.add = InspectedWin3js.functionAddPostProcess( THREE.Object3D.prototype.add, function(returnValue, args) {
		console.log('object3d added', this)
		onSceneChange()
	} );
	// post process on object3d.remove()
	THREE.Object3D.prototype.remove = InspectedWin3js.functionAddPostProcess( THREE.Object3D.prototype.remove, function(returnValue, args) {
		console.log('object3d removed', this)
		onSceneChange()
	} );
	return

}
