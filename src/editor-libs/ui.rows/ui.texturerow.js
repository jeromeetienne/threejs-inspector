/**
 * define a ui row for THREE.Texture
 * @constructor
 */
UI.TextureRow = function(){
	UI.Panel.call( this );
	// build the container
	var container	= this

	//////////////////////////////////////////////////////////////////////////////////
	//		Comment								//
	//////////////////////////////////////////////////////////////////////////////////
	var firstRow	= new UI.Panel()
	container.add(firstRow)

	var label	= new UI.Text( '' ).setWidth( '90px' )
	firstRow.add( label );
	container.label	= label;

	var enabled	= new UI.Checkbox().onChange(update).setTitle('To enable/disable this texture')
	firstRow.add( enabled );
	container.enabled	= enabled;

	var value	= new UI.Texture().onChange(function(){
		updateUI()
		update()
	});
	firstRow.add( value );
	container.value	= value;


	var foldButton	= new UI.FontAwesomeIcon().addClass('fa-plus')
	foldButton.dom.style.marginTop	= '0.1em';
	foldButton.setTitle('Show/hide texture details.')
	foldButton.onClick(function(){
		foldToggle();
	});
	firstRow.add( foldButton );

	//////////////////////////////////////////////////////////////////////////////////
	//		wrapRow
	//////////////////////////////////////////////////////////////////////////////////

	var wrapRow	= new UI.Panel().setDisplay('none')
	container.add(wrapRow)

	wrapRow.add( new UI.Text('- wrap').setWidth( '90px' ) );

	var wrapOptions	= {
		'ClampToEdgeWrapping'	: 'ClampToEdge',
		'RepeatWrapping'	: 'Repeat',
		'MirroredRepeatWrapping': 'MirroredRepeat',
	}
	wrapRow.add( new UI.Text('S:') );
	var wrapS = new UI.Select().setOptions(wrapOptions).onChange(function(){
		if( wrapLock.getValue() === true ){
			wrapT.setValue( wrapS.getValue() )
		}
		update()
	})
	wrapRow.add(wrapS)

	wrapRow.add( new UI.Text(' T:') );
	var wrapT = new UI.Select().setOptions(wrapOptions).onChange(function(){
		if( wrapLock.getValue() === true ){
			wrapS.setValue( wrapT.getValue() )
		}
		update()
	})
	wrapRow.add(wrapT)

	var wrapLock	= new UI.Checkbox().onChange(function(){
		if( wrapLock.getValue() === true ){
			wrapT.setValue( wrapS.getValue() )
		}
	})
	wrapLock.setPosition('absolute').setLeft('75px').setTitle('lock both wrap mode').setValue(true)
	wrapRow.add( wrapLock )

	//////////////////////////////////////////////////////////////////////////////////
	//		repeatRow
	//////////////////////////////////////////////////////////////////////////////////

	var repeatRow = new UI.LockableVector2Row().setLabel('- repeat').setDisplay('none').onChange(update);
	repeatRow.lock.setValue(true)
	container.add( repeatRow );

	//////////////////////////////////////////////////////////////////////////////////
	//		offsetRow
	//////////////////////////////////////////////////////////////////////////////////

	var offsetRow = new UI.Vector2Row().setLabel('- offset').setDisplay('none').onChange(update);
	container.add( offsetRow );

	//////////////////////////////////////////////////////////////////////////////////
	//		anisotropyRow
	//////////////////////////////////////////////////////////////////////////////////

	var anisotropyRow = new UI.NumberRow().setLabel('- anisotropy').setDisplay('none').onChange(update);
	anisotropyRow.value.setPrecision(0)
	container.add( anisotropyRow );

	var minAnisotropy	= new UI.FontAwesomeIcon().addClass('fa-angle-double-left')
	minAnisotropy.setTitle('Set anisotropy to the minimum')
	minAnisotropy.setPosition( 'absolute' ).setLeft( '150px' )
	anisotropyRow.add(minAnisotropy)
	minAnisotropy.onClick(function(){
		var renderer	= editor.viewport.renderer
		// console.dir(renderer)
		anisotropyRow.setValue(1)
		update()
	})

	var maxAnisotropy	= new UI.FontAwesomeIcon().addClass('fa-angle-double-right')
	maxAnisotropy.setTitle('Set anisotropy to the maximum')
	maxAnisotropy.setPosition( 'absolute' ).setLeft( '170px' )
	anisotropyRow.add(maxAnisotropy)
	maxAnisotropy.onClick(function(){
		var renderer	= editor.viewport.renderer
		anisotropyRow.setValue( renderer.getMaxAnisotropy() )
		update()
	})

	//////////////////////////////////////////////////////////////////////////////////
	//		Comment								//
	//////////////////////////////////////////////////////////////////////////////////

	function isFolded(){
		if( foldButton.dom.classList.contains('fa-minus') )	return false
		return true
	}
	function foldToggle(){
		// handle toggle button
		if( isFolded() ){
			foldButton.dom.classList.remove('fa-plus')
			foldButton.dom.classList.add('fa-minus')
		}else{
			foldButton.dom.classList.add('fa-plus')
			foldButton.dom.classList.remove('fa-minus')
		}

		syncDisplay()
	}

	function syncDisplay(){
		// actually display or not depending on current state
		var display	= isFolded() ? 'none'	: ''
		wrapRow.setDisplay(display)
		repeatRow.setDisplay(display)
		offsetRow.setDisplay(display)
		anisotropyRow.setDisplay(display)
	}

	//////////////////////////////////////////////////////////////////////////////////
	//		handle onChange
	//////////////////////////////////////////////////////////////////////////////////
	function update(){
		var texture	= value.getValue()

		texture.wrapS	= wrapStringToValue( wrapS.getValue() )
		texture.wrapT	= wrapStringToValue( wrapT.getValue() )

		repeatRow.update(texture.repeat)
		offsetRow.update(texture.offset)
		anisotropyRow.update(texture, 'anisotropy')

		texture.needsUpdate	= true

		_onChange()

		return

		function wrapStringToValue(str){
			if( str === 'RepeatWrapping' )		return THREE.RepeatWrapping
			if( str === 'ClampToEdgeWrapping' )	return THREE.ClampToEdgeWrapping
			if( str === 'MirroredRepeatWrapping' )	return THREE.MirroredRepeatWrapping
			console.assert(false)
		}
	}

	var _onChange	= function(){}
	this.onChange	= function(value){
		_onChange	= value
		return this
	}

	function updateUI(){
		enabled.setValue(value.getValue() !== null ? true : false)

		var texture	= value.getValue()
		if( texture === null )	return

		wrapS.setValue( wrapValueToString(texture.wrapS) )
		wrapT.setValue( wrapValueToString(texture.wrapT) )

		repeatRow.updateUI(texture.repeat)
		offsetRow.updateUI(texture.offset)
		anisotropyRow.updateUI(texture.anisotropy)

		syncDisplay()

		return

		function wrapValueToString(value){
			if( value === THREE.RepeatWrapping )		return 'RepeatWrapping'
			if( value === THREE.ClampToEdgeWrapping )	return 'ClampToEdgeWrapping'
			if( value === THREE.MirroredRepeatWrapping )	return 'MirroredRepeatWrapping'
			console.assert(false)
		}
	}
	//////////////////////////////////////////////////////////////////////////////////
	//		handle label
	//////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * set the label of the row
	 * @param {String} value - the label value
	 */
	this.setLabel	= function(value){
		label.setValue(value)
		return this
	}

	//////////////////////////////////////////////////////////////////////////////////
	//		honor .update and .updateUI api
	//////////////////////////////////////////////////////////////////////////////////
	this.update	= function(scope, property){
		var isEnabled	= enabled.getValue() === true ? true : false
		scope[property]	= isEnabled ? value.getValue() : null
	}

	/**
	 * update the ui
	 * @param  {THREE.Texture|null} [newValue]	- the texture to define
	 */
	this.updateUI	= function(newValue){
		// if vector is undefined, hide the row, else display it
		container.setDisplay(newValue !== undefined ? '' : 'none')
		// if vector is undefined, return now
		if( newValue === undefined )	return
		// set the new value1
		value.setValue( newValue );
		updateUI()
	}
}
UI.TextureRow.prototype = Object.create( UI.Panel.prototype );
