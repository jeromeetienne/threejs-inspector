var PanelWin3js	= PanelWin3js	|| {}


/**
 * Handle panel for object3dJson
 *
 * @constructor
 */
PanelWin3js.PanelNoGeometry	= function(){
	
	var editor	= PanelWin3js.editor
	var signals	= editor.signals

	var container	= new UI.Panel()
	container.dom.style.textAlign = 'center';

	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
	signals.object3dSelected.add(function( object3dJson ){
		var noGeometry	= object3dJson === null || object3dJson.geometry === undefined
		console.log('in panel-ui-nogeometry.js: noGeometry', noGeometry)
		if( noGeometry ){
			container.setDisplay( 'inherit' );
			return
		}
	
		container.setDisplay( 'none' );
	})

	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
	var text	= new UI.Text().setColor( '#ccc' ).setValue('NO GEOMETRY')
	text.dom.style.fontSize = '2em'
	text.dom.style.paddingTop = '1em'
	text.dom.style.width = '100%';
	container.add(text)

	return container
};
