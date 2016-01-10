console.log("in panel.js: start running");

// declare namespace
window.PanelWin3js = window.PanelWin3js || {}
var PanelWin3js = window.PanelWin3js

PanelWin3js.updateObject3DTreeView      = function(dataJSON){
        console.log('in panel.js: uuid', dataJSON.uuid, 'name', dataJSON.name)        
        // var viewItem = new TreeViewItem( dataJSON.name + ' - ' + dataJSON.className, dataJSON.uuid );
        // treeView.getRoot().appendChild( viewItem );

        //////////////////////////////////////////////////////////////////////////////////
        //                Comments
        //////////////////////////////////////////////////////////////////////////////////
	var uuid = dataJSON.uuid
	var parentUuid = dataJSON.parentUuid

	// create object if needed
	if( treeViewObjects[ dataJSON.uuid ] === undefined ){
                console.log('in panel.js: create a treeviewItem')
		// create the dom element
		// var viewItem = new TreeViewItem( dataJSON.name, dataJSON.uuid );
console.log('in panel.js: 1')
		treeViewObjects[ dataJSON.uuid ] = {
			uuid : dataJSON.uuid,
			parentUuid : dataJSON.parentUuid,
			data : {
				className : dataJSON.className,
				viewItem : new TreeViewItem( dataJSON.name, dataJSON.uuid )
			}
		}
console.log('in panel.js: 1.5')
	}
        
console.log('in panel.js: 2')
        
        
	var treeViewObject = treeViewObjects[ uuid ]
console.log('in panel.js: 3')
	console.assert( treeViewObject !== undefined )
console.log('in panel.js: 4')

	if( parentUuid ) {
                console.log('in panel.js: appendChild treeviewItem to parent', dataJSON.parentUuid)
		// add current object to the proper parent
		treeViewObjects[ parentUuid ].data.viewItem.appendChild( treeViewObject.data.viewItem );
		treeViewObject.parent = parentUuid;
	} else {
                console.log('in panel.js: appendChild treeviewItem to root')
		// if this object got no parent, add it at the root
		// if( !object.data.viewItem.parentItem ){
			treeView.getRoot().appendChild( treeViewObject.data.viewItem );
		// }
	}
}

//////////////////////////////////////////////////////////////////////////////
//              connect background page
//////////////////////////////////////////////////////////////////////////////


// Create a connection to the background page
var backgroundPageConnection = chrome.runtime.connect({
        name: "panel-page"
});

backgroundPageConnection.postMessage({
        name: 'panelPageCreated',
        tabId: chrome.devtools.inspectedWindow.tabId
});

backgroundPageConnection.onMessage.addListener(function(message) {
        console.log( 'in panel.js: received', message );
        
        if( message.type === 'updateObject3DTreeView' ){
                // console.log('in panel.js: uuid', message.data.uuid, 'name', message.data.name)
                // console.log('chrome.devtools.panels.elements', chrome.devtools.panels.elements)
                PanelWin3js.updateObject3DTreeView(message.data)
        }else{
                console.assert(false)
        }
});

//////////////////////////////////////////////////////////////////////////////////
//                Comments
//////////////////////////////////////////////////////////////////////////////////

document.querySelector('button.inject_script').addEventListener('click', function() {
        console.log('in panel.js: detecting click on a button inject_script')
        
        chrome.devtools.inspectedWindow.eval('('+injected_script.toString()+')();');
}, false);

document.querySelector('button.capture_scene').addEventListener('click', function() {
        console.log('in panel.js: detecting click on a button capture_scene')
        
        function jsCode(){
                InspectedWin3js.captureScene(scene)
        }

        chrome.devtools.inspectedWindow.eval('('+injected_script.toString()+')();');
        chrome.devtools.inspectedWindow.eval('('+jsCode.toString()+')();');
}, false);

//////////////////////////////////////////////////////////////////////////////////
//                Comments
//////////////////////////////////////////////////////////////////////////////////
var treeViewContainer = document.getElementById( 'treeView' )


var treeViewObjects     = {}

// create TreeView
var treeView = new TreeView( treeViewContainer );

treeView.onSelect = function( object3dUuid ){
        console.log('in panel.js: select', object3dUuid)
}

treeView.onToggleVisibility = function(object3dUuid){
        console.log('in panel.js: toggleVisibility', object3dUuid)
}

treeView.onExport = function(object3dUuid){
        console.log('in panel.js: export', object3dUuid)
}

//////////////////////////////////////////////////////////////////////////////////
//                Comments
//////////////////////////////////////////////////////////////////////////////////

console.log("in panel.js: stop running");
