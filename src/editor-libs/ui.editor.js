UI.TabsHelper = {
	// http://www.my-html-codes.com/javascript-tabs-html-5-css3
	// http://www.my-html-codes.com/HTML5_tutorials/pure-javascript-html-tabs/index.php
	createTabContainer	: function(storageKey, activeTabIndex){
		console.assert( arguments.length === 2 )

		// honor .storageKey
		storageKey		= storageKey+'TabActive'
		var storedTabIndex	= localStorage.getItem(storageKey)	|| activeTabIndex

		var container	= new UI.Panel()
		var tabContainer= container
		container.setClass('tabContainer')

		var headers	= document.createElement('ul')
		headers.classList.add('headers')
		container.dom.appendChild(headers)

		var tabs	= document.createElement('div')
		tabs.classList.add('tabs')
		tabs.classList.add('Panel')
		container.dom.appendChild(tabs)

		container.addTab	= function(titleValue, tab){
			// put the title
			var title		= document.createElement('li')
			title.textContent	= titleValue

			var childIndex	= headers.children.length
			title.addEventListener('click', function(event){
				if( tabContainer.isEnabled(childIndex) === false )	return;
				// tabContainer.toggleActive(childIndex)
				tabContainer.setActive(childIndex)
			})

			headers.appendChild(title)
			tabs.appendChild(tab.dom)

			// honor .storageKey
			if( storedTabIndex !== null && storedTabIndex < headers.children.length ){
				container.setActive(storedTabIndex)
			}
		}

		//////////////////////////////////////////////////////////////////////////////////
		//		Comment								//
		//////////////////////////////////////////////////////////////////////////////////
		tabContainer.setEnabled	= function(childIndex, enabled){
			var childElement= headers.children[childIndex]
			if( enabled ){
				childElement.classList.remove('disabled')
			}else{
				childElement.classList.add('disabled')
				this.setInactive(childIndex)
			}
		}

		tabContainer.isEnabled	= function(childIndex){
			console.assert(childIndex < headers.children.length)

			var isEnabled	= headers.children[childIndex].classList.contains('disabled') ? false : true
			return isEnabled
		}
		//////////////////////////////////////////////////////////////////////////////////
		//		Comment								//
		//////////////////////////////////////////////////////////////////////////////////

		tabContainer.setActive	= function(childIndex){
			if( this.isActive(childIndex) === true )	return
			this.toggleActive(childIndex)
		}

		tabContainer.setInactive	= function(childIndex){
			if( this.isActive(childIndex) === false )	return
			this.toggleActive(childIndex)
		}

		tabContainer.isActive	= function(childIndex){
			console.assert(childIndex < headers.children.length)
			console.assert(tabs.children.length === headers.children.length)

			var isActive	= headers.children[childIndex].classList.contains('active') ? true : false
			return isActive
		}

		tabContainer.toggleActive	= function(childIndex){
			console.assert(childIndex < headers.children.length)
			console.assert(tabs.children.length === headers.children.length)

			var wasActive	= this.isActive(childIndex);

			// remove all other active
			for(var i = 0; i < headers.children.length; i++){
				var child	= headers.children[i]
				headers.children[i].classList.remove('active')
				tabs.children[i].classList.remove('active')
			}
			// set active class in proper ones
			if( wasActive === true ){
				headers.children[childIndex].classList.remove('active')
				tabs.children[childIndex].classList.remove('active')
				// honor .storageKey
				storedTabIndex	= null
				localStorage.setItem(storageKey, storedTabIndex)
			}else{
				headers.children[childIndex].classList.add('active')
				tabs.children[childIndex].classList.add('active')
				// honor .storageKey
				storedTabIndex	= childIndex
				localStorage.setItem(storageKey, storedTabIndex)
			}
		}

		return container
	},

	createTab: function(){
		var container = new UI.Panel();
		container.setClass( 'tab' );
		return container
	}
};

UI.CollapsiblePanelHelper = {

	createContainer	: function(title, storageKey, collapsed){
		var container = new UI.CollapsiblePanel();
		// to cache layout state
		var storageKey	= 'layoutCollapsed_'+title
		var itemValue	= localStorage.getItem(storageKey)
		if( localStorage.getItem(storageKey) !== null ){
			container.setCollapsed( localStorage.getItem(storageKey) === 'true' ? true : false )
		}else{
			container.setCollapsed( collapsed )
		}

		// put a title to this UI.CollapsiblePanel
		var titleElement = new UI.Panel();
		container.addStatic(titleElement)
		titleElement.onClick(function(){
			container.toggle()
			localStorage.setItem(storageKey, container.isCollapsed.toString() )
		})

		container.titleElement	= titleElement

		var titleValue = new UI.Text().setValue(title)
		titleElement.add(titleValue)

		// if you need to change the title itself
		container.setTitle	= function(value){
			titleValue.setValue( value );
		}

		return container
	}
}

UI.PopupMenuHelper = {

	createSelect	: function(options, callback){
		var uiSelect = new UI.Select().setOptions(options)
		// to avoid that the title panel collapse
		uiSelect.onClick(function(event){ event.stopPropagation() })
		uiSelect.dom.style.cssFloat	= 'right'
		uiSelect.dom.style.outline	= 'none'
		uiSelect.dom.style.marginTop	= '3px'
		uiSelect.setWidth( '20px' ).setColor( '#444' ).setFontSize( '12px' )
		uiSelect.dom.addEventListener('change', function(){
			var value	= uiSelect.getValue()
			// deselect the option to ensure to trigger 'change' everytime
			uiSelect.dom.selectedIndex	= 0
			// notify the callback
			callback(value)
		})
		return uiSelect
	}
}

UI.MenubarHelper = {

	createMenuContainer: function ( name, optionsPanel ) {

		var container = new UI.Panel();
		var title = new UI.Panel();

		title.setTextContent( name );
		title.setMargin( '0px' );
		title.setPadding( '8px' );

		container.setClass( 'menu' );
		container.add( title );
		container.add( optionsPanel );

		return container;

	},

	createOption: function ( name, callbackHandler ) {

		var option = new UI.Panel();
		option.setClass( 'option' );
		option.setTextContent( name );
		option.onClick( callbackHandler );

		return option;

	},

	createOptionsPanel: function ( menuConfig ) {

		var options = new UI.Panel();
		options.setClass( 'options' );

		menuConfig.forEach(function(option) {
			options.add(option);
		});

		return options;

	},

	createDivider: function () {

		return new UI.HorizontalRule();

	}

};
