/**
 * emulation of three.js editor class
 * - it helps keep the code as close as possible
 */
function Editor(){
	this.signals	= {
		updateObject3DTreeView: new SIGNALS.Signal(),
		inspectObject3D: new SIGNALS.Signal(),
	}
}
