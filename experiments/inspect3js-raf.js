var Inspect3js	= Inspect3js || {}

Inspect3js.Raf	= function(){
	this._originalFct	= requestAnimationFrame
	this.fps	= 30
}

Inspect3js.Raf.prototype.restoreOriginal	= function(){
	requestAnimationFrame	= this._originalFct
}

//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////
Inspect3js.Raf.prototype.setPrePostFunctions	= function(preFunction, postFunction){
	var originalFct	= this._originalFct
	requestAnimationFrame	= function(callback){
		originalFct(function(timestamp){
			preFunction(timestamp)
			callback(timestamp)
			postFunction(timestamp)
		})
	}
}
//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////
Inspect3js.Raf.instrumentTimer	= function(fps){
	var fps = this.fps
	requestAnimationFrame	= function(callback){
		setTimeout(function(){
			var timestamp = performance.now()
			callback(timestamp)
		}, 1000* 1/fps)
	}
}
