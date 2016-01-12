/**
 * emulate a alert() call
 *
 * @param {String} message - the message to display
 * @param {Function} callback - the function called when the user answered
 */
UI.DialogAlert	= function(message, callback){
	callback	= callback	|| function(){}
	
	//////////////////////////////////////////////////////////////////////////////////
	//		backward compatible on 
	//////////////////////////////////////////////////////////////////////////////////
	var dialogSupport	= document.createElement( 'dialog' ).showModal ? true : false	
	if( dialogSupport === false ){	
		setTimeout(function(){
			alert(message)
		}, 0)
		return
	}
	
	//////////////////////////////////////////////////////////////////////////////////
	//		Using cleaner html5 dialog
	//////////////////////////////////////////////////////////////////////////////////

	// backup the current activeElement to restore it later
	var activeEl	= document.activeElement

	var dialogEl	= document.createElement( 'dialog' );

        var formEl      = document.createElement('form')
        formEl.method   = 'dialog'
        dialogEl.appendChild(formEl)

	var textEl	= document.createElement('p')
	textEl.innerHTML= message
	formEl.appendChild(textEl)

	var buttonEl	= document.createElement('button')
	buttonEl.type       	= 'submit'
	buttonEl.style.cssFloat	= 'right'
	buttonEl.innerText	= 'OK'
	buttonEl.classList.add('primary')
	formEl.appendChild(buttonEl)


	document.body.appendChild(dialogEl)


	dialogEl.showModal()

	dialogEl.addEventListener('close', function(event){
		// restore the focus to the activeEl
		activeEl.focus()
		// notify the callback
		callback()
	});
}


/**
 * emulate a confirm() call
 *
 * @param {String} message - the message to display
 * @param {Function} callback - the function called when the user answered
 */
UI.DialogConfirm	= function(message, callback){
	callback	= callback	|| function(result){}
	
	//////////////////////////////////////////////////////////////////////////////////
	//		backward compatible on 
	//////////////////////////////////////////////////////////////////////////////////
	var dialogSupport	= document.createElement( 'dialog' ).showModal ? true : false	
	if( dialogSupport === false ){	
		setTimeout(function(){
			var result	= confirm(message);
			callback( result ? 'OK' : 'cancel')
		}, 0)
		return
	}
	
	//////////////////////////////////////////////////////////////////////////////////
	//		Using cleaner html5 dialog
	//////////////////////////////////////////////////////////////////////////////////

	// backup the current activeElement to restore it later
	var activeEl	= document.activeElement

	var dialogEl	= document.createElement( 'dialog' );

        var formEl      = document.createElement('form')
        formEl.method   = 'dialog'
        dialogEl.appendChild(formEl)

	var textEl	= document.createElement('p')
	textEl.innerText= message
	formEl.appendChild(textEl)

	var buttonOk		= document.createElement('button')
	buttonOk.type       	= 'submit'
	buttonOk.style.cssFloat	= 'right'
	buttonOk.value		= 'OK'
	buttonOk.innerText	= 'OK'
	buttonOk.classList.add('primary')
	formEl.appendChild(buttonOk)

	var buttonCancel	= document.createElement('button')
	buttonCancel.type       = 'submit'
	buttonCancel.style.cssFloat= 'left'
	buttonCancel.value	= 'cancel'
	buttonCancel.innerText	= 'Cancel'
	formEl.appendChild(buttonCancel)

	document.body.appendChild(dialogEl)


	dialogEl.showModal()

	dialogEl.addEventListener('close', function (event) {
		// restore the focus to the activeEl
		activeEl.focus()
		// notify the callback
		var result	= dialogEl.returnValue	|| 'cancel'
		callback(result)
	});
}




/**
 * emulate a confirm() call
 *
 * @param {String} message - the message to display
 * @param {Function} callback - the function called when the user answered
 */
UI.DialogPrompt	= function(message, callback){
	callback	= callback	|| function(result, value){}
	
	//////////////////////////////////////////////////////////////////////////////////
	//		backward compatible on 
	//////////////////////////////////////////////////////////////////////////////////
	var dialogSupport	= document.createElement( 'dialog' ).showModal ? true : false	
	if( dialogSupport === false ){	
		setTimeout(function(){
			var value	= prompt(message)
			if( value === null ){
				callback('cancel')
			}else{
				callback('OK', value)
			}
		}, 0)
		return
	}

	
	//////////////////////////////////////////////////////////////////////////////////
	//		Using cleaner html5 dialog
	//////////////////////////////////////////////////////////////////////////////////
	
	// backup the current activeElement to restore it later
	var activeEl	= document.activeElement

	var dialogEl	= document.createElement( 'dialog' );

        var formEl      = document.createElement('form')
        formEl.method   = 'dialog'
        dialogEl.appendChild(formEl)

	var textEl	= document.createElement('p')
	textEl.innerText= message
	formEl.appendChild(textEl)

	var inputEl	= document.createElement('input')
	inputEl.type	= 'text'
	formEl.appendChild(inputEl)

	// stop propagation of keydown for inputEl
	inputEl.addEventListener('keydown', function(event){
		event.stopPropagation()
	})

	formEl.appendChild(document.createElement('br'))
	formEl.appendChild(document.createElement('br'))

	var buttonOk		= document.createElement('button')
	buttonOk.type       	= 'submit'
	buttonOk.style.cssFloat	= 'right'
	buttonOk.value		= 'OK'
	buttonOk.innerText	= 'OK'
	buttonOk.classList.add('primary')
	formEl.appendChild(buttonOk)

	var buttonCancel	= document.createElement('button')
	buttonCancel.type       = 'submit'
	buttonCancel.style.cssFloat= 'left'
	buttonCancel.value	= 'cancel'
	buttonCancel.innerText	= 'Cancel'
	formEl.appendChild(buttonCancel)

	document.body.appendChild(dialogEl)


	dialogEl.showModal()

	dialogEl.addEventListener('close', function (event) {
		// restore the focus to the activeEl
		activeEl.focus()
		// notify the callback
		var result	= dialogEl.returnValue	|| 'cancel'
		var value	= inputEl.value
		callback(result, value)
	});
}
