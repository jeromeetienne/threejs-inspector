UI.InputRow = function(){

	UI.Panel.call( this );

	var label	= new UI.Text( '' ).setWidth( '90px' )	
	var value	= new UI.Input().setWidth( '150px' ).setFontSize( '12px' ).onChange( update );
	// export ui fields
	this.label	= label;
	this.value	= value;
	// build the container	
	var container	= this
	container.add( label );
	container.add( value );

	//////////////////////////////////////////////////////////////////////////////////
	//		handle onChange
	//////////////////////////////////////////////////////////////////////////////////
	function update(){
		callback	&& callback()
	}

	var callback	= null
	this.onChange	= function(value){
		callback	= value
		return this
	}

	//////////////////////////////////////////////////////////////////////////////////
	//		handle label
	//////////////////////////////////////////////////////////////////////////////////
	this.setLabel	= function(value){
		label.setValue(value)
		return this
	}

	this.setValue	= function(newValue){
		value.setValue(newValue)
		return this
	}

	this.getValue	= function(){
		return value.getValue()
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
UI.InputRow.prototype = Object.create( UI.Panel.prototype );
