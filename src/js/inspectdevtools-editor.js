var InspectDevTools	= InspectDevTools	|| {}


/**
 * emulation of three.js editor class
 * - it helps keep the code as close as possible
 */
function Editor(){
	this.signals	= {
		objectSelected	: new SIGNALS.Signal(),

		objectAdded	: new SIGNALS.Signal(),
		objectRemoved	: new SIGNALS.Signal(),
		
		initialized	: new SIGNALS.Signal(),		
	}
	
	this.config	= new Config()
	this.selected	= null
}
