/**
 * emulation of three.js editor class
 * - it helps keep the code as close as possible
 */
function Editor(){
	var _this = this
	this.signals	= {
		updateObject3DTreeView: new SIGNALS.Signal(),
		object3dSelected: new SIGNALS.Signal(),
	}
	
	
	this.selected = null;

	this.selectObject3D = function(object3dJson){
		// update editor.selected
		_this.selected = object3dJson
		// 
                _this.signals.object3dSelected.dispatch(object3dJson)		
	}
}
