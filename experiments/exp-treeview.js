var treeViewContainer = document.getElementById( 'treeView' )
// empty treeViewContainer
while( treeViewContainer.firstChild ){		
	treeViewContainer.removeChild( treeViewContainer.firstChild );
}

// create TreeView
var treeView = new TreeView( treeViewContainer );
window.treeView = treeView

treeView.onToggleVisibility = function(uuid){
	var object = Inspect3js.getCachedObject3D(uuid).object3d
	console.log('toggle visibility',object)
	object.visible = object.visible === true ? false : true
}
