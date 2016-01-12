/**
 * Handle panel for object3d
 *
 * @constructor
 */
var PanelTreeView	= function(){

	var container	= UI.CollapsiblePanelHelper.createContainer('BROWSER', 'leftSidebarSceneBrowser', false)


	//////////////////////////////////////////////////////////////////////////////////
	//		popupMenu
	//////////////////////////////////////////////////////////////////////////////////
	
	var popupMenu	= UI.PopupMenuHelper.createSelect({
		''			: '--- Options ---',
		'collapseAll'		: 'Collapse All',
		'expandAll'		: 'Expand All',
		'captureScene'		: 'Capture Scene',
	}, onPopupMenuChange)
	container.titleElement.add(popupMenu)
	container.dom.appendChild( document.createElement('br') )

	function onPopupMenuChange(value){
		if( value === 'collapseAll' ){
			treeView.getRoot().children.forEach(function(child){
				child.collapseAll()
			})
		}else if( value === 'expandAll' ){
			treeView.getRoot().children.forEach(function(child){
				child.expandAll()
			})
		}else if( value === 'captureScene' ){
		        console.log('in panel-ui-treeview.js: detecting click on a button capture_scene')
		        
		        function jsCode(){
		                InspectedWin3js.captureScene(scene)
		        }

		        chrome.devtools.inspectedWindow.eval('('+injected_script.toString()+')();');
		        chrome.devtools.inspectedWindow.eval('('+jsCode.toString()+')();');
			
		}else{
			console.assert(false)
		}
	}

	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////

container.content.appendChild( document.createElement('br') )

	// create TreeView
	var treeView = new TreeView( container.content );
	treeView.onSelect = function( object3dUuid ){
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
			console.log('three.js inspector: Object3D exported as $object3d')
			console.dir($object3d)
		}, [object3dUuid])
	}
	
	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
	var treeViewObjects     = {}

	PanelWin3js.editor.signals.updateObject3DTreeView.add(function(dataJSON){
		//////////////////////////////////////////////////////////////////////////////////
		//                Comments
		//////////////////////////////////////////////////////////////////////////////////
		var uuid = dataJSON.uuid
		var parentUuid = dataJSON.parentUuid

		// create treeViewObjects[] object if needed
		if( treeViewObjects[ dataJSON.uuid ] === undefined ){
		        console.log('in panel-ui-treeview.js: create a treeviewItem')
			// create the dom element
			// var viewItem = new TreeViewItem( dataJSON.name, dataJSON.uuid );
		console.log('in panel-ui-treeview.js: 1')
			treeViewObjects[ dataJSON.uuid ] = {
				uuid : dataJSON.uuid,
				parentUuid : dataJSON.parentUuid,
				data : {
					className : dataJSON.className,
					viewItem : new TreeViewItem( dataJSON.name, dataJSON.uuid )
				}
			}
		console.log('in panel-ui-treeview.js: 1.5')
		}

		console.log('in panel-ui-treeview.js: 2')


		var treeViewObject = treeViewObjects[ uuid ]
		console.log('in panel-ui-treeview.js: 3')
		console.assert( treeViewObject !== undefined )
		console.log('in panel-ui-treeview.js: 4')

		if( parentUuid ) {
		        console.log('in panel-ui-treeview.js: appendChild treeviewItem to parent', dataJSON.parentUuid)
			// add current object to the proper parent
			treeViewObjects[ parentUuid ].data.viewItem.appendChild( treeViewObject.data.viewItem );
			treeViewObject.parent = parentUuid;
		} else {
		        console.log('in panel-ui-treeview.js: appendChild treeviewItem to root')
			// if this object got no parent, add it at the root
			// if( !object.data.viewItem.parentItem ){
				treeView.getRoot().appendChild( treeViewObject.data.viewItem );
			// }
		}
		
	})

	return container
};
