
//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////

/**
 * Handle the tree view
 */
function TreeView( domElementContainer ) {

	
	this.root = new TreeViewItem( 'Root');
	this.root.createRootNode();
	this.root.ulDomElement.classList.add( 'treeView' );
	this.root.treeView = this;

	this.domElementContainer = domElementContainer;
	this.domElementContainer.appendChild( this.root.ulDomElement );
}

/**
 * remove any active item
 * @return {[type]} [description]
 */
TreeView.prototype.clearActive = function() {

	var activeElement = this.root.ulDomElement.querySelector( '.active' );
	if( activeElement ) activeElement.classList.remove( 'active' );

}

/**
 * empty the treeView
 */
TreeView.prototype.empty = function () {
	var ulDomElement	 = this.root.ulDomElement
	while( ulDomElement.firstChild ){		
		ulDomElement.removeChild( ulDomElement.firstChild );
	}
};


/**
 * return the root item
 * @return {threeViewItem} the root item
 */
TreeView.prototype.getRoot = function() {

	return this.root;

}

// TreeView.prototype.render = function() {
// }

/**
 * function notified when an item is selected
 * @param {String|Null} uuid - the object3d selected
 */
TreeView.prototype.onSelect = function(uuid) {
}

/**
 * function notified when an item toggleVisibility is click
 * @param {String} uuid - the object3d selected
 */
TreeView.prototype.onToggleVisibility = function(uuid) {
}

/**
 * function notified when an item toggleVisibility is click
 * @param {String} uuid - the object3d selected
 */
TreeView.prototype.onExport = function(uuid) {
}
