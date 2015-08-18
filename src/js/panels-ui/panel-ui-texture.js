/**
 * Handle panel for object3d
 *
 * @constructor
 */
var PanelTexture	= function(propertyPrefix){
	
	var signals	= editor.signals

	var container	= new UI.Panel()

	//////////////////////////////////////////////////////////////////////////////////
	//		handle autoRefresh
	//////////////////////////////////////////////////////////////////////////////////


	var textureRow = new UI.TextureRow2().setLabel('Texture').onChange(function(){
		var textureJson = textureRow.getValue();
		updateTexture(textureJson)
	})
	container.add( textureRow );

        this.textureRow = textureRow


	//////////////////////////////////////////////////////////////////////////////////
	//		handle autoRefresh
	//////////////////////////////////////////////////////////////////////////////////

	function update(propertyPrefix, textureJson){
		InspectDevTools.functionOnObject3d(function(object3d, propertyPrefix, textureJson){
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
