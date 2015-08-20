var treeViewContainer = document.getElementById( 'treeView' )
// empty treeViewContainer
while( treeViewContainer.firstChild ){		
	treeViewContainer.removeChild( treeViewContainer.firstChild );
}

// create TreeView
var treeView = new TreeView( treeViewContainer );
window.treeView = treeView
// 
// var rendererItem = new TreeViewItem( 'Renderer', null );
// treeView.getRoot().appendChild( rendererItem );
// 
// var cameraItem = new TreeViewItem( 'Camera', null );
// rendererItem.appendChild( cameraItem );
// 
// 
// var sceneItem = new TreeViewItem( 'Scene', null );
// rendererItem.appendChild( sceneItem );
// 
// var cubeItem = new TreeViewItem( 'Cube', null );
// sceneItem.appendChild( cubeItem );
// 
// var torusItem = new TreeViewItem( 'Torus', null );
// sceneItem.appendChild( torusItem );
