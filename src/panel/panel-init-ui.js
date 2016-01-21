var PanelWin3js	= PanelWin3js	|| {}

//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////

PanelWin3js.initSplash = function(){
	var panel = new PanelWin3js.PanelSplash() 
	document.querySelector( '#container' ).appendChild(panel.dom)
}

//////////////////////////////////////////////////////////////////////////////////
//                Comments
//////////////////////////////////////////////////////////////////////////////////

/**
 * init left sidebar
 */
PanelWin3js.initLeftSideBar = function(){

	var tabContainer	= new UI.TabsHelper.createTabContainer('sceneSidebar', 0)
	document.querySelector( '#leftSidebar' ).appendChild(tabContainer.dom)
	document.querySelector( '#leftSidebar' ).style.padding = '0px'
	tabContainer.dom.style.padding = '0px'
        
	var sceneTab	= new UI.TabsHelper.createTab()
	tabContainer.addTab('SCENE', sceneTab)
	sceneTab.add( new PanelWin3js.PanelTreeView() )

	var settingTab	= new UI.TabsHelper.createTab()
	tabContainer.addTab('SETTINGS', settingTab)
	settingTab.add( new PanelWin3js.PanelSettings() )

	var aboutTab	= new UI.TabsHelper.createTab()
	tabContainer.addTab('ABOUT', aboutTab)
	aboutTab.add( new PanelWin3js.PanelAbout() )
	
	//////////////////////////////////////////////////////////////////////////////////
	//		Handle Inspect button hack
	//////////////////////////////////////////////////////////////////////////////////
	var domElement	= document.createElement('button')
	domElement.innerHTML	= 'Inspect'	
	domElement.style.position = 'absolute'
	domElement.style.top = '0px'
	domElement.style.right = '0px'
	domElement.style.margin = '0.2em'
	domElement.style.lineHeight = '2em'
	domElement.style.paddingLeft = '0.5em'
	domElement.style.paddingRight = '0.5em'
	tabContainer.dom.appendChild(domElement)
	domElement.addEventListener('click', function(){
		// capture the scene if possible
		PanelWin3js.plainFunction(function(uuid){
	                InspectedWin3js.captureScene(scene)
		})		
	})
}

//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////

PanelWin3js.initRightSideBar = function(){
	var tabContainer	= new UI.TabsHelper.createTabContainer('inspectorSidebar', 0)
	document.querySelector( '#rightSidebar' ).appendChild(tabContainer.dom)
	document.querySelector( '#rightSidebar' ).style.padding = '0px'
	tabContainer.dom.style.padding = '0px'

	//////////////////////////////////////////////////////////////////////////////////
	//		object3dTab
	//////////////////////////////////////////////////////////////////////////////////
	var object3dTab	= new UI.TabsHelper.createTab()
	tabContainer.addTab('OBJECT3D', object3dTab)
	object3dTab.add( new PanelWin3js.PanelObject3D() )
	object3dTab.add( new PanelWin3js.PanelNoObject3D() )
	
	
	//////////////////////////////////////////////////////////////////////////////////
	//		geometryTab
	//////////////////////////////////////////////////////////////////////////////////
	var geometryTab	= new UI.TabsHelper.createTab()
	tabContainer.addTab('GEOMETRY', geometryTab)
	geometryTab.add( new PanelWin3js.PanelGeometry() )
	geometryTab.add( new PanelWin3js.PanelNoGeometry() )

	//////////////////////////////////////////////////////////////////////////////////
	//		materialTab
	//////////////////////////////////////////////////////////////////////////////////
	var materialTab	= new UI.TabsHelper.createTab()
	tabContainer.addTab('MATERIAL', materialTab)
	materialTab.add( new PanelWin3js.PanelNoMaterial() )
	materialTab.add( new PanelWin3js.PanelMaterial(-1) )
}
