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
	        console.log( 'in panel-backgroundcnx.js: received', message );
	        
	        if( message.type === 'updateObject3DTreeView' ){
	                PanelWin3js.editor.signals.updateObject3DTreeView.dispatch(message.data)
	        }else{
	                console.assert(false)
	        }
	});	
}
