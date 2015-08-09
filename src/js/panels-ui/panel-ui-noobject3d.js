/**
 * Handle panel for object3d
 *
 * @constructor
 */
var PanelNoObject3D	= function(){
	
	var signals	= editor.signals

	var container	= new UI.Panel()
	container.dom.style.textAlign = 'center';

	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
	signals.objectSelected.add(function( object3d ){

		if( object3d === null ){
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
