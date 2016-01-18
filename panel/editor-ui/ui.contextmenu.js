/**
 * handle a contextMenu
 *
 * @constructor
 * @param {Object}	options		- object with the key and label
 * @param {HTMLElement} domElement	- the dom element on which we listen to right button event
 * @param {Function} 	onClick    	- the function called on click
 */
UI.ContextMenu	= function(options, domElement, onClick){

	UI.Element.call( this );

	//////////////////////////////////////////////////////////////////////////////////
	//		Build Menu
	//////////////////////////////////////////////////////////////////////////////////

	var menuElement	= document.createElement('div')
	menuElement.style.display	= 'none'
	menuElement.classList.add('contextMenu')

	this.dom       = menuElement;

	var ulElement	= document.createElement('ul')
	menuElement.appendChild(ulElement)
	Object.keys(options).forEach(function(action){
		var liElement	= document.createElement('li')
		ulElement.appendChild(liElement)
		liElement.innerHTML	= options[action]
		liElement.dataset.action= action
	})

	//////////////////////////////////////////////////////////////////////////////////
	//		Bind events to make it appear/disappear
	//////////////////////////////////////////////////////////////////////////////////
        var onMouseDownX	= 0;
        var onMouseDownY	= 0;
	function onMouseDown(event){
		// if not the right mouse button, return now
		if( event.button !== 2 )	return;
		// update onMouseDownPosition
		onMouseDownX	= event.clientX
		onMouseDownY	= event.clientY
		// bind mouseup
		domElement.addEventListener( 'mouseup', onMouseUp );
	}
	function onMouseUp(event){
		// if not the right mouse button, return now
		if( event.button !== 2 )	return;

                // test if the button moved too much to be considered a click
                var deltaX	= event.clientX - onMouseDownX
                var deltaY	= event.clientY - onMouseDownY
                var distance    = Math.sqrt(deltaX*deltaX + deltaY*deltaY)
                if( distance > 0 )      return

                // stop event propagation
		event.stopPropagation()

		// compute the position of the contextMenu
		var boundingRect= domElement.getBoundingClientRect();
		var positionX	= event.clientX - boundingRect.left
		var positionY	= event.clientY - boundingRect.top

		// toggle menu visibility
		if( menuElement.style.display === 'block' ){
			menuElement.style.display	= 'none';
		}else{
			menuElement.style.display	= 'block';
			menuElement.style.left	= (positionX-80)+'px';
			menuElement.style.top	= (positionY-10)+'px';
		}
	}
	//

	domElement.addEventListener( 'mousedown', onMouseDown);

	domElement.addEventListener( 'contextmenu', function(event){
                event.preventDefault();
        }, false );

	//////////////////////////////////////////////////////////////////////////////////
	//		Bind events for menu options
	//////////////////////////////////////////////////////////////////////////////////
	// listen to click on each line of the menu
	var elements	= menuElement.querySelectorAll('li');
	[].slice.call(elements).forEach(function(liElement){
		// console.log('li', liElement, liElement.dataset.action)
		liElement.addEventListener('mousedown', function(event){
			if( event.button !== 0 )	return;
			// hide menu
			menuElement.style.display	= 'none';
			// get the action for this line
			var action	= liElement.dataset.action
			// handle event
			onClick(action)
			// stop the event here
			event.preventDefault()
			event.stopPropagation()
		})
	})
}

UI.ContextMenu.prototype = Object.create( UI.Element.prototype );
