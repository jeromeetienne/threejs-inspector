# Problem definition
- content scripts keep a array of object3d by uuid
  - other type of object too ? like anything with a uuid
  - it is the asset library
- how to populate this library ?
  - do a root per renderer.render scene.uuid camera.uuid
  - below you put the camera and the scene
  - how to push the scene graph to the ui iframe (incremental/batch)

### Possible solutions
- solutions
  - populate on renderer.render
    - populate the renderings here
    - renderings = { sceneUuid: , cameraUuid: }
  - populate on object3d.add, on object3d constructor
- Hint: go for the more robust and the simplest solution
  - optimisation can come later
  - so we do onRender only for now



function onRender(){
        var renderingUuid = scene.uuid + '===' + camera.uuid

        if( renderings[renderingUuid] = undefined ){
                renderings[renderingUuid] = {
                        sceneUuid : scene.uuid,
                        cameraUuid : camera.uuid
                        renderedAt : Date.now(),
                }
        }

        var rendering = renderings[renderingUuid]
        
        rendering.renderedAt = Date.now()
        
        // cache those 2 parent-less object
        cache(scene)
        cache(camera)
        
        scene.traverse(function(object3d){
              cache(object3d)  
        })

        purgeCache()
}

function purgeCache(){
        // - if scene or camera, add a timeout which is refreshed at each render
        //   - thus if a scene or a camera has not been used for render for a while, it is removed from the cache
        // - else if there is no parent, remove the object from the cache
}

### Write prototype
- you should write a separate test
- how to visualize the result and know if the scene is correct
  - possible with a .div on top 
  - possible in console.log
  - possible in treeView! likely the best to use as it is closer to real case

---

# SCENE GRABBING
- hook THREE.WebGLRenderer.prototype.render(scene, camera)
- DONE hook requestAnimationFrame
  - allow you to count the number of render


### how to test if it works
- write a test code
  - put the tree in a json object
- contentscript within a bookmarlet
  - see http://stackoverflow.com/questions/106425/load-external-js-from-bookmarklet
- if it works, backport the whole system in three.js inspector
- provide a .js to include just after you load the three.js
  - cooperating with the author of the page

---
# Notes
- currently there is two sidebars
- the left with object selector
- the right with the inspector

## How to present the selector
- able to select renderer
  - renderer isnt an object3d. 
  - currently the item sidebar assume UISelect will give a object3d
- on selector, you pass all renderings info at the root
- if an object got no parent for a while, remove it
- 

## What can be selected
