var InspectDevTools	= InspectDevTools	|| {}


var isInitialised	= false

InspectDevTools._onMessage	= function(message){

	// console.log( '>> MESSAGE', JSON.stringify(message) );

	switch( message.method ) {
		case 'inject':
			console.log( '>> inject' );
			InspectDevTools.initAllUI();
			
			injectFile('js/libs/raf-throttler.js')
			injectFile('js/contentscripts/00-instrumenttools.js')
			// injectFunction( inject_00_InstrumentTools )	
			injectFile('js/contentscripts/10-changefromdevtools.js')
			// injectFunction( inject_10_ChangeFromDevtools )	
			injectFile('js/contentscripts/20-select.js')
			// injectFunction( inject_20_Select )

			injectFile('js/contentscripts/30-autorefresh.js')
			// injectFunction( inject_30_AutoRefresh )	
			injectFile('js/contentscripts/30-object3dtojson.js')
			// injectFunction( inject_30_Object3dToJSON )
			injectFile('js/contentscripts/99-instrumentation.js')
			// injectFunction( inject_99_Instrumentation )
			injectFile('js/contentscripts/99-onload.js')
			// injectFunction( inject_99_OnLoad )
			function injectFile(url){
				var request = new XMLHttpRequest();
				request.open('GET', url, false);  // `false` makes the request synchronous
				request.send(null);
				console.assert(request.status === 200)
  				var content = request.responseText
				
				chrome.devtools.inspectedWindow.eval( content )
			}
			function injectFunctionAsFile(fct){
				chrome.devtools.inspectedWindow.eval( '(' + fct.toString() + ')()' )
			}
			function injectFunction(fct){
				chrome.devtools.inspectedWindow.eval( '(' + fct.toString() + ')()' )
			}
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
			console.log('addObject', message)
			var objectUuid = message.object3dUuid
			var parentUuid = message.parentUuid
			
			// create object if needed
			if( objects[ objectUuid ] === undefined ){
				// create the dom element
				var treeViewItem = new TreeViewItem( message.label, objectUuid );

				objects[ objectUuid ] = {
					id	: objectUuid,
					parent	: parentUuid,
					data	: {
						type	: message.type,
						viewItem: treeViewItem
					}
				}
			}
			var object = objects[ objectUuid ]
			console.assert( object !== undefined )

			if( parentUuid ) {
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
			var objectUuid = message.object3dUuid

			// console.log( '>> REMOVE OBJECT', message.object3dUuid );
			//console.log( ' -- OBJECTS RIGHT NOW: ', JSON.stringify( objects ) );
			if( objects[ objectUuid ] !== undefined ) {
				var object = objects[ objectUuid ]
				object.data.viewItem.detach()
				objects[ objectUuid ] = undefined;
				//console.log( '>> REMOVED' );
			} else {
				//console.log( '  -- CACHED' );
			}
			break;
		case 'objectSelected':
			var objectUuid = message.object3dUuid
			if( objectUuid === null ){
				console.log( '>> OBJECT DESELECTED');
				editor.selected = null
				editor.signals.objectSelected.dispatch(null)
				break;
			}

			editor.selected = message.data

			editor.signals.objectSelected.dispatch( editor.selected )
			break;
		case 'render':
			// console.log( 'RENDER RENDER' );
			/*g.setEdge( message.cameraId, message.sceneId, { 
				lineInterpolate: 'basis', 
				arrowhead: 'normal', 
				style: "stroke-dasharray: 5, 5;",
			} );*/
			break;
		case 'log':
			console.log( message.arguments );
			break;
	}	
}
