/**
 * Handle a CheckbowRow
 * 
 * @constructor
 */
UI.CheckboxRow = function () {

	UI.Panel.call( this );

	var label	= new UI.Text( '' ).setWidth( '90px' )
	var value	= new UI.Checkbox().onChange( update );

	// export ui fields
	this.label	= label;
	this.value	= value;
	// build the container	
	var container	= this
	container.add( label );
	container.add( value );

	// trick to be able to click on the full row (and not object the checkbox)
	container.onClick(function(event){
		if( event.target.classList.contains('Checkbox') === false ){
			value.toggleValue()
		}
		update()
	});

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

	/**
	 * update the bound value
	 * 
	 * @param  {Object} scope    - the object which is modified
	 * @param  {String} property - the property to modify
	 */
	this.update	= function(scope, property){
		console.assert(scope !== undefined)
		console.assert(property !== undefined)
		if( scope[property] === undefined )	return
		scope[property]	= value.getValue()
	}

	/**
	 * update the ui
	 * 
	 * @param  {Boolean|undefined} newValue - the new value to put in the ui
	 */
	this.updateUI	= function(newValue){
		// console.assert(newValue === undefined || newValue instanceof Boolean)
		container.setDisplay(newValue !== undefined ? '' : 'none')
		value.setValue( newValue );
	}
}
UI.CheckboxRow.prototype = Object.create( UI.Panel.prototype );
