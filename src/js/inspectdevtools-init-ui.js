var InspectDevTools	= InspectDevTools	|| {}

/**
 * init right side bar
 */
InspectDevTools.initRightSideBar	= function(){
	// empty treeViewContainer
	var domElement	= document.querySelector( '#rightSidebar' )
	while( domElement.firstChild ){		
		domElement.removeChild( domElement.firstChild );
	}


	// create tab container
	var tabContainer	= new UI.TabsHelper.createTabContainer('inspectorSidebar', 0)
	document.querySelector( '#rightSidebar' ).appendChild(tabContainer.dom)

	document.querySelector( '#rightSidebar' ).style.padding = '0px'
	tabContainer.dom.style.padding = '0px'

	//////////////////////////////////////////////////////////////////////////////////
	//		object3dTab
	//////////////////////////////////////////////////////////////////////////////////
	var object3dTab	= new UI.TabsHelper.createTab()
	tabContainer.addTab('OBJECT3D', object3dTab)
	object3dTab.add( new PanelObject3D() )
	object3dTab.add( new PanelNoObject3D() )
	object3dTab.add( new PanelObject3DActions() )
	
	//////////////////////////////////////////////////////////////////////////////////
	//		geometryTab
	//////////////////////////////////////////////////////////////////////////////////
	var geometryTab	= new UI.TabsHelper.createTab()
	tabContainer.addTab('GEOMETRY', geometryTab)
	geometryTab.add( new PanelGeometry() )
	geometryTab.add( new PanelNoGeometry() )

	//////////////////////////////////////////////////////////////////////////////////
	//		materialTab
	//////////////////////////////////////////////////////////////////////////////////
	var materialTab	= new UI.TabsHelper.createTab()
	tabContainer.addTab('MATERIAL', materialTab)
	materialTab.add( new PanelNoMaterial() )
	materialTab.add( new PanelMaterial(-1) )	
}

/**
 * init left sidebar
 */
InspectDevTools.initLeftSideBar = function(){
	var treeViewContainer = document.getElementById( 'leftSidebar' )

	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
	
	// empty treeViewContainer
	while( treeViewContainer.firstChild ){		
		treeViewContainer.removeChild( treeViewContainer.firstChild );
	}
	
	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////

	var tabContainer	= new UI.TabsHelper.createTabContainer('sceneSidebar', 0)
	document.querySelector( '#leftSidebar' ).appendChild(tabContainer.dom)
	document.querySelector( '#leftSidebar' ).style.padding = '0px'
	tabContainer.dom.style.padding = '0px'


	var sceneTab	= new UI.TabsHelper.createTab()
	tabContainer.addTab('SCENE', sceneTab)
	sceneTab.add( new PanelTreeView() )

	var settingsTab	= new UI.TabsHelper.createTab()
	tabContainer.addTab('SETTINGS', settingsTab)
	settingsTab.add( new PanelSettings() )

	var aboutTab	= new UI.TabsHelper.createTab()
	tabContainer.addTab('ABOUT', aboutTab)
	aboutTab.add( new PanelAbout() )
}

/**
 * [function description]
 * @return {[type]} [description]
 */
InspectDevTools.initAllUI	= function(){
	console.log( '>> tear down' );

	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////

	objects = {};
	scenes = {};
	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////

	InspectDevTools.initLeftSideBar()
	InspectDevTools.initRightSideBar()	
}
