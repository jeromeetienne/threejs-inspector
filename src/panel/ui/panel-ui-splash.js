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
	domElement.innerHTML	= 'v ' + '1.9.11'	
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
	
	container.dom.appendChild( document.createElement('br') )

	var feedbackRow	= document.createElement('div')
	feedbackRow.innerHTML	= 'Install it via Chrome Store : '
	container.dom.appendChild(feedbackRow)
	var domElement	= document.createElement('a')
	domElement.href	= 'https://chrome.google.com/webstore/detail/threejs-inspector/dnhjfclbfhcbcdfpjaeacomhbdfjbebi?hl=en'
	domElement.innerHTML	= 'three.js inspector'	
	domElement.target	= '_blank'	
	domElement.style.color = '#888'
	feedbackRow.appendChild(domElement)

	container.dom.appendChild( document.createElement('br') )

	var feedbackRow	= document.createElement('div')
	feedbackRow.innerHTML	= 'Bugs, ideas and feedback: '
	container.dom.appendChild(feedbackRow)
	var domElement	= document.createElement('a')
	domElement.href	= 'https://github.com/jeromeetienne/threejs-inspector'
	domElement.innerHTML	= 'GitHub page'	
	domElement.target	= '_blank'	
	domElement.style.color = '#888'
	feedbackRow.appendChild(domElement)

	//////////////////////////////////////////////////////////////////////////////////
	//		Create elements
	//////////////////////////////////////////////////////////////////////////////////

	container.dom.appendChild( document.createElement('br') )
	container.dom.appendChild( document.createElement('br') )
	container.dom.appendChild( document.createElement('br') )
	container.dom.appendChild( document.createElement('br') )
	
	var domElement	= document.createElement('button')
	domElement.innerHTML	= 'Launch'	
	domElement.style.margin = '0.2em'
	domElement.style.lineHeight = '2em'
	domElement.style.paddingLeft = '0.5em'
	domElement.style.paddingRight = '0.5em'
	container.dom.appendChild(domElement)

	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
	domElement.addEventListener('click', doLaunch)
	setTimeout(doLaunch, 10)
	function doLaunch(){
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
	}
	
	return container
};
