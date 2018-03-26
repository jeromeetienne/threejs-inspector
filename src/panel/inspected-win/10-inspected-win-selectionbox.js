//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////

InspectedWin3js.SelectionBox	= function(){
	var _this = this
	this.enabled = false
	
	this._boxHelper = new THREE.BoxHelper();
	this._boxHelper.name = 'selection Box threejs-inspector'
	this._boxHelper.material.depthTest = false;
	this._boxHelper.material.transparent = true;
	
	requestAnimationFrame(function callback(){
		requestAnimationFrame(callback)
		
		_this.update()
	})
}

InspectedWin3js.SelectionBox.prototype.update	= function(){
	this._boxHelper.visible = false
	
	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
	if( this.enabled === false ){
		if( this._boxHelper.parent ){
			this._boxHelper.parent.remove(this._boxHelper)			
		}
	}else{
		if( this._boxHelper.parent == null ){
			var scene = InspectedWin3js.getInspectedScene()
			if( scene !== null )	scene.add(this._boxHelper)			
		}
	}
	
	// if it is not enabled, return now
	if( this.enabled === false )	return
	
	// if nothing is selected, return now
	if( InspectedWin3js.selected === null )	return

	var object3d = InspectedWin3js.getObjectByUuid(InspectedWin3js.selected.uuid)
	console.assert( object3d instanceof THREE.Object3D )

	// if object got no geometry, return now
	if( object3d.geometry === undefined )	return

	// update the BoxHelper
	this._boxHelper.visible = true
	if (parseInt(THREE.REVISION, 10) >= 85) {
		this._boxHelper.object = object3d
		this._boxHelper.update()
	} else {
		this._boxHelper.update(object3d)
	}
}
