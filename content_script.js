console.log('inside content_script',window.THREE)

var hasTHREEJS = window.THREE !== undefined ? true : false

if( hasTHREEJS ){
	console.log('three.js is present version', THREE.REVISION)
}else{
	console.log('three.js is NOT present')
}
