function injected_script(){

        // make sure it is loaded only once
        if( window.InspectedWin3js !== undefined ){
                console.log('in injected_script.js: already injected, bailing out')
                return                
        }

        console.log('in injected_script.js: running start')


        var hasTHREEJS = window.THREE !== undefined ? true : false
        if( hasTHREEJS ){
        	console.log('in injected_script.js: three.js is present version', THREE.REVISION)
        }else{
        	console.log('in injected_script.js: three.js is NOT present')
        }
        
        
        // declare namespace
        window.InspectedWin3js = window.InspectedWin3js || {}
        var InspectedWin3js = window.InspectedWin3js
        
        InspectedWin3js.hasTHREEJS = hasTHREEJS;

        /**
         * post message to devtools pages
         * @param {String} type - the type of the message
         * @param {String} data - the data of the message
         */
        InspectedWin3js.postMessage     = function(type, data){
                window.postMessage({
                        type: type,
                        data: data,
                        source: 'threejs-extension-inspected-window'
                }, '*');
        }

        InspectedWin3js.object3dToJSON  = function(object3d){
                // build the json data
                var data = {
                        uuid    : object3d.uuid,
                        name    : object3d.name,
                        parentUuid : object3d.parent ? object3d.parent.uuid : null,
                        childrenUuid: []
                }
                // populate data.childrenUuid
                object3d.children.forEach(function(child){
                        data.childrenUuid.push(child.uuid)
                })
                // return the data
                return data
        } 


        InspectedWin3js.captureScene    = function(scene){
                console.log('in inject_script.js: run InspectedWin3js.captureScene')
                
                scene.traverse(function(object3d){
                        var object3dJSON = InspectedWin3js.object3dToJSON(object3d)
                        InspectedWin3js.postMessage('updateObject3D', object3dJSON)                        
                })
        }

        // // to send message to devtools page
        // window.postMessage({
        //      name: 'hello there!',
        //      source: 'threejs-extension-inspected-window'
        // }, '*');

        console.log('in injected_script.js: running stop')
}
