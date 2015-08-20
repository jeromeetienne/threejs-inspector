/**
 * Handle panel for object3d
 *
 * @constructor
 */
var PanelMaterialShader	= function(faceMaterialIndex){
	
	var signals	= editor.signals

	var container	= new UI.Panel()

	//////////////////////////////////////////////////////////////////////////////////
	//		handle tab-geometry
	//////////////////////////////////////////////////////////////////////////////////

	container.add( new UI.HorizontalRule() )

	var typeRow = new UI.TextRow()
	typeRow.setLabel('Uniforms')
	container.add( typeRow );

	//////////////////////////////////////////////////////////////////////////////////
	//		popupMenu
	//////////////////////////////////////////////////////////////////////////////////
	var popupMenu	= UI.PopupMenuHelper.createSelect({
		''			: '--- Options ---',
		'viewVertexShader'	: 'View vertexShader',
		'viewFragmentShader'	: 'View fragmentShader',
	}, onPopupMenuChange)
	typeRow.add(popupMenu)
	
	function onPopupMenuChange(value){
		var material = faceMaterialIndex === -1 ? editor.selected.material : editor.selected.material.materials[faceMaterialIndex]
		var injectFunction = InspectDevTools.functionOnObject3d


		if( value === 'viewVertexShader' ){
			injectFunction(function(object3d, vertexShader){
				// console.log('View Vertex Shader')
				// console.log(vertexShader)

				var blob = new Blob( [ vertexShader ], { type: 'text/plain' } );
				var objectURL = URL.createObjectURL( blob );
				window.open( objectURL, '_blank' );
				window.focus();
			}, [material.vertexShader]);		
		}else if( value === 'viewFragmentShader' ){
			injectFunction(function(object3d, fragmentShader){
				// console.log('View Fragment Shader')
				// console.log(fragmentShader)

				var blob = new Blob( [ fragmentShader ], { type: 'text/plain' } );
				var objectURL = URL.createObjectURL( blob );
				window.open( objectURL, '_blank' );
				window.focus();
			}, [material.fragmentShader]);
		}else{
			console.assert(false)
		}

		updateWhole()
	}
	
	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////

	function updateUI(faceMaterialIndex) {
		var material = faceMaterialIndex === -1 ? editor.selected.material : editor.selected.material.materials[faceMaterialIndex]
		var propertyPrefix = faceMaterialIndex === -1 ? 'material' : 'material.materials['+faceMaterialIndex+']'

		var injectProperty = InspectDevTools.propertyOnObject3d;
		var injectFunction = InspectDevTools.functionOnObject3d

		// typeRow.updateUI( 'Uniforms' )

		console.assert(material.fragmentShader)
		console.assert(material.vertexShader)
		
		//////////////////////////////////////////////////////////////////////////////////
		//		Create one row per uniforms
		//////////////////////////////////////////////////////////////////////////////////
		if( material.uniforms !== undefined ){
			Object.keys( material.uniforms ).forEach(function(name){
				var data = material.uniforms[name]
				console.log('materialShader', faceMaterialIndex)
				console.dir(data)
				if( data.type === 'f' ){
					var numberRow = new UI.NumberRow()
					numberRow.setLabel(name).setValue(data.value)
					container.add( numberRow );
					numberRow.onChange(function(){
						injectProperty(propertyPrefix+'.uniforms.'+name+'.value', numberRow.getValue())
					})
				}else if( data.type === 'i' ){
					var numberRow = new UI.NumberRow()
					numberRow.value.setPrecision(0)
					numberRow.setLabel(name).setValue(data.value)
					container.add( numberRow );
					numberRow.onChange(function(){
						injectProperty(propertyPrefix+'.uniforms.'+name+'.value', numberRow.getValue())
					})
				}else if( data.type === 'v2' ){
					var vector2Row = new UI.Vector2Row()
					vector2Row.setLabel(name).updateUI(data.value)
					container.add( vector2Row );				
					vector2Row.onChange(function(){
						injectProperty(propertyPrefix+'.uniforms.'+name+'.value.x', vector2Row.valueX.getValue())
						injectProperty(propertyPrefix+'.uniforms.'+name+'.value.y', vector2Row.valueY.getValue())
					})
				}else if( data.type === 'v3' ){
					var vector3Row = new UI.Vector3Row()
					vector3Row.setLabel(name).updateUI(data.value)
					container.add( vector3Row );				
					vector3Row.onChange(function(){
						injectProperty(propertyPrefix+'.uniforms.'+name+'.value.x', vector3Row.valueX.getValue())
						injectProperty(propertyPrefix+'.uniforms.'+name+'.value.y', vector3Row.valueY.getValue())
						injectProperty(propertyPrefix+'.uniforms.'+name+'.value.z', vector3Row.valueZ.getValue())
					})
				}else if( data.type === 'c' ){
					var colorRow = new UI.ColorRow()
					colorRow.setLabel(name).updateUI(data.value)
					container.add( colorRow )
					colorRow.onChange(function(){
						injectFunction(function(object3d, colorHexValue, uniformName, faceMaterialIndex){
							var material = faceMaterialIndex === -1 ? object3d.material : object3d.material.materials[faceMaterialIndex]
							material.uniforms[uniformName].value.set(colorHexValue)
						}, [colorRow.value.getHexValue(), name, faceMaterialIndex]);
					})
				}else if( data.type === 't' ){
					var mapRow = new PanelTexture(propertyPrefix+'.uniforms.'+name)
					mapRow.textureRow.setLabel(name)
					container.add( mapRow );
					mapRow.updateUI(data.value)
				}else {
					console.log('unhandled uniforms type', data.type)
				}
			})
		}
	}
	
	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////

	updateUI(faceMaterialIndex)

	return container
};
