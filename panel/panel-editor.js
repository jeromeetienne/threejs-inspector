/**
 * emulation of three.js editor class
 * - it helps keep the code as close as possible
 */
function Editor(){
	var _this = this
	this.signals	= {
		updateObject3DTreeView: new SIGNALS.Signal(),
		selectObject3D: new SIGNALS.Signal(),
	}
	
	
	this.selected = null;

	this.selectObject3D = function(object3dJson){
		_this.selected = object3dJson
                _this.signals.selectObject3D.dispatch(object3dJson)		
	}
}
