//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////

/**
 * Three View
 * @param {String} label - 
 * @param {[type]} id    [description]
 */
function TreeViewItem( label, id ) {

	this.children = [];
	this.collapsed = false;

	this.label = label || '';
	this.id = id || null;

	// create the domElement
	this.liElement = document.createElement( 'li' );
	
	var containerDiv = document.createElement( 'div' )
	containerDiv.classList.add('container')
	this.liElement.appendChild(containerDiv)

	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
	var collapseIcon = document.createElement('i')
	collapseIcon.setAttribute('title', 'Toggle to collapse/expand tree')
	containerDiv.appendChild( collapseIcon );
	this._updateCollapseIcon()
	collapseIcon.addEventListener('click', function(event){
		var hasChildren = this.liElement.querySelector('ul li') ? true : false
		if( hasChildren === false )	return
		
		this._toggleCollapse()

		event.preventDefault()
		event.stopPropagation()
	}.bind(this))
	
	// add label
	var labelElement = document.createElement( 'p' );
	labelElement.textContent = this.label;
	containerDiv.appendChild( labelElement );
	
;(function(){
	var visibilityIcon = document.createElement('i')
	visibilityIcon.setAttribute('title', 'Toggle visibility of this object')
	visibilityIcon.classList.add('fa')
	visibilityIcon.classList.add('fa-eye')
	visibilityIcon.style.float = 'right'
	visibilityIcon.style.paddingTop = '0.3em'
	containerDiv.appendChild(visibilityIcon)
	
	visibilityIcon.addEventListener( 'click', function( event ) {
		// notify the selection
		this.treeView.onToggleVisibility( this.id );		

		// event.preventDefault();
		event.stopPropagation()
	}.bind(this) );
}.bind(this))()

;(function(){
	var exportIcon = document.createElement('i')
	exportIcon.setAttribute('title', 'Export this object in console')
	exportIcon.classList.add('fa')
	exportIcon.classList.add('fa-share')
	exportIcon.style.float = 'right'
	exportIcon.style.paddingTop = '0.3em'
	containerDiv.appendChild(exportIcon)
	
	exportIcon.addEventListener( 'click', function( event ) {
		// notify the selection
		this.treeView.onExport( this.id );		

		// event.preventDefault();
		event.stopPropagation()
	}.bind(this) );
}.bind(this))()


	// create the list for the children
	this.ulDomElement = null;
	
	this.treeView = null;	// TODO to be renamed .root ?
	this.parentItem = null;	// TODO to be renamed .parent ?

	containerDiv.addEventListener( 'click', function( event ) {
		// clear all active
		this.treeView.clearActive();
		// mark current as active
		containerDiv.classList.add( 'active' );
		// notify the selection
		this.treeView.onSelect( this.id );

		// event.preventDefault();
		event.stopPropagation()
	}.bind( this ) );

	// if dblclick on container, then toggle collapse
	containerDiv.addEventListener( 'dblclick', function( event ) {
		this._toggleCollapse()

		// event.preventDefault();
		event.stopPropagation()
	}.bind( this ));
}

TreeViewItem.prototype.createRootNode = function() {
	this.ulDomElement = document.createElement( 'ul' );
}

TreeViewItem.prototype._toggleCollapse = function () {

	this.liElement.classList.toggle( 'collapsed' );

	this._updateCollapseIcon()
}

TreeViewItem.prototype.collapseAll = function () {
 	var isCollapsed	= this.liElement.classList.contains('collapsed')
	var hasChildren = this.liElement.querySelector('ul li') ? true : false

	if( isCollapsed === false && hasChildren === true ){
		this.liElement.classList.add( 'collapsed' );
	}

	this.children.forEach(function(child){
		child.collapseAll()
	})
}

TreeViewItem.prototype.expandAll = function () {
 	var isCollapsed	= this.liElement.classList.contains('collapsed')
	var hasChildren = this.liElement.querySelector('ul li') ? true : false

	if( isCollapsed === true && hasChildren === true ){
		this.liElement.classList.remove( 'collapsed' );
	}

	this.children.forEach(function(child){
		child.expandAll()
	})
}

TreeViewItem.prototype._updateCollapseIcon = function () {
	var isCollapsed	= this.liElement.classList.contains('collapsed')
	var hasChildren = this.liElement.querySelector('ul li') ? true : false

	// update collapse-icon
	var collapseIcon = this.liElement.querySelector('i')

	if( hasChildren === false ){
		collapseIcon.className = 'fa fa-minus-square-o'		
	}else if( isCollapsed ){
		collapseIcon.className = 'fa fa-plus-square'
	}else{
		collapseIcon.className = 'fa fa-minus-square'
	}	
}
//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////

/**
 * append a child TreeViewItem
 * 
 * @param {TreeViewItem} child - the child to add
 */
TreeViewItem.prototype.appendChild = function( childItem ) {
	
	if( childItem.parentItem === this )	return

	childItem.detach()

	childItem.treeView = this.treeView;
	childItem.parentItem = this;

	if( this.ulDomElement === null ) {
		this.ulDomElement = document.createElement( 'ul' );
		this.liElement.appendChild( this.ulDomElement );		
	}

	this.children.push( childItem );
	this.ulDomElement.appendChild( childItem.liElement );

	this._updateCollapseIcon()
}

/**
 * remove a child TreeViewItem
 * 
 * @param {TreeViewItem} child - the child to remove
 */
TreeViewItem.prototype.removeChild = function( childItem ) {

	childItem.treeView = null;
	childItem.parentItem = null;

	// FIXME this seems like crap
	if( this.ulDomElement === null ) {
		this.liElement.removeChild( this.ulDomElement );		
	}

	for( var j = 0; j < this.children.length; j++ ) {
		if( this.children[ j ] === childItem ) {
			this.children.splice( j, 1 );
			break;
		}
	}
	this.ulDomElement.removeChild( childItem.liElement );

	this._updateCollapseIcon()
}

TreeViewItem.prototype.detach = function () {
	if( this.parentItem === null )	return
	
	this.parentItem.removeChild( this );

	this._updateCollapseIcon()
};
