function injected_script(){
        
        console.log('injecting content_script')

        var hasTHREEJS = window.THREE !== undefined ? true : false

        if( hasTHREEJS ){
        	console.log('three.js is present version', THREE.REVISION)
        }else{
        	console.log('three.js is NOT present')
        }        
}
