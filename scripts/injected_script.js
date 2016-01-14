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
        	console.log('in injected_script.js: three.js is NOT present. bailing out')
                return
        }
        
        //////////////////////////////////////////////////////////////////////////////////
        //                Comments
        //////////////////////////////////////////////////////////////////////////////////
        
        // declare namespace
        window.InspectedWin3js = window.InspectedWin3js || {}
        var InspectedWin3js = window.InspectedWin3js
        
        InspectedWin3js.hasTHREEJS = hasTHREEJS;
        
        /**
         * object3DJson of the last selected object3d, if none selected then === null
         */
        InspectedWin3js.selected = null

        /**
         * post message to devtools pages
         * @param {String} type - the type of the message
         * @param {String} data - the data of the message
         */
        InspectedWin3js.postMessageToPanel     = function(type, data){
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

                        className: InspectedWin3js.getThreeJSClassName(object3d),                        
                        parentUuid : object3d.parent ? object3d.parent.uuid : null,
                        childrenUuid: [],

        		visible: object3d.visible,

        		position: { x: object3d.position.x, y: object3d.position.y, z: object3d.position.z },
        		rotation: { x: object3d.rotation.x, y: object3d.rotation.y, z: object3d.rotation.z },
        		scale: { x: object3d.scale.x, y: object3d.scale.y, z: object3d.scale.z },
                }
                // populate data.childrenUuid
                object3d.children.forEach(function(child){
                        data.childrenUuid.push(child.uuid)
                })
                // return the data
                return data
        } 

        InspectedWin3js.treeviewObject3dToJSON  = function(object3d){
                // build the json data
                var json = {
                        uuid    : object3d.uuid,
                        name    : object3d.name,

                        className: InspectedWin3js.getThreeJSClassName(object3d),                        
                        parentUuid : object3d.parent ? object3d.parent.uuid : null,
                        childrenUuid: []
                }
                // populate json.childrenUuid
                object3d.children.forEach(function(child){
                        json.childrenUuid.push(child.uuid)
                })
                // return the json
                return json
        } 


        /**
         * capture a scene and send it to inspector panel
         * @param {THREE.Object3D} scene - the object3d root to capture
         */
        InspectedWin3js.captureScene    = function(scene){
                scene.traverse(function(object3d){
                        var json = InspectedWin3js.treeviewObject3dToJSON(object3d)
                        InspectedWin3js.postMessageToPanel('updateObject3DTreeView', json)                      
                })
        }
        
        InspectedWin3js.getObjectByUuid = function(uuid){
                // FIXME use scene as a global
                return scene.getObjectByProperty('uuid', uuid)
        }
        
        InspectedWin3js.inspectUuid = function(uuid){
                console.log('in injected_script.js: inspectUuid', uuid)
                
                if( uuid ===  null ){
                        InspectedWin3js.selected = null
                        InspectedWin3js.postMessageToPanel('inspectObject3D', null)                
                        return
                }

                var object3d = InspectedWin3js.getObjectByUuid(uuid)
                var object3DJson = InspectedWin3js.object3dToJSON(object3d)                
                // update selected
                InspectedWin3js.selected = object3DJson
                // send message to the panel
                InspectedWin3js.postMessageToPanel('inspectObject3D', object3DJson)                      

        }
        
        //////////////////////////////////////////////////////////////////////////////////
        //		To guess the three.js classname
        //////////////////////////////////////////////////////////////////////////////////
        InspectedWin3js._threeJSClassNames = [];

        InspectedWin3js.getThreeJSClassName		= function( object ) {
        	for( var j in InspectedWin3js._threeJSClassNames ) {
        		if( object instanceof THREE[ InspectedWin3js._threeJSClassNames[ j ] ] ) {
        			var result = InspectedWin3js._threeJSClassNames[j]
        			return result;
        		}
        	}

        	debugger; // dafuc?
        }	

        /**
         * extract all constructors functions name from three.js
         */
        InspectedWin3js.extractThreeJSClassNames	= function() {
                console.log('in injected_script.js: extract three.js classnames')
        	for( var property in THREE ){
        		if( typeof THREE[ property ] !== 'function' )	continue
        		// NOTE: unshift is key here to get proper inheritance
        		// - https://github.com/spite/ThreeJSEditorExtension/issues/9
        		InspectedWin3js._threeJSClassNames.unshift( property );
        	}
        }
        
        InspectedWin3js.extractThreeJSClassNames()
        
        //////////////////////////////////////////////////////////////////////////////////
        //                Comments
        //////////////////////////////////////////////////////////////////////////////////
        /**
         * Change a property in a object - called from devtool panel 
         * 
         * @param {String} id   - object uid
         * @param {String} data - property name e.g. "position.x"
         */
        InspectedWin3js.ChangeProperty = function( object3dUUID, property, value ) {
        	console.log('in injected_script.js: ChangeProperty', arguments)
                
                // @TODO change the API of this function....

                var object3d = InspectedWin3js.getObjectByUuid(object3dUUID)

        	var curObject = object3d;
        	
        	var fields = property.split( '.' );
        	for( var fieldIndex = 0; fieldIndex < fields.length; fieldIndex++ ) {
        		var fieldName = fields[fieldIndex]

        		var matchArray = fieldName.match(/(.*)\[(\d+)\]/)
        		if( matchArray !== null ){
        			var indexInArray = matchArray === null ? -1 : parseInt(matchArray[2], 10)
        			fieldName = matchArray[1]
        		}else{
        			var indexInArray = -1				
        		}

        		if( fieldIndex === fields.length - 1 ) {
        			if( indexInArray === -1 )	curObject[ fieldName ] = value;
        			else 				curObject[ fieldName ][indexInArray] = value;
        		} else {
        			if( indexInArray === -1 )	curObject = curObject[ fieldName ];
        			else 				curObject = curObject[ fieldName ][indexInArray];
        		}				
        	}
        }
        /**
         * Call a function on a object3d 
         * 
         * @param {String} object3dUUID   - object uid
         * @param {Function} fct - the function to call
         * @param {Array} data - the parameters to send to function
         */
        InspectedWin3js.ChangeObject3dFunction = function( object3dUUID, fct, args ) {
        	console.log('in injected_script.js: ChangeObject3dFunction', fct.toString(), args)
                var object3d = InspectedWin3js.getObjectByUuid(object3dUUID)
        	console.assert(object3d instanceof THREE.Object3D)
        	var newArgs	= args.slice(0)
        	newArgs.unshift(object3d)
        	
        	fct.apply(null, newArgs)
        }        

        //////////////////////////////////////////////////////////////////////////////////
        //                Comments
        //////////////////////////////////////////////////////////////////////////////////

        console.log('in injected_script.js: running stop')
}
