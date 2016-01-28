var PanelWin3js	= PanelWin3js	|| {}

/**
 * Handle panel for object3d
 *
 * @constructor
 */
PanelWin3js.PanelSplash	= function(){
	var editor	= PanelWin3js.editor
	var signals	= editor.signals

	var container	= new UI.Panel()
	container.dom.style.textAlign	= 'center'
	
	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
	document.querySelector( '#leftSidebar' ).style.display = 'none'
	document.querySelector( '#rightSidebar' ).style.display = 'none'

	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
	
	
	var domElement	= document.createElement('div')
	domElement.innerHTML	= 'THREE.js Inspector'
	domElement.style.fontSize = '2em'
	domElement.style.paddingTop = '1em'
	domElement.style.width = '100%';
	domElement.style.color = '#aaa'
	container.dom.appendChild(domElement)
	
	var domElement	= document.createElement('div')
	domElement.innerHTML	= 'v ' + '1.9.2'	
	domElement.style.color = '#888'
	container.dom.appendChild(domElement)

	container.dom.appendChild( document.createElement('br') )
	


	var authorRow	= document.createElement('div')
	authorRow.innerHTML	= 'Contact me on twitter '
	container.dom.appendChild(authorRow)

	var domElement	= document.createElement('a')
	domElement.href	= 'https://twitter.com/jerome_etienne'
	domElement.innerHTML	= '@jerome_etienne'	
	domElement.target	= '_blank'
	domElement.style.color = '#888'
	authorRow.appendChild(domElement)
	container.dom.appendChild( document.createElement('br') )

	//////////////////////////////////////////////////////////////////////////////////
	//		Create elements
	//////////////////////////////////////////////////////////////////////////////////

	container.dom.appendChild( document.createElement('br') )
	container.dom.appendChild( document.createElement('br') )
	container.dom.appendChild( document.createElement('br') )
	container.dom.appendChild( document.createElement('br') )

	var labelRow	= document.createElement('div')
	labelRow.innerHTML	= 'Keep on clicking "inspect" to refresh the scene'
	container.dom.appendChild(labelRow)
	container.dom.appendChild( document.createElement('br') )
	
	var domElement	= document.createElement('button')
	domElement.innerHTML	= 'Inspect'	
	domElement.style.margin = '0.2em'
	domElement.style.lineHeight = '2em'
	domElement.style.paddingLeft = '0.5em'
	domElement.style.paddingRight = '0.5em'
	container.dom.appendChild(domElement)

	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
	domElement.addEventListener('click', function(){
		console.log('in panel-ui-splash.js: click on inspect button. Injecting inspectedWinScript')
		
		PanelWin3js.injectInspectedWinScripts()
		
		// listen to injectedInspectedWin to know when the scripts are injected
		signals.injectedInspectedWin.add(onInjectedInspectedWin)

		return
			
		function onInjectedInspectedWin(){
			// remove the signals function
			signals.injectedInspectedWin.remove(onInjectedInspectedWin)

			// hide splash panel
			container.dom.style.display = 'none';	

			// init inspector ui
			document.querySelector( '#leftSidebar' ).style.display = 'block'
			document.querySelector( '#rightSidebar' ).style.display = 'block'
			PanelWin3js.initLeftSideBar()
			PanelWin3js.initRightSideBar()

			// capture the scene if possible
			PanelWin3js.plainFunction(function(uuid){
		                InspectedWin3js.captureScene()
			})
		}
		
		
	})
	
	return container
};
