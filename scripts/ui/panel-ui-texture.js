/**
 * Handle panel for object3d
 *
 * @constructor
 */
var PanelTexture	= function(propertyPrefix){
	
	var signals	= editor.signals

	var container	= new UI.Panel()
	var _this	= container

	
	//////////////////////////////////////////////////////////////////////////////////
	//		comments
	//////////////////////////////////////////////////////////////////////////////////

	var textureRow = new UI.TextureRow().setLabel('Texture').onChange(function(){
		var textureJson = textureRow.getValue();
		update(textureJson)
	})
	textureRow.setPadding('0px')
	_this.add( textureRow );

        _this.textureRow = textureRow

	//////////////////////////////////////////////////////////////////////////////////
	//		popupMenu
	//////////////////////////////////////////////////////////////////////////////////
	var popupMenu	= UI.PopupMenuHelper.createSelect({
		''			: '--- Options ---',
		'openInTab'		: 'Open in Tab',
		'exportInConsole'	: 'Export in Console',
	}, onPopupMenuChange)
	textureRow.typeRow.add(popupMenu)
	
	function onPopupMenuChange(value){
		if( value === 'openInTab' ){
			var url	= textureRow.uiTexture.getValue()
			window.open( url, '_blank' );
			window.focus();
			return
		}else if( value === 'exportInConsole' ){
			InspectDevTools.functionOnObject3d(function(object3d, propertyPrefix){
				var texture	= eval('object3d.'+propertyPrefix)
				window.$texture = texture
				console.log('three.js inspector: Material exported as $texture')
				console.dir($texture)
			}, [propertyPrefix])
			return
		}else{
			console.assert(false)
		}
	}
	

	//////////////////////////////////////////////////////////////////////////////////
	//		comments
	//////////////////////////////////////////////////////////////////////////////////

	_this.updateUI	= function(textureJson){
		_this.textureRow.updateUI(textureJson)
	}

	//////////////////////////////////////////////////////////////////////////////////
	//		comments
	//////////////////////////////////////////////////////////////////////////////////

	function update(textureJson){
		InspectDevTools.functionOnObject3d(function(object3d, propertyPrefix, textureJson){
			// console.log('update texture', 'object3d.'+propertyPrefix)
			var texture	= eval('object3d.'+propertyPrefix)

			if( textureJson.uuid !== undefined )		texture.uuid = textureJson.uuid
			if( textureJson.name !== undefined )		texture.name = textureJson.name
			if( textureJson.anisotropy !== undefined )	texture.anisotropy = textureJson.anisotropy

			if( textureJson.wrapS !== undefined )	texture.wrapS = textureJson.wrapS
			if( textureJson.wrapT !== undefined )	texture.wrapT = textureJson.wrapT

			if( textureJson.repeat !== undefined )	texture.repeat.copy(textureJson.repeat)
			if( textureJson.offset !== undefined )	texture.offset.copy(textureJson.offset)
			
			if( textureJson.sourceFile !== texture.sourceFile ){
				var loader = new THREE.ImageLoader();
				loader.crossOrigin = '';
				loader.load( textureJson.sourceFile, function( image ){
					texture.image = image;
					texture.needsUpdate = true;
				});
				texture.sourceFile = textureJson.sourceFile;
			}
			
			texture.needsUpdate	= true;
		}, [propertyPrefix, textureJson]);		
	}

	return container
};
