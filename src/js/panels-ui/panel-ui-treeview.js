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
		'collapseAll'		: 'Collapse All',
		'expandAll'		: 'Expand All',
		'injectInThreejs'	: 'InjectInThreejs',
	}, onPopupMenuChange)
	container.titleElement.add(popupMenu)
	container.dom.appendChild( document.createElement('br') )

	function onPopupMenuChange(value){
		if( value === 'collapseAll' ){
			threeViewItem.children.forEach(function(child){
				child.collapseAll()
			})
		}else if( value === 'expandAll' ){
			threeViewItem.children.forEach(function(child){
				child.expandAll()
			})
		}else if( value === 'injectInThreejs' ){
			InspectDevTools.plainFunction(function(){
				Inspect3js.injectInThreejs()
			})
		}else{
			console.assert(false)
		}
	}

	//////////////////////////////////////////////////////////////////////////////////
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
