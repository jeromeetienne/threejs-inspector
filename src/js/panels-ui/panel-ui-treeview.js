/**
 * Handle panel for object3d
 *
 * @constructor
 */
var PanelTreeView	= function(){
	
	var signals	= editor.signals
	// var container	= new UI.Panel()
	
	var container	= UI.CollapsiblePanelHelper.createContainer('Browser', 'leftSidebarSceneBrowser', false)
	
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
	container.dom.appendChild( document.createElement('br') )

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
				console.log('three.js inpector: Object3D exported as $object3d')
			})
			return
		}else{
			console.assert(false)
		}

		updateWhole()
	}	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////

	// create TreeView
	var treeView = new TreeView( container.dom );
	treeView.onSelect = function( object3dUuid ) {
		if( object3dUuid === null )	treeView.clearActive()
		InspectDevTools.plainFunction(function(uuid){
			Inspect3js.UISelect( uuid )
		}, [object3dUuid])
	}
	treeView.onToggleVisibility = function(object3dUuid){
		InspectDevTools.plainFunction(function(uuid){
			var object = Inspect3js.getObjectByUuid(uuid)
			object.visible = object.visible === true ? false : true
		}, [object3dUuid])
	}
	treeView.onExport = function(object3dUuid){
		InspectDevTools.plainFunction(function(uuid){
			var object = Inspect3js.getObjectByUuid(uuid)
			window.$object3d = object
			console.log('three.js inpector: Object3D exported as $object3d')
		}, [object3dUuid])
	}
	
	
	threeViewItem = new TreeViewItem( 'Renderer', null );
	treeView.getRoot().appendChild( threeViewItem );


	return container
};
