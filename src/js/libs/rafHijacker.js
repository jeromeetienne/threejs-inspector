/**
 * Hijack requestAnimationFrame. It can add preFunction or postFunction.
 * 
 * @constructor
 */
var RafHijacker	= function(){
	var originalFct	= requestAnimationFrame
	var _this	= this
	this.preFunction	= null
	this.postFunction	= null
	this.fps		= -1
	
	requestAnimationFrame	= function(callback){
		if( _this.fps === -1 ){
			originalFct(function(timestamp){
				onAnimationFrame(callback, timestamp)				
			})			
		}else if( _this.fps > 0 ){
			setTimeout(function(){
				onAnimationFrame(callback, performance.now())
			}, 1000 / _this.fps)
		}else {
			console.assert(false)
		}
	}
	
	return

	function onAnimationFrame(callback, timestamp) {
		if( _this.preFunction !== null ){
			_this.preFunction(timestamp)
		}
		
		callback(timestamp)
		
		if( _this.postFunction !== null ){
			_this.postFunction(timestamp)
		}
	}
}
