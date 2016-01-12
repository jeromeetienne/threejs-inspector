/**
 * @class Handle a number row
 */
UI.NumberRow = function () {

	UI.Panel.call( this );

	var label	= new UI.Text( '' ).setWidth( '90px' )
	var value	= new UI.Number().onChange( update );
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
		container.setDisplay(newValue !== undefined ? '' : 'none')
		value.setValue(newValue)
		return this
	}

	this.getValue	= function(){
		return value.getValue()
	}
	//////////////////////////////////////////////////////////////////////////////////
	//		honor .update and .updateUI api
	//////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * update the object property
	 * 
	 * @param  {Object} scope    - the object
	 * @param  {String} property - the property
	 */
	this.update	= function(scope, property){
		if( scope[property] === undefined )	return
		scope[property]	= value.getValue()
	}

	/**
	 * update the UI
	 * 
	 * @param  {Number|undefined} newValue - the value to set
	 */
	this.updateUI	= function(newValue){
		container.setDisplay(newValue !== undefined ? '' : 'none')
		value.setValue( newValue );
	}
}
UI.NumberRow.prototype = Object.create( UI.Panel.prototype );
