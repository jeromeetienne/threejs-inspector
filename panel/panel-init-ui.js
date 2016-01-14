var PanelWin3js	= PanelWin3js	|| {}

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

	var aboutTab	= new UI.TabsHelper.createTab()
	tabContainer.addTab('ABOUT', aboutTab)
	aboutTab.add( new PanelWin3js.PanelAbout() )
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
