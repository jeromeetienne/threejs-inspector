UI.LockableVector3Row = function () {
	var row	= this
	UI.Panel.call( this );

	// build the label
	var label	= new UI.Text( '' ).setWidth( '90px' )

	var scaleLock	= new UI.Checkbox().setPosition( 'absolute' ).setLeft( '75px' ).setTitle('lock values together')
	// build the values
	var updateSrc	= ''
	var valueX	= new UI.Number().setWidth( '50px' ).setColor('red').onChange(function(){
		updateSrc	= 'fromX'
		update()
		updateSrc	= ''
	} );
	var valueY	= new UI.Number().setWidth( '50px' ).setColor('green').onChange( function(){
		updateSrc	= 'fromY'
		update()
		updateSrc	= ''
	} );
	var valueZ	= new UI.Number().setWidth( '50px' ).setColor('dodgerblue').onChange( function(){
		updateSrc	= 'fromZ'
		update()
		updateSrc	= ''
	} );

	this.valueX	= valueX
	this.valueY	= valueY
	this.valueZ	= valueZ

	// build the container	
	var container	= this
	container.add( label );
	container.add( scaleLock );
	container.add( valueX, valueY, valueZ );

	//////////////////////////////////////////////////////////////////////////////////
	//		handle onChange
	//////////////////////////////////////////////////////////////////////////////////
	this.isLocked	= function(){
		return scaleLock.getValue() === true ? true : false
	}
	this.setLocked = function(value){
		scaleLock.setValue(value)
		return this
	}
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
	
	/**
	 * Set the label of this row
	 * 
	 * @param {String} value - the value of the label
	 */
	this.setLabel	= function(value){
		label.setValue(value)
		return this
	}

	//////////////////////////////////////////////////////////////////////////////////
	//		honor .update and .updateUI api
	//////////////////////////////////////////////////////////////////////////////////
	/**
	 * update the value
	 * 
	 * @param  {THREE.Vector3} vector - the vector
	 */
	this.update	= function(vector){
		// if vector is undefined, do nothing
		if( vector === undefined )	return
		// honor lock
		if( row.isLocked() === true ){
			if( updateSrc === 'fromX' ){
				var ratio	= valueX.getValue() / vector.x;
				valueY.setValue( valueY.getValue() * ratio );
				valueZ.setValue( valueZ.getValue() * ratio );				
			}else if( updateSrc === 'fromY' ){
				var ratio	= valueY.getValue() / vector.y;
				valueX.setValue( valueX.getValue() * ratio );
				valueZ.setValue( valueZ.getValue() * ratio );				
			}else if( updateSrc === 'fromZ' ){
				var ratio	= valueZ.getValue() / vector.z;
				valueY.setValue( valueY.getValue() * ratio );
				valueX.setValue( valueX.getValue() * ratio );				
			}else if( updateSrc === '' ){
			}else	console.assert(false)
		}
		// update value
		vector.x = valueX.getValue();
		vector.y = valueY.getValue();
		vector.z = valueZ.getValue();
	}

	/**
	 * update the UI
	 * 
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

UI.LockableVector3Row.prototype = Object.create( UI.Panel.prototype );
