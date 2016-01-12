UI.Texture = function () {

	UI.Element.call( this );
	var _this	= this;

	var dom		= document.createElement( 'span' );
	
	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
	var input = document.createElement( 'input' );
	input.type = 'file';
	input.addEventListener( 'change', function ( event ) {
		var file = event.target.files[ 0 ]
		var reader = new FileReader();
		reader.addEventListener( 'load', function ( event ) {
			var url	= event.target.result 
			console.log('url', url );
			_this.setValue(url)
			
			if( _this.onChangeCallback )	_this.onChangeCallback();

		}, false );

		reader.readAsDataURL( file );
	} );
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
		input.click();
	})


	//////////////////////////////////////////////////////////////////////////////////
	//		Comment								//
	//////////////////////////////////////////////////////////////////////////////////
	var urlInput	= document.createElement( 'input' );
	urlInput.style.width	= '110px';
	urlInput.style.border	= '1px solid #ccc';
	urlInput.setAttribute('placeholder', 'Texture\'s url')
	urlInput.setAttribute('title', 'the url of the texture')
	dom.appendChild( urlInput );
	urlInput.addEventListener('change', function(){
		var url		= urlInput.value
		_this.setValue( urlInput.value )

		if( _this.onChangeCallback )	_this.onChangeCallback();
	})

	//////////////////////////////////////////////////////////////////////////////////
	//		Comment								//
	//////////////////////////////////////////////////////////////////////////////////
	this._canvas	= canvas
	this._urlInput	= urlInput
	this.dom	= dom;
}

UI.Texture.prototype = Object.create( UI.Element.prototype );


UI.Texture.prototype.getValue = function () {
	return this._urlInput.value;
};

UI.Texture.prototype.setValue = function(url){
	console.log('uiTexture.setValue', url)
	this._urlInput.value	= url
	if( url ){
		var image = document.createElement( 'img' );
		image.addEventListener( 'load', function ( event ) {
			var canvas	= this._canvas;
			var context	= canvas.getContext( '2d' );
			var scale	= canvas.width / image.width;
			context.drawImage(image, 0, 0, image.width * scale, image.height * scale );		

		}.bind(this), false );

		image.src	= url
	}
}

UI.Texture.prototype.onChange = function ( callback ) {
	this.onChangeCallback = callback;
	return this;
}
