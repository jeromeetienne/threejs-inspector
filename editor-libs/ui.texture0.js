UI.Texture = function () {

	UI.Element.call( this );
	var _this	= this;

	var dom		= document.createElement( 'span' );
	


	//////////////////////////////////////////////////////////////////////////////////
	//		Comment								//
	//////////////////////////////////////////////////////////////////////////////////
	var canvas = document.createElement( 'canvas' );
	canvas.width = 32;
	canvas.height = 16;
	canvas.style.cursor = 'pointer';
	canvas.style.marginRight = '5px';
	canvas.style.border = '1px solid #888';
	dom.appendChild( canvas );

	canvas.setAttribute('title', 'click to open in a new tab')
	canvas.addEventListener('click', function(){
		var url	= urlInput.value
		window.open( url, '_blank' );
		window.focus();
	})


	//////////////////////////////////////////////////////////////////////////////////
	//		Comment								//
	//////////////////////////////////////////////////////////////////////////////////
	var urlInput	= document.createElement( 'input' );
	urlInput.style.width	= '64px';
	urlInput.style.border	= '1px solid #ccc';
	urlInput.setAttribute('placeholder', 'Texture\'s url')
	urlInput.setAttribute('title', 'the url of the texture')
	dom.appendChild( urlInput );
	urlInput.addEventListener('change', function(){
		var url		= urlInput.value
		// THREE.ImageUtils.loadTexture(url, undefined, function(texture){
		// 
		// 	_this.setValue(texture)
		// 
		// 	if( _this.onChangeCallback )	_this.onChangeCallback();
		// })
	})

	//////////////////////////////////////////////////////////////////////////////////
	//		Comment								//
	//////////////////////////////////////////////////////////////////////////////////
	this._canvas	= canvas
	this._urlInput	= urlInput
	this.dom	= dom;
	this.texture	= null;
}

UI.Texture.prototype = Object.create( UI.Element.prototype );


UI.Texture.prototype.getValue = function () {
	return this.texture;
};

UI.Texture.prototype.setValue = function(texture){
	if( texture !== null ){
		var image	= texture.image;

		this._urlInput.value	= image.src

		var canvas	= this._canvas;
		var context	= canvas.getContext( '2d' );
		var scale	= canvas.width / image.width;
		context.drawImage(image, 0, 0, image.width * scale, image.height * scale );
	}else{
		this._urlInput.value	= ''		
	}
	this.texture		= texture		
}

UI.Texture.prototype.onChange = function ( callback ) {
	this.onChangeCallback = callback;
	return this;
}
