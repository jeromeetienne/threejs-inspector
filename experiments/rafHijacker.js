/**
 * Hijack requestAnimationFrame. It can add preFunction or postFunction.
 * 
 * @constructor
 */
var RafHijacker	= function(){
	this._originalFct	= requestAnimationFrame
	
	this.preFunction	= null
	this.postFunction	= null
	this.enabled		= true

	this.fps		= -1
}

//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////

/**
 * actually do the AnimationFrame
 * @param {Function} callback  [description]
 * @param {Number}   timestamp [description]
 */
RafHijacker.prototype._onAnimationFrame = function (callback, timestamp) {
	if( this.enabled === false )	return
	
	if( this.preFunction !== null ){
		this.preFunction(timestamp)
	}
	
	callback(timestamp)
	
	if( this.postFunction !== null ){
		this.postFunction(timestamp)
	}
};

//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////

/**
 * restore the original function
 *
 * @return RafHijacker
 */
RafHijacker.prototype.hijack	= function(){
	var _this	= this
	requestAnimationFrame	= function(callback){
		var originalFct = this._originalFct
		originalFct(function(timestamp){
			_this._onAnimationFrame(callback, timestamp)				
		})
	}	
	return this
}

/**
 * restore the original function
 *
 * @return RafHijacker
 */
RafHijacker.prototype.actAsTimer	= function(){
	var _this	= this
	if( this.fps <= 0 )	return
	requestAnimationFrame	= function(callback){
		setTimeout(function(){
			_this._onAnimationFrame(callback, performance.now())
		}, 1000 / _this.fps)
	}
}


/**
 * restore the original function
 */
RafHijacker.prototype.restore	= function(){
	requestAnimationFrame	= this._originalFct
	return this
}
