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
	
	if( this.enabled === false ){
		if( this._boxHelper.parent )	this._boxHelper.parent.remove(this._boxHelper)
	}else{
		if( this._boxHelper.parent === undefined ){
			var scene = InspectedWin3js.getInspectedScene()
			scene.add(this._boxHelper)			
		}
	}
	
	if( InspectedWin3js.selected === null )	return

	
	var object3d = InspectedWin3js.getObjectByUuid(InspectedWin3js.selected.uuid)

	
	
	this._boxHelper.visible = true
	this._boxHelper.update(object3d)
}
