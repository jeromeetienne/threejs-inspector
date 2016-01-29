var PanelWin3js	= PanelWin3js	|| {}

//////////////////////////////////////////////////////////////////////////////
//              connect background page
//////////////////////////////////////////////////////////////////////////////

PanelWin3js.initBackgroundConnection	= function(){
	// Create a connection to the background page
	var backgroundPageConnection = chrome.runtime.connect({
	        name: "panel-page"
	});

	backgroundPageConnection.postMessage({
	        name: 'panelPageCreated',
	        tabId: chrome.devtools.inspectedWindow.tabId
	});

	backgroundPageConnection.onMessage.addListener(function(message) {
	        console.log( 'in panel-backgroundcnx.js: received', message.type, 'with data', message.data );
	        
		
	        if( message.type === 'updateOneObject3DTreeView' ){
	                PanelWin3js.editor.signals.updateOneObject3DTreeView.dispatch(message.data)
	        }else if( message.type === 'capturedScene' ){
	                PanelWin3js.editor.signals.capturedScene.dispatch(message.data)
	        }else if( message.type === 'clearObject3DTreeView' ){
			console.log('in panel-backgroundcnx.js: dispatch clearObject3DTreeView')
	                PanelWin3js.editor.signals.clearObject3DTreeView.dispatch()
	        }else if( message.type === 'injectedInspectedWin' ){
	                PanelWin3js.editor.signals.injectedInspectedWin.dispatch()
	        }else if( message.type === 'inspectedWinReloaded' ){
			console.log('in panel-backgroundcnx.js: inspected window got reloaded... not sure what do to about it')
			PanelWin3js.injectInspectedWinScripts()
			// capture the scene if possible
			PanelWin3js.plainFunction(function(uuid){
				// TODO what about the .selected stuff too ?
				// - how to share all those states shared between the panel and the inspected window
        			InspectedWin3js.postMessageToPanel('clearObject3DTreeView')                      
		                InspectedWin3js.captureScene()
			})
	        }else if( message.type === 'selectObject3D' ){
			PanelWin3js.editor.selectObject3D( message.data )
	        }else{
	                console.assert(false, 'in panel-backgroundcnx.js: unknown message.type', message.type)
	        }
	});	
}
