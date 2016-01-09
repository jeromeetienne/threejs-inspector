console.log('in content_script.js: start running')

//////////////////////////////////////////////////////////////////////////////////
//		to receive message from injected_script
//////////////////////////////////////////////////////////////////////////////////
window.addEventListener('message', function(event) {
	// Only accept messages from the same frame
	if (event.source !== window) return
	// check the message
	if( typeof message !== 'object' ) return
	if( message === null ) return
	
	// check the message.source
	if( message.source !== 'threejs-extension' ) return

	// if this point is reached, send the message to the background page
	chrome.runtime.sendMessage(message);
});


//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////
console.log('in content_script.js: end running')
