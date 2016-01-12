
// FoldableSelect

UI.FoldableSelect = function () {

	UI.Element.call( this );

	var scope 		= this;
	var foldableSelect	= this

	var dom		= document.createElement( 'div' );
	dom.className	= 'FoldableSelect';
	dom.tabIndex	= 0;	// keyup event is ignored without setting tabIndex

	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
	// // if user click outside of any options lines, but inside domElement, unselect it
	// dom.addEventListener( 'click', function ( event ) {
	// 	scope.setValue( null );
	// 	scope.dom.dispatchEvent( changeEvent );
	// 	event.stopPropagation()
	// }, false );
			
	////////////////////////////////////////////////////////////////////////
	//	define signals
	////////////////////////////////////////////////////////////////////////


	// Broadcast for object selection after arrow navigation
	var changeEvent = document.createEvent('HTMLEvents');
	changeEvent.initEvent( 'change', true, true );

	/**
	 * Define signals
	 */
	foldableSelect.signals	= {
		stateChange	: new SIGNALS.Signal()
	}

	////////////////////////////////////////////////////////////////////////
	//	Handle keyboard
	////////////////////////////////////////////////////////////////////////

	// Prevent native scroll behavior
	dom.addEventListener( 'keydown', function (event) {
		switch ( event.keyCode ) {
			case 38: // up
			case 40: // down
				event.preventDefault();
				event.stopPropagation();
				break;
		}
	}, false);

	// Keybindings to support arrow navigation
	dom.addEventListener( 'keydown', function (event) {
		// check the keyCode
		var isKeyUp	= event.keyCode	=== 38 ? true : false
		var isKeyDown	= event.keyCode === 40 ? true : false
		if( isKeyUp === false && isKeyDown === false )	return

		// scan all options in the proper direction until you got a visible one
		var direction	= isKeyUp ? -1 : +1
		var nextIndex	= scope.selectedIndex + direction
		while( nextIndex >= 0 && nextIndex < scope.optionElements.length ){
			var optionElement	= scope.optionElements[ nextIndex ]

			if( isIndexVisible(nextIndex) === true ){
				// Highlight selected dom elem and scroll parent if needed
				scope.setValue( optionElement.value );
				scope.dom.dispatchEvent( changeEvent );
				break;
			}
			nextIndex	+= direction
		}

		return

		/**
		 * @param {Number} index - the index of the option to check
		 * @return {boolean} true if it is visible, false otherwise
		*/
		function isIndexVisible(index){
			var domElement	= scope.optionElements[ index ]
			domElement	= domElement.parentNode
			while( domElement.classList.contains('FoldableSelect') === false ){
				if( domElement.classList.contains('folded') ){
					return false
				}
				domElement	= domElement.parentNode
			}
			return true
		}
	}, false);
	// if return is pressed, toggle folded on the current element, if foldable
	dom.addEventListener( 'keydown', function (event) {
		// console.log('key enter', event.keyCode)
		var isKeyEnter	= event.keyCode === 13 ? true : false
		if( isKeyEnter === false )	return;

		var optionElement	= scope.optionElements[ scope.selectedIndex ]
		if( optionElement.classList.contains('foldable') ){
			optionElement.classList.toggle('folded')
			foldableSelect.signals.stateChange.dispatch()
		}
	}, false);

	////////////////////////////////////////////////////////////////////////
	//
	////////////////////////////////////////////////////////////////////////

	this.dom = dom;

	this.optionElements = [];
	this.selectedIndex = -1;
	this.selectedValue = null;

	return this;

};

UI.FoldableSelect.prototype = Object.create( UI.Element.prototype );

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////

UI.FoldableSelect.prototype.foldAll = function (){
	this.optionElements.forEach(function(domElement){
		if( domElement.classList.contains('foldable') === false )	return
		domElement.classList.add('folded')
	})
}

UI.FoldableSelect.prototype.expandAll = function (){
	this.optionElements.forEach(function(domElement){
		if( domElement.classList.contains('foldable') === false )	return
		domElement.classList.remove('folded')
	})
}



////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////

/**
 * return the state in json
 *
 * @return {Object} the json object
 */
UI.FoldableSelect.prototype.getStateJson = function(){
	var foldableSelect	= this
	// determine the unfoldedIndexes
	var unfoldedIndexes	= []
	foldableSelect.optionElements.forEach(function(optionElement, index){
		var isFoldable	= optionElement.classList.contains('foldable')
		if( isFoldable === false )	return

		var isFolded	= optionElement.classList.contains('folded')
		if( isFolded === true )	return

		unfoldedIndexes.push( index )
	})
	// build the state to return
	var state	= {
		unfoldedIndexes	: unfoldedIndexes,
		selectedValue	: foldableSelect.getValue(),
	}
	// actually return the result
	return state
}

/**
 * return the state to the one it was wehn .getStateJson() got called.
 * It assumes the options are the same
 *
 * @param {Object} state - the json object
 */
UI.FoldableSelect.prototype.setStateJson = function(state){
	var foldableSelect	= this
	// honor state.unfoldedIndexes
	var foldableSelect	= this
	foldableSelect.optionElements.forEach(function(optionElement, index){
		var isFoldable	= optionElement.classList.contains('foldable')
		if( isFoldable === false )	return

		var isUnfolded	= state.unfoldedIndexes.indexOf(index) !== -1 ? true : false
		if( isUnfolded ){
			optionElement.classList.remove('folded')
		}else{
			optionElement.classList.add('folded')
		}
	})
	// honor the state.unfoldedIndexes
	foldableSelect.setValue( state.selectedValue )
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////

UI.FoldableSelect.prototype.setOptions = function ( options ) {

	var scope		= this;
	var foldableSelect	= this
	var changeEvent = document.createEvent( 'HTMLEvents' );
	changeEvent.initEvent( 'change', true, true );
	var dblclickEvent = document.createEvent( 'HTMLEvents' );
	dblclickEvent.initEvent( 'dblclick', true, true );

	while ( scope.dom.children.length > 0 ) {

		scope.dom.removeChild( scope.dom.firstChild );

	}

	scope.optionElements = [];

	////////////////////////////////////////////////////////////////////////
	//
	////////////////////////////////////////////////////////////////////////
	var children	= pushOptions(options, '')
	children.forEach(function(child){
		scope.dom.appendChild(child)
	})
	return scope

	////////////////////////////////////////////////////////////////////////
	//
	////////////////////////////////////////////////////////////////////////
	function pushOptions(options, pad){
		var children	= []
		options.forEach(function(option){

			var container	= document.createElement( 'div' );
			container.classList.add('optionContainer')
			container.value	= option.value;

			// store it
			scope.optionElements.push( container );

			if( option.foldable === true ){
				container.classList.add('foldable')
				container.classList.add('folded')
			}

			// build the element
			var optionValue		= option.domElement;
			optionValue.className	= 'optionValue';

			var prefix	= document.createElement( 'span' );
			prefix.className= 'prefix';
			prefix.innerHTML= pad
			if( option.foldable === true )	prefix.setAttribute('title', 'fold/unfold')


			optionValue.insertBefore(prefix, optionValue.firstChild);

			//////////////////////////////////////////////////////////////////////////////////
			//		BindEvents
			//////////////////////////////////////////////////////////////////////////////////
			// Click on value => select the option
			optionValue.addEventListener( 'click', function ( event ) {
				if( container.value === scope.getValue() )	return
				scope.setValue( container.value );
				scope.dom.dispatchEvent( changeEvent );
				foldableSelect.signals.stateChange.dispatch()
				event.stopPropagation()
			}, false );
			// double click on value => if foldable, toggle fold on it
			optionValue.addEventListener( 'dblclick', function ( event ) {
				if( container.classList.contains('foldable') ){
					container.classList.toggle('folded')
					foldableSelect.signals.stateChange.dispatch()
				}
				scope.dom.dispatchEvent( dblclickEvent );
			}, false );
			// single click on prefix => if foldable, toggle fold on it
			prefix.addEventListener( 'click', function ( event ) {
				if( container.classList.contains('foldable') === false )	return
				var scrollTop	= scope.dom.scrollTop
				container.classList.toggle('folded')
				foldableSelect.signals.stateChange.dispatch()
				scope.dom.scrollTop	= scrollTop
			}, false );




			container.appendChild(optionValue)

			// go on with children now
			if( option.children.length > 0 ){
				var childrenContainer	= document.createElement( 'div' );
				childrenContainer.classList.add('optionChildren')
				container.appendChild(childrenContainer)
				var childrenEl		= pushOptions(option.children, pad + '&nbsp;&nbsp;&nbsp;')
				childrenEl.forEach(function(child){
					childrenContainer.appendChild(child)
				})
			}

			// add the container to the scope.dom
			children.push( container );
		})

		return children
	}
};


////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////


UI.FoldableSelect.prototype.getValue = function () {

	return this.selectedValue;

};

UI.FoldableSelect.prototype.setValue = function ( value ) {

	for ( var i = 0; i < this.optionElements.length; i ++ ) {

		var element = this.optionElements[ i ];

		if ( element.value === value ) {

			element.classList.add( 'active' );

			// scroll into view
			var element	= element.querySelector('.optionValue')
			var y		= element.offsetTop - this.dom.offsetTop;
			var bottomY	= y + element.offsetHeight;
			var minScroll	= bottomY - this.dom.offsetHeight;
			if ( this.dom.scrollTop > y ) {
				this.dom.scrollTop = y
			} else if ( this.dom.scrollTop < minScroll ) {
				this.dom.scrollTop = minScroll;
			}

			this.selectedIndex = i;

		} else {

			element.classList.remove( 'active' );

		}

	}

	this.selectedValue = value;

	return this;

};
