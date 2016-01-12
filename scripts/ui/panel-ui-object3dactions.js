/**
 * Handle panel for object3d
 *
 * @constructor
 */
var PanelObject3DActions	= function(){
	
	var signals	= editor.signals
	
	var container	= UI.CollapsiblePanelHelper.createContainer('ACTIONS', 'sidebarObject3DActions', false)
	container.setDisplay( 'none' );

	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
	editor.signals.objectSelected.add(function( object3d ){
		if( object3d !== null ){
			container.setDisplay( 'inherit' );
		}else{
			container.setDisplay( 'none' );
		}
	})
	//////////////////////////////////////////////////////////////////////////////////
	//		handle tab-object3d
	//////////////////////////////////////////////////////////////////////////////////

;(function(){

			
	var geometryTypes = [
		"TorusGeometry",
		"TorusKnotGeometry",
		"BoxGeometry",
		"CylinderGeometry",
		"SphereGeometry",	
	]
	
	geometryTypes.forEach(function(geometryType){
		var button = new UI.Button(geometryType)
		container.add(button)
		button.onClick(function(){
			var injectFunction = InspectDevTools.functionOnObject3d		
			injectFunction(addObjectPerGeometry, [geometryType]);
		})	
	})
	
	function addObjectPerGeometry( parentObject3d, type){
		console.log('addObjectPerGeometry', parentObject3d, type)
		if( type === "TorusGeometry" ){
			var radius = 0.5-0.12;
			var tube = 0.12;
			var radialSegments = 32;
			var tubularSegments = 16;
			var arc = Math.PI * 2;

			var geometry = new THREE.TorusGeometry( radius, tube, radialSegments, tubularSegments, arc );
		}if( type === "TorusKnotGeometry" ){
			var radius = 0.5-0.12;
			var tube = 0.12;
			var radialSegments = 64;
			var tubularSegments = 8;
			var p = 2;
			var q = 3;
			var heightScale = 1;

			var geometry = new THREE.TorusKnotGeometry( radius, tube, radialSegments, tubularSegments, p, q, heightScale );
		}else if( type === "BoxGeometry" ){
			var geometry = new THREE.BoxGeometry(1,1,1)
		}else if( type === "CylinderGeometry" ){
			var radiusTop = 0.25;
			var radiusBottom = 0.25;
			var height = 1;
			var radiusSegments = 16;
			var heightSegments = 1;
			var openEnded = false;
			var geometry = new THREE.CylinderGeometry( radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded );
		}else if( type === "SphereGeometry" ){
			var radius = 0.5;
			var widthSegments = 32;
			var heightSegments = 16;

			var geometry = new THREE.SphereGeometry( radius, widthSegments, heightSegments );
		}else {
			console.assert(false)
		}


		var material = new THREE.MeshNormalMaterial()
		var mesh = new THREE.Mesh(geometry, material)

		var parent = Inspect3js.getSelected()
		parent.add(mesh)
	}

})()
	//////////////////////////////////////////////////////////////////////////////////
	//		handle tab-object3d
	//////////////////////////////////////////////////////////////////////////////////

;(function(){
	var lightTypes = [
		"PointLight",
		"SpotLight",
		"DirectionalLight",
		"HemisphereLight",
		"AmbientLight",
	]
	
	lightTypes.forEach(function(type){
		var button = new UI.Button(type)
		container.add(button)
		button.onClick(function(){
			var injectFunction = InspectDevTools.functionOnObject3d		
			injectFunction(addObjectPerLigth, [type]);
		})
	})
	
	
	function addObjectPerLigth(parentObject3d, type){
		if( type === "PointLight" ){
			var color = 0xffffff;
			var intensity = 1;
			var distance = 0;

			var light = new THREE.PointLight( color, intensity, distance );
		}else if( type === 'SpotLight' ){
			var color = 0xffffff;
			var intensity = 1;
			var distance = 0;
			var angle = Math.PI * 0.1;
			var exponent = 10;

			var light = new THREE.SpotLight( color, intensity, distance, angle, exponent );
			light.name = 'SpotLight ' + ( ++ lightCount );
			light.target.name = 'SpotLight ' + ( lightCount ) + ' Target';
		}else if( type === 'DirectionalLight' ){
			var color = 0xffffff;
			var intensity = 1;
			var distance = 0;
			var angle = Math.PI * 0.1;
			var exponent = 10;

			var light = new THREE.DirectionalLight( color, intensity, distance, angle, exponent );
			light.name = 'DirectionalLight ' + ( ++ lightCount );
			light.target.name = 'DirectionalLight ' + ( lightCount ) + ' Target';
		}else if( type === 'HemisphereLight' ){
			var skyColor = 0x00aaff;
			var groundColor = 0xffaa00;
			var intensity = 1;

			var light = new THREE.HemisphereLight( skyColor, groundColor, intensity );
			light.position.set( 1, 1, 1 )
		}else if( type === 'AmbientLight' ){
			var color = 0x222222;

			var light = new THREE.AmbientLight( color );
		}else {
			console.assert(false)
		}


		var parent = Inspect3js.getSelected()
		parent.add(light)
		
		updateMaterials()
		return
		
		function updateMaterials() {
			scene.traverse( function ( object3d ) {
				
				if( object3d.material === undefined )	return

				object3d.material.needsUpdate = true;

				if ( object3d.material instanceof THREE.MeshFaceMaterial ) {
					for ( var i = 0; i < object3d.material.materials.length; i ++ ) {
						object3d.material.materials[ i ].needsUpdate = true;
					}
				}
			} );
		}
	}
})()


	container.dom.appendChild( document.createElement('br') )

;(function(){
	var button = new UI.Button('delete')
	container.add(button)
	button.onClick(function(){
		var injectFunction = InspectDevTools.functionOnObject3d		
		injectFunction(function(object3d){
			object3d.parent.remove(object3d)
		});
		editor.signals.objectSelected.dispatch(null)
	})	
})()

;(function(){
	var button = new UI.Button('clone')
	container.add(button)
	button.onClick(function(){
		var injectFunction = InspectDevTools.functionOnObject3d		
		injectFunction(function(object3d){
			object3d.parent.add(object3d.clone())
		});
	})	
})()

	return container
};
