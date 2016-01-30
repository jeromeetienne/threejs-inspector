console.log('in 50-injected_script-main.js: running start')

// create a RafThrottler 
InspectedWin3js.rafThrottler	= new RafThrottler();

//////////////////////////////////////////////////////////////////////////////////
//                Comments
//////////////////////////////////////////////////////////////////////////////////

/**
 * object3DJson of the last selected object3d, if none selected then === null
 */
InspectedWin3js.selected = null


InspectedWin3js.selectUuid = function(uuid){
        console.log('in 50-injected_script-main.js: selectUuid', uuid)
        
        if( uuid ===  null ){
                InspectedWin3js.selected = null
                InspectedWin3js.postMessageToPanel('selectObject3D', null)                
                return
        }

        var object3d = InspectedWin3js.getObjectByUuid(uuid)
        var object3DJson = InspectedWin3js.object3dToJSON(object3d)                
        // update selected
        InspectedWin3js.selected = object3DJson

        // send message to the panel
        InspectedWin3js.postMessageToPanel('selectObject3D', object3DJson)                      

}
        
//////////////////////////////////////////////////////////////////////////////////
//                Comments
//////////////////////////////////////////////////////////////////////////////////

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


InspectedWin3js.getObjectByUuid = function(uuid){
        // FIXME use scene as a global
        return scene.getObjectByProperty('uuid', uuid)
}

InspectedWin3js.getInspectedScene = function(){
        if( window.scene instanceof THREE.Scene === false ) return null
        return window.scene;
}

/**
 * get default parent when adding a mesh
 */
InspectedWin3js.getDefaultParent = function(){
        var scene = InspectedWin3js.getInspectedScene()

        if( InspectedWin3js.selected === null ) return scene

        var uuid = InspectedWin3js.selected.uuid
        var parent = scene.getObjectByProperty('uuid', uuid)
        return parent
}

//////////////////////////////////////////////////////////////////////////////////
//                for treeview
//////////////////////////////////////////////////////////////////////////////////

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
 */
InspectedWin3js.captureScene    = function(){
        console.log('in 50-inspected-win-main.js: capture scene')
        // TODO it could be a long message with all object
        // - this would reduce message latency
        InspectedWin3js.postMessageToPanel('clearObject3DTreeView')
        
        if( InspectedWin3js.hasTHREEJS === false ){
                InspectedWin3js.postMessageToPanel('capturedScene')
                return                  
        }

        var scene = InspectedWin3js.getInspectedScene()
        
        if( scene === null )    console.error('three.js inspector: no scene to inspect. Please export it as window.scene.')
        
        if( scene === null )    return;
        scene.traverse(function(object3d){
                var json = InspectedWin3js.treeviewObject3dToJSON(object3d)
                InspectedWin3js.postMessageToPanel('updateOneObject3DTreeView', json)                      
        })

        InspectedWin3js.postMessageToPanel('capturedScene')
}

        
//////////////////////////////////////////////////////////////////////////////////
//                Comments
////////////////////////////////////////////////////////////////////////////////// 

if( InspectedWin3js.hasTHREEJS === true ){
        InspectedWin3js.extractThreeJSClassNames()
        InspectedWin3js.instrumentThreejs()
}

InspectedWin3js.postMessageToPanel('injectedInspectedWin')                      
