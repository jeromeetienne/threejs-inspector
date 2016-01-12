UI.LockableVector2Row = function () {
	var row	= this
	UI.Panel.call( this );

	// build the label
	var label	= new UI.Text( '' ).setWidth( '90px' )

	var lock	= new UI.Checkbox().setPosition( 'absolute' ).setLeft( '75px' )
				.setTitle('lock values together')
	// build the values
	var changeSrc	= ''
	var valueX	= new UI.Number().setWidth( '50px' ).setColor('red').onChange(function(){
		changeSrc	= 'fromX'
		dispatchChange()
		changeSrc	= ''
	} );
	var valueY	= new UI.Number().setWidth( '50px' ).setColor('green').onChange( function(){
		changeSrc	= 'fromY'
		dispatchChange()
		changeSrc	= ''
	} );

	this.valueX	= valueX
	this.valueY	= valueY
	this.lock	= lock

	// build the container	
	var container	= this
	container.add( label );
	container.add( lock );
	container.add( valueX, valueY );

	//////////////////////////////////////////////////////////////////////////////////
	//		handle onChange
	//////////////////////////////////////////////////////////////////////////////////
	this.isLocked	= function(){
		return lock.getValue() === true ? true : false
	}
	this.setLocked = function(value){
		lock.setValue(value)
		return this
	}
	function dispatchChange(){
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
	 * set the label of the row
	 * @param {String} value - the label
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
	 * @param  {THREE.Vector2} vector - the vector to update
	 */
	this.update	= function(vector){
		// if vector is undefined, do nothing
		if( vector === undefined )	return
		// honor lock
		if( row.isLocked() === true ){
console.log('update locked vector2', changeSrc)
			if( changeSrc === 'fromX' ){
				var ratio	= valueX.getValue() / vector.x;
				valueY.setValue( valueY.getValue() * ratio );
			}else if( changeSrc === 'fromY' ){
				var ratio	= valueY.getValue() / vector.y;
				valueX.setValue( valueX.getValue() * ratio );
			}else if( changeSrc === '' ){
			}else	console.assert(false)
		}
		// update value
		vector.x = valueX.getValue();
		vector.y = valueY.getValue();
	}
	/**
	 * update the ui with the value
	 * 
	 * @param  {THREE.Vector2} vector - the vector to use
	 */
	this.updateUI	= function(vector){
		// if vector is undefined, hide the row, else display it
		container.setDisplay(vector !== undefined ? '' : 'none')
		// if vector is undefined, return now
		if( vector === undefined )	return
		// update UI
		valueX.setValue( vector.x );
		valueY.setValue( vector.y );
	}
}
UI.LockableVector2Row.prototype = Object.create( UI.Panel.prototype );
