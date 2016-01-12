/**
 * Handle panel for object3d
 *
 * @constructor
 */
var PanelObject3D	= function(){
	
	var signals	= editor.signals
	
	var container	= UI.CollapsiblePanelHelper.createContainer('OBJECT3D', 'sidebarObject3d', false)
	container.setDisplay( 'none' );

	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
	editor.signals.objectSelected.add(function( object3d ){
		if( object3d !== null ){
			container.setDisplay( 'inherit' );
			updateUI(object3d)
		}else{
			container.setDisplay( 'none' );
		}
	})
	

	//////////////////////////////////////////////////////////////////////////////////
	//		popupMenu
	//////////////////////////////////////////////////////////////////////////////////
	var popupMenu	= UI.PopupMenuHelper.createSelect({
		''			: '--- Options ---',
		'doResetAll'		: 'Reset All',
		'doResetPosition'	: 'Reset Position',
		'doResetRotation'	: 'Reset Rotation',
		'doResetScale'		: 'Reset Scale',
		'exportInConsole'	: 'Export in Console',
	}, onPopupMenuChange)
	container.titleElement.add(popupMenu)
	// container.add(popupMenu)
	
	function onPopupMenuChange(value){
		if( value === 'doResetAll' ){
			positionRow.updateUI({x:0, y:0, z:0})
			rotationRow.updateUI({x:0, y:0, z:0})
			scaleRow.updateUI({x:1, y:1, z:1})
		}else if( value === 'doResetPosition' ){
			positionRow.updateUI({x:0, y:0, z:0})
		}else if( value === 'doResetRotation' ){
			rotationRow.updateUI({x:0, y:0, z:0})
		}else if( value === 'doResetScale' ){
			scaleRow.updateUI({x:1, y:1, z:1})
		}else if( value === 'exportInConsole' ){
			InspectDevTools.functionOnObject3d(function(object3d){
				window.$object3d = object3d
				console.log('three.js inspector: Object3D exported as $object3d')
				console.dir($object3d)
			})
			return
		}else{
			console.assert(false)
		}

		updateWhole()
	}
	//////////////////////////////////////////////////////////////////////////////////
	//		handle tab-object3d
	//////////////////////////////////////////////////////////////////////////////////

	var titleRow = new UI.TextRow()
	titleRow.setLabel('Title')
	container.add( titleRow );
	
	
	//////////////////////////////////////////////////////////////////////////////////
	//		handle help
	//////////////////////////////////////////////////////////////////////////////////
	
	;(function(){
		var helpButton = new UI.FontAwesomeIcon().setTitle('Open three.js documentation')
		helpButton.dom.classList.add('fa-info-circle')
		helpButton.setPosition( 'absolute' ).setLeft( '75px' )
		titleRow.add(helpButton)
		helpButton.onClick(function(){
			console.log('help button clicked', editor.selected.sniffType)
			// var url = 'http://threejs.org/docs/#Reference/Objects/Mesh'
			var url = typeToUrl(editor.selected.sniffType)
			InspectDevTools.plainFunction(function(url){
				var win = window.open(url, '_blank');
			}, [url]);
			
			return
			
			function typeToUrl(sniffType){
				if( sniffType.match(/Light$/) !== null ){
					var url = 'http://threejs.org/docs/#Reference/Lights/'+sniffType
				}else if( sniffType.match(/Camera$/) !== null ){
					var url = 'http://threejs.org/docs/#Reference/Cameras/'+sniffType
				}else if( sniffType === 'Scene' ){
					var url = 'http://threejs.org/docs/#Reference/Scenes/Scene'
				}else if( sniffType === 'Object3D' ){
					var url = 'http://threejs.org/docs/#Reference/Core/Object3D'
				}else{
					var url = 'http://threejs.org/docs/#Reference/Objects/'+sniffType
				}
				return url
			}
		})
	})()
	
	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////

	var uuidRow	= new UI.InputRow()
	uuidRow.setLabel('Uuid').onChange(updateWhole)
	container.add( uuidRow );

	var nameRow	= new UI.InputRow()
	nameRow.setLabel('Name').onChange(updateWhole)
	container.add( nameRow );

	var positionRow	= new UI.Vector3Row()
	positionRow.setLabel('Position').onChange(updateWhole)
	container.add( positionRow );

	var rotationRow	= new UI.Vector3Row()
	rotationRow.setLabel('Rotation').onChange(updateWhole)
	container.add( rotationRow );

	var scaleRow	= new UI.LockableVector3Row()
	scaleRow.setLabel('Scale').onChange(updateWhole)
	container.add( scaleRow );
	scaleRow.setLocked(true)
	scaleRow.valueX.setRange(0.001, Infinity).setPrecision(2)
	scaleRow.valueY.setRange(0.001, Infinity).setPrecision(2)
	scaleRow.valueZ.setRange(0.001, Infinity).setPrecision(2)

	var visibleRow	= new UI.CheckboxRow()
	visibleRow.setLabel('Visible').onChange(updateWhole)
	container.add( visibleRow );

	var castShadowRow	= new UI.CheckboxRow()
	castShadowRow.setLabel('Cast Shadow').onChange(updateWhole)
	container.add( castShadowRow );

	var receiveShadowRow	= new UI.CheckboxRow()
	receiveShadowRow.setLabel('Recv Shadow').onChange(function(){
		var injectFunction = InspectDevTools.functionOnObject3d

		updateWhole()

		injectFunction(function(object3d){
			object3d.material.needsUpdate	= true;
		});	
	})
	container.add( receiveShadowRow );
		
	//////////////////////////////////////////////////////////////////////////////////
	//		Lights
	//////////////////////////////////////////////////////////////////////////////////
	var colorRow	= new UI.ColorRow()
	colorRow.setLabel('Color').onChange(updateWhole)
	container.add( colorRow );

	var groundColorRow	= new UI.ColorRow()
	groundColorRow.setLabel('Ground Color').onChange(updateWhole)
	container.add( groundColorRow );

	var intensityRow	= new UI.NumberRow()
	intensityRow.setLabel('Intensity').onChange(updateWhole)
	container.add( intensityRow );

	var distanceRow	= new UI.NumberRow()
	distanceRow.setLabel('Distance').onChange(updateWhole)
	container.add( distanceRow );
	
	var angleRow	= new UI.NumberRow()
	angleRow.setLabel('Angle').onChange(updateWhole)
	container.add( angleRow );

	var exponentRow	= new UI.NumberRow()
	exponentRow.setLabel('Exponent').onChange(updateWhole)
	container.add( exponentRow );

	//////////////////////////////////////////////////////////////////////////////////
	//		Camera
	//////////////////////////////////////////////////////////////////////////////////
	var fovRow	= new UI.NumberRow()
	fovRow.setLabel('Fov').onChange(updateWhole)
	container.add( fovRow );

	var nearRow	= new UI.NumberRow()
	nearRow.setLabel('Near').onChange(updateWhole)
	container.add( nearRow );

	var farRow	= new UI.NumberRow()
	farRow.setLabel('far').onChange(updateWhole)
	container.add( farRow );

	var leftRow	= new UI.NumberRow()
	leftRow.setLabel('left').onChange(updateWhole)
	container.add( leftRow );

	var rightRow	= new UI.NumberRow()
	rightRow.setLabel('right').onChange(updateWhole)
	container.add( rightRow );

	var topRow	= new UI.NumberRow()
	topRow.setLabel('top').onChange(updateWhole)
	container.add( topRow );

	var bottomRow	= new UI.NumberRow()
	bottomRow.setLabel('bottom').onChange(updateWhole)
	container.add( bottomRow );

	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
	function updateWhole(){
		var selected	= editor.selected
		var injectProperty = InspectDevTools.propertyOnObject3d;
		var injectFunction = InspectDevTools.functionOnObject3d
		
		injectProperty('uuid', uuidRow.getValue())
		injectProperty('name', nameRow.getValue())

		injectProperty('position.x', positionRow.valueX.getValue())
		injectProperty('position.y', positionRow.valueY.getValue())
		injectProperty('position.z', positionRow.valueZ.getValue())

		injectProperty('rotation.x', rotationRow.valueX.getValue())
		injectProperty('rotation.y', rotationRow.valueY.getValue())
		injectProperty('rotation.z', rotationRow.valueZ.getValue())

		scaleRow.update(selected.scale)
		injectProperty('scale.x', selected.scale.x)
		injectProperty('scale.y', selected.scale.y)
		injectProperty('scale.z', selected.scale.z)

		injectProperty('visible', visibleRow.getValue())

		injectProperty('castShadow', castShadowRow.getValue())
		injectProperty('receiveShadow', receiveShadowRow.getValue())

		if( selected.fov !== undefined )	injectProperty('fov', fovRow.getValue())		
		if( selected.near !== undefined )	injectProperty('near', nearRow.getValue())		
		if( selected.far !== undefined )	injectProperty('far', farRow.getValue())
		if( selected.left !== undefined )	injectProperty('left', farRow.getValue())
		if( selected.right !== undefined )	injectProperty('right', farRow.getValue())
		if( selected.top !== undefined )	injectProperty('top', farRow.getValue())
		if( selected.bottom !== undefined )	injectProperty('bottom', farRow.getValue())

		var isCamera	= selected.near !== undefined ? true : false
		if( isCamera ){
			injectFunction(function(object3d){
				console.assert(object3d instanceof THREE.Camera)
				object3d.updateProjectionMatrix()				
			});
		}

		if( selected.color !== undefined ){
			// injectFunction
			injectFunction(function(object3d, colorHexValue){
				object3d.color.set(colorHexValue)
			}, [colorRow.getHexValue()]);			
		}
		if( selected.groundColor !== undefined ){
			// injectFunction
			injectFunction(function(object3d, colorHexValue){
				object3d.groundColor.set(colorHexValue)
			}, [groundColorRow.getHexValue()]);			
		}
		if( selected.intensity !== undefined )	injectProperty('intensity', intensityRow.getValue())
		if( selected.distance !== undefined )	injectProperty('distance', distanceRow.getValue())
		if( selected.angle !== undefined )	injectProperty('angle', angleRow.getValue())
		if( selected.exponent !== undefined )	injectProperty('exponent', intensityRow.getValue())

		
	}
		
	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////

	function updateUI(object3d) {
		container.setTitle( object3d.sniffType.toUpperCase() );
		
		titleRow.updateUI(object3d.sniffType)
		uuidRow.updateUI(object3d.uuid)
		nameRow.updateUI(object3d.name)
		positionRow.updateUI(object3d.position)
		rotationRow.updateUI(object3d.rotation)
		scaleRow.updateUI(object3d.scale)
		visibleRow.updateUI(object3d.visible)
		castShadowRow.updateUI(object3d.castShadow)
		receiveShadowRow.updateUI(object3d.receiveShadow)
		
		// handle camera
		fovRow.updateUI(object3d.fov)
		nearRow.updateUI(object3d.near)
		farRow.updateUI(object3d.far)
		leftRow.updateUI(object3d.left)
		rightRow.updateUI(object3d.right)
		topRow.updateUI(object3d.top)
		bottomRow.updateUI(object3d.bottom)

		// handle lights
		colorRow.updateUI( object3d.color )
		groundColorRow.updateUI( object3d.groundColor )
		intensityRow.updateUI( object3d.intensity )
		distanceRow.updateUI( object3d.distance )
		angleRow.updateUI( object3d.angle )
		exponentRow.updateUI( object3d.exponent )
	}

	return container
};
