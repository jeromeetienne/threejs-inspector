var PanelWin3js	= PanelWin3js	|| {}

/**
 * Handle panel for object3d
 *
 * @constructor
 */
PanelWin3js.PanelGeometry	= function(){
	var editor	= PanelWin3js.editor
	var signals	= editor.signals
	var subGeometryPanel = null;
	
	var container	= new UI.Panel()
	container.setDisplay( 'none' );

	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
	editor.signals.object3dSelected.add(function( object3dJson ){
		if( object3dJson === null || object3dJson.geometry === undefined ){
			container.setDisplay( 'none' );
			return
		}

		container.setDisplay( 'inherit' );
		updateUI(object3dJson)
	})

	//////////////////////////////////////////////////////////////////////////////////
	//		handle tab-geometry
	//////////////////////////////////////////////////////////////////////////////////

	var typeRow = new UI.TextRow()
	typeRow.setLabel('Type')
	container.add( typeRow );
	
	//////////////////////////////////////////////////////////////////////////////////
	//		popupMenu
	//////////////////////////////////////////////////////////////////////////////////
	var popupMenu	= UI.PopupMenuHelper.createSelect({
		''			: '--- Options ---',
		'viewVertices'		: 'View Vertices',
		'viewFaces'		: 'View Faces',
		'exportInConsole'	: 'Export in Console',
	}, onPopupMenuChange)
	typeRow.add(popupMenu)
	
	function onPopupMenuChange(value){
		var injectFunction = PanelWin3js.functionOnObject3d
		var geometry	= editor.selected.geometry
		
		if( value === 'viewVertices' ){
			injectFunction(function(object3d){
				console.log('Geometry Vertices')
				console.table(object3d.geometry.vertices)
			});		
		}else if( value === 'viewFaces' ){
			injectFunction(function(object3d){
				console.log('Geometry Faces')
				console.table(object3d.geometry.faces)
			});		
		}else if( value === 'exportInConsole' ){
			injectFunction(function(object3d){
				window.$geometry = object3d.geometry
				console.log('three.js inspector: Geometry exported as $geometry')
				console.dir($geometry)
			})
			return
		}else{
			console.assert(false)
		}

		updateWhole()
	}

	//////////////////////////////////////////////////////////////////////////////////
	//		handle help
	//////////////////////////////////////////////////////////////////////////////////
	
	;(function(){
		var helpButton = new UI.FontAwesomeIcon().setTitle('Open three.js documentation')
		helpButton.dom.classList.add('fa-info-circle')
		helpButton.setPosition( 'absolute' ).setLeft( '75px' )
		typeRow.add(helpButton)
		helpButton.onClick(function(){
			console.log('help button clicked', editor.selected.geometry.className)
			// var url = 'http://threejs.org/docs/#Reference/Objects/Mesh'
			var url = typeToUrl(editor.selected.geometry.className)
			PanelWin3js.plainFunction(function(url){
				var win = window.open(url, '_blank');
			}, [url]);
			
			return
			
			function typeToUrl(className){
				if( className === 'Geometry' || className === 'BufferGeometry' ){
					var url = 'http://threejs.org/docs/#Reference/Core/'+className
				}else{
					var url = 'http://threejs.org/docs/#Reference/Extras.Geometries/'+className
				}
				return url
			}
		})
	})()

	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
	
	var uuidRow	= new UI.InputRow()
	uuidRow.setLabel('uuid').onChange(updateWhole)
	container.add( uuidRow );

	var nameRow	= new UI.InputRow()
	nameRow.setLabel('Name').onChange(updateWhole)
	container.add( nameRow );

	var verticesRow = new UI.TextRow()
	verticesRow.setLabel('Vertices').setTitle('Number of vertices')
	container.add( verticesRow );

	var facesRow = new UI.TextRow()
	facesRow.setLabel('Faces').setTitle('Number of faces')
	container.add( facesRow );

	var boundingSphereCenterRow = new UI.Vector3Row()
	boundingSphereCenterRow.setLabel('Bsphere center').setTitle('Center of the bounding sphere')
	container.add( boundingSphereCenterRow );
	boundingSphereCenterRow.valueX.setDisabled(true)
	boundingSphereCenterRow.valueY.setDisabled(true)
	boundingSphereCenterRow.valueZ.setDisabled(true)

	var boundingSphereRadiusRow = new UI.NumberRow()
	boundingSphereRadiusRow.setLabel('Bsphere radius').setTitle('Radius of the bounding sphere')
	container.add( boundingSphereRadiusRow );
	boundingSphereRadiusRow.value.setDisabled(true)


	var positionLengthRow = new UI.TextRow()
	positionLengthRow.setLabel('Positions').setTitle('Length of position attribute')
	container.add( positionLengthRow );

	var normalLengthRow = new UI.TextRow()
	normalLengthRow.setLabel('normal').setTitle('Length of normal attribute')
	container.add( normalLengthRow );
	
	var colorLengthRow = new UI.TextRow()
	colorLengthRow.setLabel('color').setTitle('Length of color attribute')
	container.add( colorLengthRow );
	
	var tangentLengthRow = new UI.TextRow()
	tangentLengthRow.setLabel('tangent').setTitle('Length of tangent attribute')
	container.add( tangentLengthRow );
	
	var indexLengthRow = new UI.TextRow()
	indexLengthRow.setLabel('index').setTitle('Length of index attribute')
	container.add( indexLengthRow );
	

	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
	function updateWhole(){
		var injectProperty = PanelWin3js.propertyOnObject3d;
		var injectFunction = PanelWin3js.functionOnObject3d

		injectProperty('geometry.uuid', uuidRow.getValue())
		injectProperty('geometry.name', nameRow.getValue())
	}
		
	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////

	function updateUI(object3d) {
		var geometry = object3d.geometry
		
		typeRow.updateUI( geometry.className )

		uuidRow.updateUI(geometry.uuid)
		nameRow.updateUI(geometry.name)

		verticesRow.updateUI(geometry.verticesLength)		
		facesRow.updateUI(geometry.facesLength)

		positionLengthRow.updateUI(geometry.positionLength)
		normalLengthRow.updateUI(geometry.normalLength)
		colorLengthRow.updateUI(geometry.colorLength)
		tangentLengthRow.updateUI(geometry.tangentLength)
		indexLengthRow.updateUI(geometry.indexLength)
		
		if( geometry.boundingSphere ){
			boundingSphereCenterRow.updateUI(geometry.boundingSphere.center)
			boundingSphereRadiusRow.updateUI(geometry.boundingSphere.radius)
		}else{
			boundingSphereCenterRow.setDisplay('none')
			boundingSphereRadiusRow.setDisplay('none')
		}

		//////////////////////////////////////////////////////////////////////////////////
		//		subGeometryPanel
		//////////////////////////////////////////////////////////////////////////////////

		// remove subGeometryPanel if it exists
		if( subGeometryPanel !== null ){
			container.remove(subGeometryPanel)
			subGeometryPanel = null
		}
		
		// create suitable subGeometryPanel
		if( geometry.className === 'TorusKnotGeometry'){
			console.log('in panel-ui-geometry.js: create PanelWin3js.PanelGeometryTorusKnot for', object3d)
			subGeometryPanel = new PanelWin3js.PanelGeometryTorusKnot(object3d);
			subGeometryPanel.setPadding('0px')
			container.add( subGeometryPanel );		
		}else if( geometry.className === 'SphereGeometry'){
			console.log('in panel-ui-geometry.js: create PanelWin3js.PanelGeometrySphere for', object3d)
			subGeometryPanel = new PanelWin3js.PanelGeometrySphere(object3d);
			subGeometryPanel.setPadding('0px')
			container.add( subGeometryPanel );			
		}
	}

	return container
};
