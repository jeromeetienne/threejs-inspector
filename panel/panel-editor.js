/**
 * emulation of three.js editor class
 * - it helps keep the code as close as possible
 */
function Editor(){
	var _this = this
	this.signals	= {
		updateObject3DTreeView: new SIGNALS.Signal(),
		inspectObject3D: new SIGNALS.Signal(),
	}
	
	
	this.selected = null;
	
	this.signals.inspectObject3D.add(function(object3dJson){
		_this.selected = object3dJson
	})
}
