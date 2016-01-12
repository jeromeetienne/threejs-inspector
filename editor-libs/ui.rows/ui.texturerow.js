/**
 * define a ui row for THREE.Texture
 * @constructor
 */
UI.TextureRow = function(){
	UI.Panel.call( this );
	// build the container
	var container	= this
	var textureJson	= null
	
	//////////////////////////////////////////////////////////////////////////////////
	//		handle onChange
	//////////////////////////////////////////////////////////////////////////////////

	function dispatchOnChange(){
		_onChangeCallback	&& _onChangeCallback()
	}

	var _onChangeCallback	= null
	this.onChange	= function(value){
		_onChangeCallback	= value
		return this
	}
	//////////////////////////////////////////////////////////////////////////////////
	//		Comment								//
	//////////////////////////////////////////////////////////////////////////////////

	var typeRow = new UI.TextRow().setLabel('Texture')
	container.add( typeRow );
	this.typeRow = typeRow
	
	typeRow.onClick(function(){
		foldToggle()
	})

	//////////////////////////////////////////////////////////////////////////////////
	//		Comment								//
	//////////////////////////////////////////////////////////////////////////////////

	function isFolded(){
		if( foldButton.dom.classList.contains('fa-minus') )	return false
		return true
	}
	function foldToggle(){
		if( isFolded() ){
			foldButton.dom.classList.remove('fa-plus')
			foldButton.dom.classList.add('fa-minus')
		}else{
			foldButton.dom.classList.add('fa-plus')
			foldButton.dom.classList.remove('fa-minus')
		}
		foldSyncDisplay()
	}
	function foldSyncDisplay(){
		// actually display or not depending on current state
		var display	= isFolded() ? 'none'	: ''
		uuidRow.setDisplay(display)
		nameRow.setDisplay(display)

		imageRow.setDisplay(display)
		anisotropyRow.setDisplay(display)

		magFilterRow.setDisplay(display)
		minFilterRow.setDisplay(display)

		wrapRow.setDisplay(display)
		repeatRow.setDisplay(display)
		offsetRow.setDisplay(display)
	}


	var foldButton	= new UI.FontAwesomeIcon().addClass('fa-plus').onClick(foldToggle)
	// foldButton.dom.style.marginTop	= '0.1em';
	foldButton.dom.style.cssFloat	= 'left';
	foldButton.dom.style.fontSize	= '1em';
	foldButton.dom.style.marginLeft	= '-1em';
	foldButton.setTitle('Show/hide texture details.')
	typeRow.add( foldButton );
	
	foldButton.onClick(function(){
		foldToggle()
	})
	//////////////////////////////////////////////////////////////////////////////////
	//		Comment								//
	//////////////////////////////////////////////////////////////////////////////////
	var imageRow	= new UI.Panel()
	container.add(imageRow)


	var label	= new UI.Text( '- image' ).setWidth( '90px' )
	imageRow.add( label );

	var uiTexture	= new UI.Texture().onChange(dispatchOnChange);
	imageRow.add( uiTexture );
	container.uiTexture	= uiTexture;
	
	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
	var uuidRow	= new UI.InputRow().onChange(dispatchOnChange)
	uuidRow.setDisplay('none').setLabel('- uuid')
	container.add( uuidRow );

	var nameRow	= new UI.InputRow().onChange(dispatchOnChange)
	nameRow.setDisplay('none').setLabel('- name')
	container.add( nameRow );

	var anisotropyRow = new UI.NumberRow().setDisplay('none').setLabel('- anisotropy').onChange(dispatchOnChange)
	anisotropyRow.value.setRange(0.1,128).setPrecision(0)
	container.add( anisotropyRow );

	var filterOptions	= {
		'1003'	: 'Nearest',
		'1004'	: 'NearestMipMapNearest',
		'1005'	: 'NearestMipMapLinear',
		'1006'	: 'Linear',
		'1007'	: 'LinearMipMapNearest',
		'1008'	: 'LinearMipMapLinear',
	}
	
	
	var magFilterRow = new UI.SelectRow().setDisplay('none').setLabel('- mag filter').onChange(dispatchOnChange)
	magFilterRow.value.setOptions(filterOptions)
	container.add( magFilterRow );
	
	var minFilterRow = new UI.SelectRow().setDisplay('none').setLabel('- min filter').onChange(dispatchOnChange)
	minFilterRow.value.setOptions(filterOptions)
	container.add( minFilterRow );

	//////////////////////////////////////////////////////////////////////////////////
	//		wrapRow
	//////////////////////////////////////////////////////////////////////////////////

	var wrapRow	= new UI.Panel()
	container.add(wrapRow)

	wrapRow.add( new UI.Text('- wrap').setWidth( '90px' ) );

	var wrapOptions	= {
		'1001'	: 'ClampToEdge',
		'1000'	: 'Repeat',
		'1002'	: 'MirroredRepeat',
	}
	wrapRow.add( new UI.Text('S:') );
	var wrapS = new UI.Select().setOptions(wrapOptions).onChange(function(){
		if( wrapLock.getValue() === true )	wrapT.setValue( wrapS.getValue() )
		dispatchOnChange()
	})
	wrapRow.add(wrapS)

	wrapRow.add( new UI.Text(' T:') );
	var wrapT = new UI.Select().setOptions(wrapOptions).onChange(function(){
		if( wrapLock.getValue() === true )	wrapS.setValue( wrapT.getValue() )
		dispatchOnChange()
	})
	wrapRow.add(wrapT)

	var wrapLock	= new UI.Checkbox().onChange(function(){
		if( wrapLock.getValue() === true )	wrapT.setValue( wrapS.getValue() )
	})
	wrapLock.setPosition('absolute').setLeft('75px').setTitle('lock both wrap mode').setValue(true)
	wrapRow.add( wrapLock )

	//////////////////////////////////////////////////////////////////////////////////
	//		repeatRow
	//////////////////////////////////////////////////////////////////////////////////

	var repeatRow = new UI.LockableVector2Row().setLabel('- repeat').setDisplay('none')
	repeatRow.onChange(function(){
		repeatRow.update(textureJson.repeat)
		dispatchOnChange()
	})
	repeatRow.lock.setValue(true)
	container.add( repeatRow );

	repeatRow.valueX.setRange(0.001, Infinity).setPrecision(2)
	repeatRow.valueY.setRange(0.001, Infinity).setPrecision(2)
	
	//////////////////////////////////////////////////////////////////////////////////
	//		offsetRow
	//////////////////////////////////////////////////////////////////////////////////

	var offsetRow = new UI.Vector2Row().setLabel('- offset').setDisplay('none').onChange(dispatchOnChange)
	container.add( offsetRow );
	
	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
	/**
	 * set the label of the row
	 * @param {String} value - the label value
	 */
	this.setLabel	= function(value){
		typeRow.setLabel(value)
		return this
	}
	
	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
	
	this.getValue	= function(){
		
		if( textureJson.sourceFile !== undefined )	textureJson.sourceFile	= uiTexture.getValue()
		if( textureJson.uuid !== undefined )	textureJson.uuid	= uuidRow.getValue()
		if( textureJson.name !== undefined )	textureJson.name	= nameRow.getValue()
		if( textureJson.anisotropy !== undefined )	textureJson.anisotropy	= anisotropyRow.getValue()

		if( textureJson.magFilter !== undefined )	textureJson.magFilter	= parseInt(magFilterRow.getValue(), 10)
		if( textureJson.minFilter !== undefined )	textureJson.minFilter	= parseInt(minFilterRow.getValue(), 10)

		if( textureJson.wrapS !== undefined )	textureJson.wrapS	= parseInt(wrapS.getValue(), 10)
		if( textureJson.wrapT !== undefined )	textureJson.wrapT	= parseInt(wrapT.getValue(), 10)
		
		if( textureJson.repeat !== undefined ){
			textureJson.repeat.x	= repeatRow.valueX.getValue()
			textureJson.repeat.y	= repeatRow.valueY.getValue()
		}
		
		if( textureJson.offset !== undefined ){
			textureJson.offset.x	= offsetRow.valueX.getValue()
			textureJson.offset.y	= offsetRow.valueY.getValue()
		}
		
		// console.log('texture getValue', textureJson)
		
		return textureJson
	}

	/**
	 * update the ui
	 * @param  {THREE.Texture|null} [newValue]	- the texture to define
	 */
	this.updateUI	= function(newValue){
		// update value
		textureJson	= newValue !== undefined ? newValue : null
		// if vector is undefined, hide the row, else display it
		container.setDisplay(newValue !== undefined ? '' : 'none')
		// if vector is undefined, return now
		if( newValue === undefined )	return
		// set the new value
		typeRow.setValue( textureJson.sniffType )
		uiTexture.setValue( textureJson.sourceFile )

		uuidRow.setValue( textureJson.uuid )
		nameRow.setValue( textureJson.name )
		anisotropyRow.setValue( textureJson.anisotropy )

		magFilterRow.setValue( textureJson.magFilter )
		minFilterRow.setValue( textureJson.minFilter )

		wrapS.setValue( textureJson.wrapS )
		wrapT.setValue( textureJson.wrapT )

		repeatRow.updateUI( textureJson.repeat )
		offsetRow.updateUI( textureJson.offset )
		
		foldSyncDisplay()
	}
	

	//////////////////////////////////////////////////////////////////////////////////
	//		Handle drop event
	//////////////////////////////////////////////////////////////////////////////////

	container.dom.addEventListener('dragenter', function(event){
		container.dom.style.backgroundColor	= '#ccc'
		container.dom.style.borderRadius	= '5px'

	})
	container.dom.addEventListener('dragleave', function(event){
		container.dom.style.backgroundColor	= ''

	})
	container.dom.addEventListener('dragover', function(event){
		container.dom.style.backgroundColor	= '#ccc'
		event.preventDefault();
	})

	container.dom.addEventListener('drop', function(event){
		container.dom.style.backgroundColor	= '#0066ff'

		event.preventDefault();

		var reader = new FileReader();
		reader.onload = function(event) {
			container.dom.style.backgroundColor	= ''

			var url = event.currentTarget.result
			console.log('file loaded. url length', url.length)
			uiTexture.setValue(url)
			dispatchOnChange()
		};
		reader.readAsDataURL( event.dataTransfer.files[ 0 ] );

	})
	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////


	foldSyncDisplay()
}
UI.TextureRow.prototype = Object.create( UI.Panel.prototype );
