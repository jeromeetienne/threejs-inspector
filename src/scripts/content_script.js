// console.log('in content_script.js: start running', window.location.href)

// //////////////////////////////////////////////////////////////////////////////////
// //		Comments
// //////////////////////////////////////////////////////////////////////////////////
// // console.log('in content_script.js: three.js is '+(window.THREE ? '' : ' not')+ 'present.')
// function onLoad(){
// 	console.log('in content_script.js: three.js is '+(window.THREE ? '' : 'not ')+ 'present.')
// }
// 
// // signal devtool panel that the injection is completed
// if( document.readyState !== 'complete' ){
// 	window.addEventListener( 'load', onLoad)
// }else{
// 	// if window already got loaded, call onLoad() manually
// 	onLoad()
// }

//////////////////////////////////////////////////////////////////////////////////
//		to receive message from injected_script
//////////////////////////////////////////////////////////////////////////////////
window.addEventListener('message', function(event) {
	var message = event.data;

	// console.log('in content_script.js: receiving window.message', message)
	
	// Only accept messages from the same frame
	// if (event.source !== window) return
	// console.log('receiving window.message')

	// check the message
	if( typeof message !== 'object' ) return
	if( message === null ) return
	
	// check the message.source
	if( message.source !== 'threejs-extension-inspected-window' ) return

	// remove the magic 'message.source'
	delete message.source

	// console.log('in content_script.js: receiving window.message for background page of three.js extension', message)

	// if this point is reached, send the message to the background page
	chrome.runtime.sendMessage(message);
});

//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////
// console.log('in content_script.js: end running')
