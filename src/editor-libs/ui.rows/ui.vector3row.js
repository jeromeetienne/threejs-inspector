UI.Vector3Row = function () {
	var row	= this
	UI.Panel.call( this );

	// build the label
	var label	= new UI.Text( '' ).setWidth( '90px' )
	// build the values
	var valueX	= new UI.Number().setWidth( '50px' ).setColor('red').onChange(update);
	var valueY	= new UI.Number().setWidth( '50px' ).setColor('green').onChange(update);
	var valueZ	= new UI.Number().setWidth( '50px' ).setColor('dodgerblue').onChange(update);

	this.valueX	= valueX
	this.valueY	= valueY
	this.valueZ	= valueZ

	// build the container	
	var container	= this
	container.add( label );
	container.add( valueX, valueY, valueZ );

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
	
	//////////////////////////////////////////////////////////////////////////////////
	//		honor .update and .updateUI api
	//////////////////////////////////////////////////////////////////////////////////
	/**
	 * update the value
	 * @param  {THREE.Vector3} vector - the vector
	 */
	this.update	= function(vector){
		// if vector is undefined, do nothing
		if( vector === undefined )	return
		// update value
		vector.x = valueX.getValue();
		vector.y = valueY.getValue();
		vector.z = valueZ.getValue();
	}

	/**
	 * update the UI 
	 * @param  {THREE.Vector3} vector - the vector
	 */
	this.updateUI	= function(vector){
		// if vector is undefined, hide the row, else display it
		container.setDisplay(vector !== undefined ? '' : 'none')
		// if vector is undefined, return now
		if( vector === undefined )	return
		// update UI
		valueX.setValue( vector.x );
		valueY.setValue( vector.y );
		valueZ.setValue( vector.z );
	}
}
UI.Vector3Row.prototype = Object.create( UI.Panel.prototype );
