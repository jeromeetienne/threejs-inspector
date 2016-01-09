console.log('in content_script.js: start running')

//////////////////////////////////////////////////////////////////////////////////
//		to receive message from injected_script
//////////////////////////////////////////////////////////////////////////////////
window.addEventListener('message', function(event) {
	var message = event.data;

	// console.log('receiving window.message', message)
	
	// Only accept messages from the same frame
	// if (event.source !== window) return
	// console.log('receiving window.message')

	// check the message
	if( typeof message !== 'object' ) return
	if( message === null ) return
	
	// check the message.source
	if( message.source !== 'threejs-extension-inspected-window' ) return

	console.log('receiving window.message for background page of three.js extension', message)

	// if this point is reached, send the message to the background page
	chrome.runtime.sendMessage(message);
});


//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////
console.log('in content_script.js: end running')
