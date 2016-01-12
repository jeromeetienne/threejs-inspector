/**
 * Handle a THREE.Color row
 * @constructor
 */
UI.ColorRow = function(){

	UI.Panel.call( this );

	var label	= new UI.Text( '' ).setWidth( '90px' )	
	var value	= new UI.Color().onChange( update );
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
	
	this.getHexValue = function(){
		return this.value.getHexValue()
	}
	this.setValue = function(value){
		// if value is undefined, hide the row, else display it
		container.setDisplay(value !== undefined ? '' : 'none')

		this.value.setValue(value)
		return this
	}
	this.setHexValue = function(value){
		// if value is undefined, hide the row, else display it
		container.setDisplay(value !== undefined ? '' : 'none')

		this.value.setHexValue(value)
		return this
	}

	//////////////////////////////////////////////////////////////////////////////////
	//		honor .update and .updateUI api
	//////////////////////////////////////////////////////////////////////////////////

	/**
	 * update the UI
	 * 
	 * @param  {THREE.Color|undefined} newValue - the value to set
	 */
	this.updateUI	= function(newValue){
		container.setDisplay(newValue !== undefined ? '' : 'none')
		if( newValue === undefined )	return
		value.setHexValue( newValue );
	}
}
UI.ColorRow.prototype = Object.create( UI.Panel.prototype );
