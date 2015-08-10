/**
 * Handle panel for object3d
 *
 * @constructor
 */
var PanelMaterial	= function(faceMaterialIndex){

	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
	var signals	= editor.signals
	var subMaterialPanel = null;
	
	if( faceMaterialIndex === -1 ){
		var container	= new UI.Panel()
	}else{
		var container	= UI.CollapsiblePanelHelper.createContainer('Material '+(faceMaterialIndex+1), 'sidebarMaterial'+(faceMaterialIndex === -1 ? '' : '_'+faceMaterialIndex, true))
	}
	
	//////////////////////////////////////////////////////////////////////////////////
	//		signals
	//////////////////////////////////////////////////////////////////////////////////

	editor.signals.objectSelected.add(function( object3d ){
		if( object3d === null || object3d.material === undefined ){
			container.setDisplay( 'none' );
			return
		}

		if( faceMaterialIndex !== -1 ){
			if( object3d.material.materials === undefined 
					|| object3d.material.materials[faceMaterialIndex] === undefined ){
				container.setDisplay( 'none' );
				return
			}
		}

		container.setDisplay( 'inherit' );
		updateUI()
	})

	//////////////////////////////////////////////////////////////////////////////////
	//		select row to change type of material
	//////////////////////////////////////////////////////////////////////////////////

	var materialSelectRow	= new UI.SelectRow()
	materialSelectRow.setLabel('Type')
	container.add( materialSelectRow );
	materialSelectRow.value.setOptions({
		'LineBasicMaterial'	: 'LineBasicMaterial',
		'LineDashedMaterial'	: 'LineDashedMaterial',
		'MeshBasicMaterial'	: 'MeshBasicMaterial',
		'MeshDepthMaterial'	: 'MeshDepthMaterial',
		'MeshFaceMaterial'	: 'MeshFaceMaterial',
		'MeshLambertMaterial'	: 'MeshLambertMaterial',
		'MeshNormalMaterial'	: 'MeshNormalMaterial',
		'MeshPhongMaterial'	: 'MeshPhongMaterial',
		'PointCloudMaterial'	: 'PointCloudMaterial',
		'ShaderMaterial'	: 'ShaderMaterial',
		'SpriteMaterial'	: 'SpriteMaterial',
	})
	materialSelectRow.onChange(function(){
		var value = materialSelectRow.value.getValue()
		InspectDevTools.functionOnObject3d(function(object3d, materialType, faceMaterialIndex){
			// create the material
			var material = new THREE[ materialType ]();
			material.needsUpdate = true;

			// update object3d
			if( faceMaterialIndex === -1 ){
				object3d.material = material
			}else{
				object3d.material.materials[faceMaterialIndex] = material				
			}
		}, [value, faceMaterialIndex]);
	})
	//////////////////////////////////////////////////////////////////////////////////
	//		handle help
	//////////////////////////////////////////////////////////////////////////////////
	
	;(function(){
		var helpButton = new UI.Button('?').setTitle('Open three.js documentation')
		materialSelectRow.add(helpButton)
		helpButton.onClick(function(){
			console.log('help button clicked', editor.selected.material.sniffType)
			// var url = 'http://threejs.org/docs/#Reference/Objects/Mesh'
			var url = typeToUrl(editor.selected.material.sniffType)
			InspectDevTools.plainFunction(function(url){
				var win = window.open(url, '_blank');
			}, [url]);
			
			return
			
			function typeToUrl(sniffType){
				var url = 'http://threejs.org/docs/#Reference/Materials/'+sniffType
				return url
			}
		})
	})()
	//////////////////////////////////////////////////////////////////////////////////
	//		popupMenu
	//////////////////////////////////////////////////////////////////////////////////
	var popupMenu	= UI.PopupMenuHelper.createSelect({
		''			: '--- Options ---',
		'createMap'		: 'Create Map Texture',
		'exportInConsole'	: 'Export in Console',
	}, onPopupMenuChange)
	materialSelectRow.add(popupMenu)
	
	function onPopupMenuChange(value){
		var injectFunction = InspectDevTools.functionOnObject3d
		var geometry	= editor.selected.geometry
		
		if( value === 'createMap' ){
			injectFunction(function(object3d, textureType, faceMaterialIndex){
				var material = faceMaterialIndex === -1 ? object3d.material : object3d.material.materials[faceMaterialIndex]
				// default image
				var url = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="

				material[textureType]	= THREE.ImageUtils.loadTexture( url );
				material.needsUpdate = true;
			}, ['map', faceMaterialIndex]);		
		}else if( value === 'exportInConsole' ){
			InspectDevTools.functionOnObject3d(function(object3d, faceMaterialIndex){
				var material = faceMaterialIndex === -1 ? object3d.material : object3d.material.materials[faceMaterialIndex]
				window.$material = material
				console.log('three.js inpector: Material exported as $material')
			}, [faceMaterialIndex])
			return
		}else{
			console.assert(false)
		}

		updateWhole()
	}
	//////////////////////////////////////////////////////////////////////////////////
	//		handle tab-material
	//////////////////////////////////////////////////////////////////////////////////

	var uuidRow	= new UI.InputRow()
	uuidRow.setLabel('uuid').onChange(update)
	container.add( uuidRow );

	var nameRow	= new UI.InputRow()
	nameRow.setLabel('Name').onChange(update)
	container.add( nameRow );

	var colorRow	= new UI.ColorRow()
	colorRow.setLabel('Color').onChange(update)
	container.add( colorRow );

	var emissiveRow	= new UI.ColorRow()
	emissiveRow.setLabel('Emissive').onChange(update)
	container.add( emissiveRow );

	var specularRow	= new UI.ColorRow()
	specularRow.setLabel('Specular').onChange(update)
	container.add( specularRow );
	
	var shininessRow	= new UI.NumberRow()
	shininessRow.setLabel('Shininess').onChange(update)
	container.add( shininessRow );

	var wireframeRow	= new UI.CheckboxRow().setTitle('To enable wireframe')
	wireframeRow.setLabel('wireframe').onChange(update)
	container.add( wireframeRow );

	var wireframeLinewidthRow	= new UI.NumberRow()
	wireframeLinewidthRow.value.setPrecision(0)
	wireframeLinewidthRow.setLabel('wireframe width').onChange(update)
	container.add( wireframeLinewidthRow );

	var opacityRow	= new UI.NumberRow()
	opacityRow.setLabel('Opacity').onChange(update)
	opacityRow.value.setRange(0,1.0)
	container.add( opacityRow );

	var transparentRow	= new UI.CheckboxRow()
	transparentRow.setLabel('Transparent').onChange(update)
	container.add( transparentRow );

	var sideRow	= new UI.SelectRow()
	sideRow.setLabel('Side').onChange(update)
	container.add( sideRow );
	sideRow.value.setOptions( {
		0	: 'Front',
		1	: 'BackSide',
		2	: 'DoubleSide'
	})
	
	var shadingRow	= new UI.SelectRow()
	shadingRow.setLabel('Shading').onChange(update)
	container.add( shadingRow );
	shadingRow.value.setOptions( {
		0	: 'No',
		1	: 'Flat',
		2	: 'Smooth'
	})

	
	var blendingRow	= new UI.SelectRow()
	blendingRow.setLabel('Blending').onChange(update)
	container.add( blendingRow );
	blendingRow.value.setOptions( {
		0	: 'No',
		1	: 'Normal',
		2	: 'Additive',
		3	: 'Subtractive',
		4	: 'Multiply',
		5	: 'Custom',
	})
	
	var linewidthRow = new UI.NumberRow().onChange(update)
	linewidthRow.setLabel('Line Width')
	container.add( linewidthRow );

	var dashSizeRow = new UI.NumberRow().onChange(update)
	dashSizeRow.setLabel('Dash Size')
	container.add( dashSizeRow );
	
	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
	var visibleRow	= new UI.CheckboxRow().setTitle('To enable visible')
	visibleRow.setLabel('visible').onChange(update)
	container.add( visibleRow );

	var depthTestRow	= new UI.CheckboxRow().setTitle('To enable depthTest')
	depthTestRow.setLabel('depthTest').onChange(update)
	container.add( depthTestRow );

	var depthWriteRow	= new UI.CheckboxRow().setTitle('To enable depthWrite')
	depthWriteRow.setLabel('depthWrite').onChange(update)
	container.add( depthWriteRow );

	var alphaTestRow	= new UI.NumberRow().setTitle('To enable alphaTest')
	alphaTestRow.value.setRange(0,1.0)
	alphaTestRow.setLabel('alphaTest').onChange(update)
	container.add( alphaTestRow );

	//////////////////////////////////////////////////////////////////////////////////
	//		Textures
	//////////////////////////////////////////////////////////////////////////////////

	var mapRow = new UI.TextureRow2().setLabel('Map').onChange(function(){
		var textureJson = mapRow.getValue();
		updateTexture('map', textureJson)
	})
	container.add( mapRow );

	var bumpMapRow = new UI.TextureRow2().setLabel('Bump map').onChange(function(){
		var textureJson = bumpMapRow.getValue();
		updateTexture('map', textureJson)
	})
	container.add( bumpMapRow );

	
	function updateTexture(materialProperty, textureJson){
		InspectDevTools.functionOnObject3d(function(object3d, materialProperty, textureJson, faceMaterialIndex){
			var material	= faceMaterialIndex === -1 ? object3d.material : object3d.material.materials[faceMaterialIndex]
			var texture	= material[materialProperty]

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
		}, [materialProperty, textureJson, faceMaterialIndex]);		
	}
	

	//////////////////////////////////////////////////////////////////////////////////
	//		update()
	//////////////////////////////////////////////////////////////////////////////////
	function update(){
		var material = faceMaterialIndex === -1 ? editor.selected.material : editor.selected.material.materials[faceMaterialIndex]

		var injectProperty = InspectDevTools.propertyOnObject3d;
		var injectFunction = InspectDevTools.functionOnObject3d
		var propertyPrefix = faceMaterialIndex === -1 ? 'material' : 'material.materials['+faceMaterialIndex+']'

		injectProperty(propertyPrefix+'.uuid', uuidRow.getValue())
		injectProperty(propertyPrefix+'.name', nameRow.getValue())
		
		// injectFunction
		if( material.color !== undefined ){
			injectFunction(function(object3d, colorHexValue, faceMaterialIndex){
				var material = faceMaterialIndex === -1 ? object3d.material : object3d.material.materials[faceMaterialIndex]
				material.color.set(colorHexValue)
			}, [colorRow.value.getHexValue(), faceMaterialIndex]);
		}

		// injectFunction
		if( material.emissive !== undefined ){
			injectFunction(function(object3d, colorHexValue, faceMaterialIndex){
				var material = faceMaterialIndex === -1 ? object3d.material : object3d.material.materials[faceMaterialIndex]
				material.emissive.set(colorHexValue)
			}, [emissiveRow.value.getHexValue(), faceMaterialIndex]);
		}

		// injectFunction
		if( material.specular !== undefined ){
			injectFunction(function(object3d, colorHexValue, faceMaterialIndex){
				var material = faceMaterialIndex === -1 ? object3d.material : object3d.material.materials[faceMaterialIndex]
				material.specular.set(colorHexValue)
			}, [specularRow.value.getHexValue(), faceMaterialIndex]);
		}

		
		if( material.shininess !== undefined ) injectProperty(propertyPrefix+'.shininess', shininessRow.getValue())
		if( material.wireframe !== undefined ) injectProperty(propertyPrefix+'.wireframe', wireframeRow.getValue())
		if( material.wireframeLinewidth !== undefined ) injectProperty(propertyPrefix+'.wireframeLinewidth', wireframeLinewidthRow.getValue())
		if( material.opacity !== undefined ) injectProperty(propertyPrefix+'.opacity', opacityRow.getValue())
		if( material.transparent !== undefined ) injectProperty(propertyPrefix+'.transparent', transparentRow.getValue())
		if( material.side !== undefined ) injectProperty(propertyPrefix+'.side', parseInt(sideRow.getValue(),10))
		if( material.shading !== undefined ) injectProperty(propertyPrefix+'.shading', parseInt(shadingRow.getValue(),10))
		if( material.blending !== undefined ) injectProperty(propertyPrefix+'.blending', parseInt(blendingRow.getValue(),10))

		if( material.linewidth !== undefined ) injectProperty(propertyPrefix+'.linewidth', linewidthRow.getValue())
		if( material.dashSize !== undefined ) injectProperty(propertyPrefix+'.dashSize', dashSizeRow.getValue())

		if( material.visible !== undefined ) injectProperty(propertyPrefix+'.visible', visibleRow.getValue())
		if( material.depthTest !== undefined ) injectProperty(propertyPrefix+'.depthTest', depthTestRow.getValue())
		if( material.depthWrite !== undefined ) injectProperty(propertyPrefix+'.depthWrite', depthWriteRow.getValue())
		if( material.alphaTest !== undefined ) injectProperty(propertyPrefix+'.alphaTest', alphaTestRow.getValue())
		
		injectProperty(propertyPrefix+'.needsUpdate', true)
	}

	//////////////////////////////////////////////////////////////////////////////////
	//		updateUI()
	//////////////////////////////////////////////////////////////////////////////////
	var subFaceMaterialPanels	= []
	container.updateUI	= updateUI
	function updateUI() {
		var material = faceMaterialIndex === -1 ? editor.selected.material : editor.selected.material.materials[faceMaterialIndex]

		materialSelectRow.value.setValue( material.sniffType )

		uuidRow.updateUI( material.uuid )
		nameRow.updateUI( material.name )

		colorRow.updateUI( material.color )
		emissiveRow.updateUI( material.emissive )
		specularRow.updateUI( material.specular )

		shininessRow.updateUI( material.shininess )
		wireframeRow.updateUI( material.wireframe )
		wireframeLinewidthRow.updateUI( material.wireframeLinewidth )

		opacityRow.updateUI( material.opacity )
		transparentRow.updateUI( material.transparent )

		sideRow.updateUI( material.side )
		shadingRow.updateUI( material.shading )
		blendingRow.updateUI( material.blending )

		linewidthRow.updateUI(material.linewidth)
		dashSizeRow.updateUI(material.dashSize)

		visibleRow.updateUI(material.visible)
		depthTestRow.updateUI(material.depthTest)
		depthWriteRow.updateUI(material.depthWrite)
		alphaTestRow.updateUI(material.alphaTest)

		mapRow.updateUI(material.map)
		bumpMapRow.updateUI(material.bumpMap)

		//////////////////////////////////////////////////////////////////////////////////
		//		MeshFaceMaterial
		//////////////////////////////////////////////////////////////////////////////////

		/**
		 * here init as many sub PanelMaterial as found in material.materials
		 */
		if( material.sniffType === 'MeshFaceMaterial' && material.materials.length !== subFaceMaterialPanels.length ){
			subFaceMaterialPanels.forEach(function(subFaceMaterialPanel){
				container.remove(subFaceMaterialPanel)
			})
			subFaceMaterialPanels	= []
			for(var i = 0; i < material.materials.length; i++){
				var subFaceMaterialPanel = new PanelMaterial(i)
				subFaceMaterialPanels.push(subFaceMaterialPanel)
				container.add(subFaceMaterialPanel)
			}
		}
		
		// update each subFaceMaterialPanels IF this material is a 'MeshFaceMaterial'
		if( material.sniffType === 'MeshFaceMaterial' ){
			subFaceMaterialPanels.forEach(function(subFaceMaterialPanel){
				subFaceMaterialPanel.updateUI()
			})	
		}
		
		// display subFaceMaterialPanels or not
		subFaceMaterialPanels.forEach(function(subFaceMaterialPanel){
			subFaceMaterialPanel.setDisplay(material.sniffType === 'MeshFaceMaterial'  ? 'inherit' : 'none')
		})

		//////////////////////////////////////////////////////////////////////////////////
		//		subPanel
		//////////////////////////////////////////////////////////////////////////////////
		// remove subMaterialPanel if it exists
		if( subMaterialPanel !== null ){
			container.remove(subMaterialPanel)
			subMaterialPanel = null
		}
		
		// create suitable subMaterialPanel
		if( material.sniffType === 'ShaderMaterial'){
			subMaterialPanel = new PanelMaterialShader(faceMaterialIndex);
			subMaterialPanel.setPadding('0px')
			container.add( subMaterialPanel );		
		}

	}

	return container
};
