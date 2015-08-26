
//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////


Inspect3js._objectsCache = {}
Inspect3js._renderings = {}
Inspect3js._renderingId = 0


//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////
Inspect3js.clearCaches	= function(){
	Inspect3js._objectsCache = {}
	Inspect3js._renderings = {}
	
	treeView.empty()
}

Inspect3js.getCachedObject3D	= function(uuid){
	return Inspect3js._objectsCache[uuid]
}

Inspect3js.cacheObject3D	= function(object3d, viewItem, reccusive){
	console.assert(object3d instanceof THREE.Object3D)
	var objectsCache	= Inspect3js._objectsCache
	var uuid 		= object3d.uuid
	
	if( objectsCache[uuid] === undefined ){
		if( viewItem === undefined ){
			viewItem	= new TreeViewItem( 'Object3D ' + object3d.name, object3d.uuid )
			if( object3d.parent !== null ){
				var parentViewItem = objectsCache[object3d.parent.uuid].viewItem
				parentViewItem.appendChild(viewItem)
			}
		}

		objectsCache[uuid]	= {
			object3d	: object3d,
			viewItem	: viewItem
		}
	}
	// sanity check
	console.assert(object3d === objectsCache[uuid].object3d)
	
	// update .seenAt
	objectsCache[uuid].seenAt = Date.now()
	
	// honor reccursive argument
	if( reccusive === true ){
		for(var i = 0; i < object3d.children.length; i++){
			Inspect3js.cacheObject3D(object3d.children[i], undefined, reccusive)
		}
	}
}

Inspect3js.instrumentWebGLRendererInstance	= function(renderer){
	renderer.render = Inspect3js.overloadPostProcess( renderer.render, function(returnedValue, args) {
		renderPostProcess(args[0], args[1])
	})

	return
	
	function renderPostProcess(scene, camera){
		//////////////////////////////////////////////////////////////////////////////////
		//		maintain renderings
		//////////////////////////////////////////////////////////////////////////////////

		var renderings	= Inspect3js._renderings
	        var renderingUuid = scene.uuid + '===' + camera.uuid
		// create rendering if needed
	        if( renderings[renderingUuid] === undefined ){
	                renderings[renderingUuid] = {
	                        sceneUuid : scene.uuid,
	                        cameraUuid : camera.uuid,
                        	renderedAt : Date.now(),				
	                }
			
			var viewItem = new TreeViewItem( 'Render '+ ++Inspect3js._renderingId , null );
			treeView.getRoot().appendChild( viewItem );
			renderings[renderingUuid].viewItem	= viewItem
			
			var cameraItem = new TreeViewItem( 'Camera ' + camera.name, camera.uuid );
			viewItem.appendChild( cameraItem );

			Inspect3js.cacheObject3D(camera, cameraItem)

			var sceneItem = new TreeViewItem( 'Scene ' + scene.name, scene.uuid );
			viewItem.appendChild( sceneItem );
			
			Inspect3js.cacheObject3D(scene, sceneItem, true)
	        }

		// get rendering
        	var rendering = renderings[renderingUuid]
		
		if( Date.now() - rendering.renderedAt > 1000){
	        	rendering.renderedAt = Date.now()

		        scene.traverse(function(object3d){
		              Inspect3js.cacheObject3D(object3d)
		        })			
		}
	}

}

	
//////////////////////////////////////////////////////////////////////////////////
//		THREE.WebGLRenderer
//////////////////////////////////////////////////////////////////////////////////

// post process on constructor		
THREE.WebGLRenderer = Inspect3js.overloadPostProcess( THREE.WebGLRenderer, function() {
	Inspect3js.instrumentWebGLRendererInstance( this );
});

// trying to catch already created objects
Inspect3js.instrumentGlobalObjects()

console.log('Inspect3js loaded')
