var PanelWin3js	= PanelWin3js	|| {}

/**
 * Handle panel for object3d
 *
 * @constructor
 */
PanelWin3js.PanelNoObject3D	= function(){
	
	var container	= new UI.Panel()
	container.dom.style.textAlign = 'center';
	
	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
	PanelWin3js.editor.signals.selectObject3D.add(function( object3dJson ){
	
		if( object3dJson === null ){
			container.setDisplay( 'inherit' );
			return
		}
	
		container.setDisplay( 'none' );
	})

	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
	var text	= new UI.Text().setColor( '#ccc' ).setValue('NO OBJECT3D')
	text.dom.style.fontSize = '2em'
	text.dom.style.paddingTop = '1em'
	text.dom.style.width = '100%';
	container.add(text)

	return container
};
