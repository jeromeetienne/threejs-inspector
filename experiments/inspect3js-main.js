
//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////


Inspect3js._objectsCache = {}
Inspect3js._renderings = {}
Inspect3js._renderingId = 0



Inspect3js.cacheObject3D	= function(object3d){
	var objectsCache	= Inspect3js._objectsCache
	var uuid 		= object3d.uuid
	if( objectsCache[uuid] === undefined ){
		objectsCache[uuid]	= {
			object3d	: object3d
		}
	}else{
		console.assert(object3d === objectsCache[uuid].object3d)
	}
	// update .seenAt
	objectsCache[uuid].seenAt = Date.now()
}

Inspect3js.instrumentWebGLRendererInstance	= function(renderer){
	renderer.render = Inspect3js.overloadPostProcess( renderer.render, function(returnedValue, args) {
		var scene	= args[0]
		var camera	= args[1]

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
			
			var sceneItem = new TreeViewItem( 'Scene ' + scene.name, null );
			viewItem.appendChild( sceneItem );
			
			var cameraItem = new TreeViewItem( 'Camera ' + camera.name, null );
			viewItem.appendChild( cameraItem );
	        }
		// get rendering
        	var rendering = renderings[renderingUuid]
		
        	rendering.renderedAt = Date.now()

		Inspect3js.cacheObject3D(scene)
		Inspect3js.cacheObject3D(camera)

	        scene.traverse(function(object3d){
	              Inspect3js.cacheObject3D(object3d)  
	        })

	})

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
