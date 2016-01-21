/**
 * @fileOverview Extra stuff added to ui.js 
 * @author Jerome Etienne jerome.etienne@gmail.com
 */

//////////////////////////////////////////////////////////////////////////////////
//		UI.Image
//////////////////////////////////////////////////////////////////////////////////
// HorizontalRule

UI.Image = function(url){
	UI.Element.call( this );

	var dom		= document.createElement( 'img' );
	this.dom	= dom

	if( url !== undefined ){
		this.load(url)
	}
	return this
}

UI.Image.prototype = Object.create( UI.Element.prototype );

UI.Image.prototype.load = function (url) {
	var image	= this.dom
	image.src	= url
};

//////////////////////////////////////////////////////////////////////////////////
//		UI.Icon						//
//////////////////////////////////////////////////////////////////////////////////
// HorizontalRule

UI.FontAwesomeIcon = function(){
	UI.Element.call( this );

	var dom		= document.createElement( 'i' );
	this.dom	= dom

	dom.classList.add('fa');
	dom.classList.add('uiFontAwesomeButton');

	dom.style.fontSize	= '1.1em'
	dom.style.padding	= '0.1em'
	// dom.style.verticalAlign	= 'center'

	return this
}

UI.FontAwesomeIcon.prototype = Object.create( UI.Element.prototype );

//////////////////////////////////////////////////////////////////////////////////
//		UI.Icon						//
//////////////////////////////////////////////////////////////////////////////////
// HorizontalRule

UI.Icon = function (url) {

	UI.Element.call( this );

	var dom		= document.createElement( 'img' );
	dom.className	= 'Icon';
	dom.src		= url;

	this.dom	= dom;

	return this;

};

UI.Icon.prototype = Object.create( UI.Element.prototype );
