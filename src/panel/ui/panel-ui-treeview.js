var PanelWin3js	= PanelWin3js	|| {}

//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////

/**
 * Handle panel for object3d
 *
 * @constructor
 */
PanelWin3js.PanelTreeView	= function(){

	// var container	= UI.CollapsiblePanelHelper.createContainer('BROWSER', 'leftSidebarSceneBrowser', false)
	var container	= new UI.Panel()

	container.dom.addEventListener('click', function(){
		treeView.clearActive()
		PanelWin3js.plainFunction(function(){
			console.log('in panel-ui-treeview.js: unselecting item')
			InspectedWin3js.selectUuid(null)
		})
		console.log('click on empty panel', arguments)
	})


	//////////////////////////////////////////////////////////////////////////////////
	//		popupMenu
	//////////////////////////////////////////////////////////////////////////////////
	
	var popupMenu	= UI.PopupMenuHelper.createSelect({
		''			: '--- Options ---',
		'collapseAll'		: 'Collapse All',
		'expandAll'		: 'Expand All',
	}, onPopupMenuChange)
	container.add(popupMenu)
	
	function onPopupMenuChange(value){
		if( value === 'collapseAll' ){
			treeView.getRoot().children.forEach(function(child){
				child.collapseAll()
			})
		}else if( value === 'expandAll' ){
			treeView.getRoot().children.forEach(function(child){
				child.expandAll()
			})
		}else{
			console.assert(false)
		}
	}

	//////////////////////////////////////////////////////////////////////////////////
	//		Display time since refresh
	//////////////////////////////////////////////////////////////////////////////////

	var dateRow	= new UI.Text()
	var lastClearedAt = Date.now()
	container.add(dateRow)
	dateRow.setTextContent('Never updated')
	function updateDateRow(){
		var ageSeconds = Math.floor( (Date.now() - lastClearedAt)/1000 )
		dateRow.setTextContent('Updated '+ageSeconds+' seconds ago')
	}
	// do the first init
	updateDateRow()
	// periodically update it
	setInterval(function(){
		updateDateRow()		
	}, 1000);

	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
	
	var noSceneContainer	= new UI.Panel()
	noSceneContainer.dom.style.textAlign = 'center';
	container.add(noSceneContainer)
	noSceneContainer.dom.style.display = 'none'
	
	var text	= new UI.Text().setColor( '#ccc' ).setValue('NO SCENE')
	text.dom.style.fontSize = '2em'
	text.dom.style.paddingTop = '1em'
	text.dom.style.width = '100%';
	noSceneContainer.add(text)
	
	PanelWin3js.editor.signals.capturedScene.add(function(){
		console.log('CAPTURED SCENE. nObjects', Object.keys(treeViewObjects).length)
		if( Object.keys(treeViewObjects).length === 0 ){
			noSceneContainer.dom.style.display = 'block'
		}else{
			noSceneContainer.dom.style.display = 'none'
		}
	})


	//////////////////////////////////////////////////////////////////////////////////
	//		Check that currently selected object is still in the new treeView
	//////////////////////////////////////////////////////////////////////////////////

	PanelWin3js.editor.signals.capturedScene.add(function(){
		var selected = PanelWin3js.editor.selected
		// if there is no selected object, return now
		if( selected === null )	return

		// if selected objects is in the treeView, select(itsUUID) else select(null)
		var uuidToSelect = treeViewObjects[selected.uuid] !== undefined ? selected.uuid : null
		PanelWin3js.plainFunction(function(uuid){
			InspectedWin3js.selectUuid(uuid)
		}, [uuidToSelect])
	})	
	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////

	container.dom.appendChild( document.createElement('br') )
	container.dom.appendChild( document.createElement('br') )

	// create TreeView
	var treeView = new TreeView( container.dom );

	//////////////////////////////////////////////////////////////////////////////
	//              Code Separator
	//////////////////////////////////////////////////////////////////////////////
	
	treeView.onSelect = function( object3dUuid ){
		PanelWin3js.plainFunction(function(uuid){
			console.log('trying to select object3d uuid', uuid)
			InspectedWin3js.selectUuid(uuid)
		}, [object3dUuid])
	}
	treeView.onToggleVisibility = function(object3dUuid){
		PanelWin3js.plainFunction(function(uuid){
			console.log('in panel-ui-treeview.js: toggle visibility in uuid', uuid)
			var object3d = InspectedWin3js.getObjectByUuid(uuid)
			object3d.visible = object3d.visible === true ? false : true
		}, [object3dUuid])
	}
	treeView.onExport = function(object3dUuid){
		PanelWin3js.plainFunction(function(uuid){
			var object3d = InspectedWin3js.getObjectByUuid(uuid)
			window.$object3d = object3d
			console.log('in panel-ui-treeview.js: Object3D exported as $object3d')
			console.dir($object3d)
		}, [object3dUuid])
	}
	
	//////////////////////////////////////////////////////////////////////////////////
	//		process updateOneObject3DTreeView
	//////////////////////////////////////////////////////////////////////////////////
	var treeViewObjects     = {}
	PanelWin3js.editor.signals.clearObject3DTreeView.add(function(){
		console.log('in panel-ui-treeview.js: start clearObject3DTreeView', treeViewObjects)

		// honor lastClearedAt
		lastClearedAt = Date.now()
		
		updateDateRow()
		
		// clear the cache
		for( var objectUuid in treeViewObjects ){
			console.log('in panel-ui-treeview.js: delete object3d', objectUuid, treeViewObjects[ objectUuid ])
			// get the 
			var treeViewObject = treeViewObjects[ objectUuid ]
			// get the object3d
			delete treeViewObjects[ objectUuid ];
			// detach the viewItem
			treeViewObject.data.viewItem.detach()
		}
		// console.assert(false, 'test of console assert')
		console.log('in panel-ui-treeview.js: stop clearObject3DTreeView', treeViewObjects)
	})

	PanelWin3js.editor.signals.updateOneObject3DTreeView.add(function(dataJSON){
		// create treeViewObjects[] object if needed
		if( treeViewObjects[ dataJSON.uuid ] === undefined ){
		        console.log('in panel-ui-treeview.js: create a treeviewItem')
			var label = (dataJSON.name ? dataJSON.name : 'unnamed') + ' - ' + dataJSON.className
			// create the dom element
			treeViewObjects[ dataJSON.uuid ] = {
				uuid : dataJSON.uuid,
				parentUuid : dataJSON.parentUuid,
				data : {
					className : dataJSON.className,
					viewItem : new TreeViewItem( label, dataJSON.uuid )
				}
			}
		}

		var treeViewObject = treeViewObjects[ dataJSON.uuid ]
		console.assert( treeViewObject !== undefined )

		if( dataJSON.parentUuid ) {
		        console.log('in panel-ui-treeview.js: appendChild treeviewItem to parent', dataJSON.parentUuid)
			// add current object to the proper parent
			treeViewObjects[ dataJSON.parentUuid ].data.viewItem.appendChild( treeViewObject.data.viewItem );
			treeViewObject.parent = dataJSON.parentUuid;
		} else {
		        console.log('in panel-ui-treeview.js: appendChild treeviewItem to root')
			treeView.getRoot().appendChild( treeViewObject.data.viewItem );
		}
		
	})

	return container
};
