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
	//		Create elements
	//////////////////////////////////////////////////////////////////////////////////
	
	
	var domElement	= document.createElement('div')
	domElement.innerHTML	= 'SPLASH'
	domElement.style.fontSize = '2em'
	domElement.style.paddingTop = '1em'
	domElement.style.width = '100%';
	domElement.style.color = '#aaa'
	container.dom.appendChild(domElement)

	var domElement	= document.createElement('button')
	domElement.innerHTML	= 'Inspect'	
	// domElement.style.position = 'absolute'
	// domElement.style.top = '0px'
	// domElement.style.right = '0px'
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
			// hide splash panel
			container.dom.style.display = 'none';
	
			// remove the signals function
			signals.injectedInspectedWin.remove(onInjectedInspectedWin)

			// init inspector ui
			document.querySelector( '#leftSidebar' ).style.display = 'block'
			document.querySelector( '#rightSidebar' ).style.display = 'block'
			PanelWin3js.initLeftSideBar()
			PanelWin3js.initRightSideBar()

			// capture the scene if possible
			PanelWin3js.plainFunction(function(uuid){
		                InspectedWin3js.captureScene(scene)
			})
		}
		
		
	})
	
	return container
};
