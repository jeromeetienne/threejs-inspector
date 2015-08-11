var InspectDevTools	= InspectDevTools	|| {}


var isInitialised	= false

InspectDevTools._onMessage	= function(msg){

	// console.log( '>> MESSAGE', JSON.stringify(msg) );

	switch( msg.method ) {
		case 'inject':
			console.log( '>> inject' );
			InspectDevTools.initAllUI();
			
			chrome.devtools.inspectedWindow.eval( '(' + inject_00_InstrumentTools.toString() + ')()' )	
			chrome.devtools.inspectedWindow.eval( '(' + inject_10_ChangeFromDevtools.toString() + ')()' )	
			chrome.devtools.inspectedWindow.eval( '(' + inject_20_Select.toString() + ')()' )	
			chrome.devtools.inspectedWindow.eval( '(' + inject_30_AutoRefresh.toString() + ')()' )	
			chrome.devtools.inspectedWindow.eval( '(' + inject_99_Instrumentation.toString() + ')()' )	
			chrome.devtools.inspectedWindow.eval( '(' + inject_99_OnLoad.toString() + ')()' )	
			break;
		case 'init':
			if( isInitialised === true )	break;
			isInitialised	= true
			
			console.log( '>> init' );

			info.style.display = 'none';
			container.style.display = 'block';

			editor.signals.initialized.dispatch();

			// to reset the inspector panel
			editor.signals.objectSelected.dispatch(null)
			break;
		case 'addObject':
			console.log('addObject', msg)
			var objectUuid = msg.id
			var parentUuid = msg.parentId
			
			// create object if needed
			if( objects[ objectUuid ] === undefined ) {
				// create the dom element
				var treeViewItem = new TreeViewItem( msg.label, objectUuid );

				var data = {
					type: msg.type,
					viewItem: treeViewItem
				}
			
				objects[ objectUuid ] = {
					id: objectUuid,
					parent: parentUuid,
					data: data
				}
			} 
			var object = objects[ objectUuid ]
			console.assert(object !== undefined )

			if( parentUuid ) {
				// if current object got a parentItem, remove it from there
				if( object.data.viewItem.parentItem ){
					object.data.viewItem.parentItem.removeChild( object.data.viewItem );
				}
				// add current object to the proper parent
				objects[ parentUuid ].data.viewItem.appendChild( object.data.viewItem );
				object.parent = parentUuid;
			} else {
				// if this object got no parent, add it at the root
				if( !object.data.viewItem.parentItem ){
					threeViewItem.appendChild( object.data.viewItem );
				}
			}

			break;
		case 'removeObject':
			var objectUuid = msg.id

			// console.log( '>> REMOVE OBJECT', msg.id );
			//console.log( ' -- OBJECTS RIGHT NOW: ', JSON.stringify( objects ) );
			if( objects[ objectUuid ] !== undefined ) {
				var object = objects[ objectUuid ]
				if( object.data.viewItem.parentItem ){
					object.data.viewItem.parentItem.removeChild( object.data.viewItem );
				}
				objects[ objectUuid ] = undefined;
				//console.log( '>> REMOVED' );
			} else {
				//console.log( '  -- CACHED' );
			}
			/*if( msg.parentId ) {
				console.log( '>> CONNECT #', objects[ msg.parentId ], '#', objects[ msg.id ], '#' );
				g.setEdge( msg.parentId, msg.id, { lineInterpolate: 'basis', arrowhead: 'normal' } );
				objects[ msg.id ].parent = parentId;
			}*/
			// console.log( '>> DONE' );
			break;
		case 'objectSelected':
			var objectUuid = msg.id
			if( objectUuid === null ){
				console.log( '>> OBJECT DESELECTED');
				editor.selected = null
				editor.signals.objectSelected.dispatch(null)
				break;
			}

			// console.log( '>> OBJECT SELECTED', msg.data );
			var data = JSON.parse( msg.data );
			editor.selected = data

			editor.signals.objectSelected.dispatch(data)
			break;
		case 'render':
			// console.log( 'RENDER RENDER' );
			/*g.setEdge( msg.cameraId, msg.sceneId, { 
				lineInterpolate: 'basis', 
				arrowhead: 'normal', 
				style: "stroke-dasharray: 5, 5;",
			} );*/
			break;
		case 'log':
			console.log( msg.arguments );
			break;
	}	
}
