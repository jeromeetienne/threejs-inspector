UI.TextRow = function () {

	UI.Panel.call( this );

	var label	= new UI.Text( '' ).setWidth( '90px' )
	var value	= new UI.Text().setWidth( '150px' ).setColor( '#777' )
	// export ui fields
	this.label	= label;
	this.value	= value;
	// build the container	
	var container	= this
	container.add( label );
	container.add( value );

	//////////////////////////////////////////////////////////////////////////////////
	//		handle label
	//////////////////////////////////////////////////////////////////////////////////
	this.setLabel	= function(value){
		label.setValue(value)
		return this
	}
	//////////////////////////////////////////////////////////////////////////////////
	//		handle label
	//////////////////////////////////////////////////////////////////////////////////
	this.setValue	= function(value){
		this.value.setValue(value)
		return this
	}
	//////////////////////////////////////////////////////////////////////////////////
	//		honor .update and .updateUI api
	//////////////////////////////////////////////////////////////////////////////////
	this.update	= function(scope, property){
		if( scope[property] === undefined )	return
		scope[property]	= value.getValue()
	}

	this.updateUI	= function(newValue){
		container.setDisplay(newValue !== undefined ? '' : 'none')
		value.setValue( newValue );
	}
}
UI.TextRow.prototype = Object.create( UI.Panel.prototype );
