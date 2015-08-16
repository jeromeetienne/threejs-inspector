/**
 * Handle panel for object3d
 *
 * @constructor
 */
var PanelTreeView	= function(){
	
	var signals	= editor.signals
	// var container	= new UI.Panel()
	
	var container	= UI.CollapsiblePanelHelper.createContainer('BROWSER', 'leftSidebarSceneBrowser', false)


	//////////////////////////////////////////////////////////////////////////////////
	//		popupMenu
	//////////////////////////////////////////////////////////////////////////////////
	
	var popupMenu	= UI.PopupMenuHelper.createSelect({
		''			: '--- Options ---',
		'collapseAll'		: 'Collapse All',
		'expandAll'		: 'Expand All',
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
		}else{
			console.assert(false)
		}
	}

	//////////////////////////////////////////////////////////////////////////////////
	//		tiltButton
	//////////////////////////////////////////////////////////////////////////////////
	var tiltButton	= new UI.FontAwesomeIcon()
	tiltButton.setTitle('Medkit to repair three.js inspector. push it in case of panic :)')
	tiltButton.dom.classList.add('fa-bolt')
	tiltButton.dom.style.cssFloat = 'right'
	tiltButton.onClick(function(){
		InspectDevTools.plainFunction(function(){
			Inspect3js.injectInThreejs()
			Inspect3js.purgeObsoleteObjects()
			console.log('Tried to tilt three.js inspector in this page. I hope it works better...')
		})		
	})
	container.titleElement.add(tiltButton)

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
