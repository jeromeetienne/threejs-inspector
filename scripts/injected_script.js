function injected_script(){
        
        console.log('in injected_script.js: running start')

        var hasTHREEJS = window.THREE !== undefined ? true : false

        if( hasTHREEJS ){
        	console.log('three.js is present version', THREE.REVISION)
        }else{
        	console.log('three.js is NOT present')
        }        

        // window.postMessage({
        //   greeting: 'hello there!',
        //   source: 'threejs-extension'
        // }, '*');

        console.log('in injected_script.js: running stop')
}
