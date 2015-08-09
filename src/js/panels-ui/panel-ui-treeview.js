/**
 * Handle panel for object3d
 *
 * @constructor
 */
var PanelTreeView	= function(){
	
	var signals	= editor.signals
	var container	= new UI.Panel()

	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////

	// create TreeView
	var treeView = new TreeView( container.dom );
	treeView.onSelect = function( object3dUuid ) {
		if( object3dUuid === null )	treeView.clearActive()
		// console.log( 'SELECTED', object3dUuid );
		InspectDevTools.plainFunction(function(uuid){
			injected3jsInspect.UISelect( uuid )
		}, [object3dUuid])
	}
	treeView.onToggleVisibility = function(object3dUuid){
		console.log('onToggleVisibility')
		InspectDevTools.plainFunction(function(uuid){
			var object = injected3jsInspect.getObjectByUuid(uuid)
			object.visible = object.visible === true ? false : true
		}, [object3dUuid])
	}
	treeView.onExport = function(object3dUuid){
		console.log('onExport')
		InspectDevTools.plainFunction(function(uuid){
			var object = injected3jsInspect.getObjectByUuid(uuid)
			window.$object3d = object
			console.log('three.js inpector: Object3D exported as $object3d')
		}, [object3dUuid])
	}
	
	
	threeViewItem = new TreeViewItem( 'Renderer', null );
	treeView.getRoot().appendChild( threeViewItem );


	return container
};
