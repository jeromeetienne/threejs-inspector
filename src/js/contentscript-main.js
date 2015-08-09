/**
 * code to inject into the inspected page
 */
function injectMain() {
	// console.assert(window.__Injected === undefined)
	// if( window.__Injected === true )	return
	
	window.__Injected = true;

	/** 
	 * signal devtool panel that the injection is completed
	 */
	window.addEventListener( 'load', function(){
		console.log('POST INIT',arguments)
		window.postMessage({
			source: 'ThreejsEditor', 
			method: 'init'
		}, '*');
	});

	//////////////////////////////////////////////////////////////////////////////////
	//		Wrap function with postCall
	//////////////////////////////////////////////////////////////////////////////////
	function overloadPostProcess( originalFunction, postProcessFct ) {
		return function() {
			var returnValue = originalFunction.apply( this, arguments );
			returnValue = postProcessFct.apply( this, [ returnValue, arguments ] ) || returnValue;
			return returnValue;
		}
	}
	
	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
	var generateUUID = ( function() {
		// http://www.broofa.com/Tools/Math.uuid.htm

		var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split( '' );
		var uuid = new Array( 36 );
		var rnd = 0, r;

		return function () {

			for ( var i = 0; i < 36; i ++ ) {

				if ( i == 8 || i == 13 || i == 18 || i == 23 ) {

					uuid[ i ] = '-';

				} else if ( i == 14 ) {

					uuid[ i ] = '4';

				} else {

					if ( rnd <= 0x02 ) rnd = 0x2000000 + ( Math.random() * 0x1000000 ) | 0;
					r = rnd & 0xf;
					rnd = rnd >> 4;
					uuid[ i ] = chars[ ( i == 19 ) ? ( r & 0x3 ) | 0x8 : r ];

				}
			}

			return uuid.join( '' );

		};

	} )();

	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
	var threejsClassNames = [];
	function sniffType( object ) {

		for( var j in threejsClassNames ) {
			if( object instanceof THREE[ threejsClassNames[ j ] ] ) {
				var result = threejsClassNames[j]
				return result;
			}
		}

		debugger; // dafuc?

	}
	/**
	 * extract all constructors functions name from three.js
	 */
	function extractTypesFromThreejs() {
		for( var property in THREE ){
			if( typeof THREE[ property ] !== 'function' )	continue
			// NOTE: unshift is key here to get proper inheritance
			// - https://github.com/spite/ThreeJSEditorExtension/issues/9
			threejsClassNames.unshift( property );
		}
	}
	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
	var objects = {};
	
	function checkThreeJs() {
		var isThreejsPresent = (window.THREE && window.THREE.REVISION) ? true : false

		if( isThreejsPresent === false ) {
			console.log('three.js not present', window.THREE.REVISION)
			setTimeout( checkThreeJs, 10 );
			return
		}

		console.log('three.js inpector: Injected in THREE.js', window.THREE.REVISION)
		
		instrument();
	}

	checkThreeJs();

	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
	function processAddObject( object, parent ) {

		if( !object.uuid ) object.uuid = generateUUID();
		
		addObject( object, parent );

		object.children.forEach( function( child ) {
			if( child instanceof THREE.Object3D ) {
				processAddObject( child, object  );
			}
		} );

	}

	function processRemoveObject( object, parent ) {

		removeObject( object, parent );

		object.children.forEach( function( child ) {
			if( child instanceof THREE.Object3D ) {
				processRemoveObject( child, object  );
			}
		} );

	}

	function instrumentRendererRender( renderer ) {

		var oldRender = renderer.render;
		renderer.render = function() {
			oldRender.apply( renderer, arguments );

			var scene = arguments[ 0 ];
			var camera = arguments[ 1 ];
			window.postMessage({
				source: 'ThreejsEditor', 
				method: 'render', 
				sceneId: scene.uuid, 
				cameraId: camera.uuid
			}, '*');
		}
	}

	/**
	 * instrument instanced objects WebGLRenderer/Object3D in window.*
	 * - aka totally ignore any others in closure or elsewhere ...
	 */
	function instrumentLate() {

		var propertiesToIgnore = [ 'webkitStorageInfo', 'webkitIndexedDB' ];

		for( var property in window ) { 
			if( propertiesToIgnore.indexOf( property ) >= 0 ) continue;
			if( window[ property ] instanceof THREE.WebGLRenderer ) {
				// console.log( '++ Existing WebGLRenderer' );
				var object = window[ property ];
				instrumentRendererRender( object );			
			}
		 	if( window[ property ] instanceof THREE.Object3D ) {
				// console.log( '++ Existing Object3D' );
				var object = window[ property ];
				
				processAddObject( object );
			}
		}
	
	}

	/**
	 * adding object
	 * @param {THREE.Object3D} object - 
	 * @param {THREE.Object3D=} parent [description]
	 */
	function addObject( object, parent ) {

		var type = sniffType( object );
		objects[ object.uuid ] = object;
		
		if( parent && ( type === 'PerspectiveCamera' || type === 'OrthographicCamera' ) ) {
			if( sniffType( parent ) === 'Scene' ) {
				return;
			}
		}
		
		var label = type + (object.name ? ' - '+object.name: '')

		// console.log( '++ Adding Object ' + type + ' (' + object.uuid + ') (parent ' + ( parent?parent.uuid:'' ) + ')' );
		window.postMessage( { 
			source: 'ThreejsEditor', 
			method: 'addObject', 
			id: object.uuid, 
			parentId: parent ? parent.uuid : null, 
			type: type, 
			label: label }
		, '*');
	}

	function removeObject( object, parent ) {

		//objects[ object.uuid ] = object;

		// var type = sniffType( object );
		//console.log( '++ Removing Object ' + type + ' (' + object.uuid + ') (parent ' + ( parent?parent.uuid:'' ) + ')' );
		window.postMessage( {
			source	: 'ThreejsEditor', 
			method	: 'removeObject', 
			id	: object.uuid, 
			parentId: parent ? parent.uuid : null
		}, '*');						
	}



	/**
	 * Modify three.js to intercept calls
	 */
	function instrument() {

		extractTypesFromThreejs();
		// console.log( 'INSTRUMENT LATE' )
		instrumentLate();
		// console.log( 'DONE' );

		THREE.WebGLRenderer = overloadPostProcess( THREE.WebGLRenderer, function() {
			// console.log( '++ NEW WebGLRenderer' );
			instrumentRendererRender( this );
		} );
		
		var oldObject3D = THREE.Object3D;
		THREE.Object3D = overloadPostProcess( THREE.Object3D, function() {
			// console.log( '++ NEW Object3D' );
			var object = this;
			if( !object.uuid ) object.uuid = generateUUID();
			addObject( object );
		} );
		THREE.Object3D.prototype = oldObject3D.prototype;
		for( var j in oldObject3D ) { 
			if( oldObject3D.hasOwnProperty( j ) ) {
				THREE.Object3D[ j ] = oldObject3D[ j ];
			} 
		}

		THREE.Object3D.prototype.add = overloadPostProcess( THREE.Object3D.prototype.add, function() {
			
			var parent = this;
			if( !parent.uuid ) parent.uuid = generateUUID();
			for( var j = 0; j < arguments[ 1 ].length; j++ ) {
				// console.log( '++ Object3D.add' );
				var object = arguments[ 1 ][ j ];
				if( !object.uuid ) object.uuid = generateUUID();
				processAddObject( object, parent );
			}

		} );

		THREE.Object3D.prototype.remove = overloadPostProcess( THREE.Object3D.prototype.remove, function() {
			
			var parent = this;
			for( var j = 0; j < arguments[ 1 ].length; j++ ) {
				// console.log( '++ Object3D.remove' );
				var object = arguments[ 1 ][ j ];
				processRemoveObject( object, parent );
			}

		} );

		THREE.WebGLRenderer.prototype.render = overloadPostProcess( THREE.WebGLRenderer.prototype.render, function() {

			processAddObject( object, parent );			

		} );

	}
	
	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
	
	window.injected3jsInspect = {}
	
	//////////////////////////////////////////////////////////////////////////////////
	//		handle autoRefresh
	//////////////////////////////////////////////////////////////////////////////////
	
	injected3jsInspect._autoRefreshTimer	= null
	injected3jsInspect.autoRefreshStart	= function(delay){
		if( delay === undefined )	delay	= 0.5 * 1000

		injected3jsInspect.autoRefreshStop()
	
		injected3jsInspect.UISelect(injected3jsInspect._lastSelectedUuid)
	
		this._autoRefreshTimer	= setInterval(function(){
			injected3jsInspect.UISelect(injected3jsInspect._lastSelectedUuid)
		}, 0.5 * 1000);			
	}
	
	injected3jsInspect.autoRefreshStop	= function(){
		if( this._autoRefreshTimer === null )	return

		clearInterval(this._autoRefreshTimer)
		this._autoRefreshTimer = null
	}
	
	//////////////////////////////////////////////////////////////////////////////////
	//		injected3jsInspect.UISelect
	//////////////////////////////////////////////////////////////////////////////////
	
	injected3jsInspect._lastSelectedUuid	= null
	
	injected3jsInspect.getSelected	= function(){
		var uuid = injected3jsInspect._lastSelectedUuid
		return this.getObjectByUuid(uuid)
	}
	injected3jsInspect.getObjectByUuid	= function(uuid){
		var object = objects[uuid]
		if( object === undefined )	return null
		return object
	}	
	/**
	 * selection in the UI - called from devtools
	 * 
	 * @param {String} uuid - the selection object.uuid
	 */
	injected3jsInspect.UISelect = function( uuid ) {
		// console.log('UISelect', uuid)
	
		this._lastSelectedUuid	= uuid
	
		// used to deselect
		if( uuid === null ){
			window.postMessage( {
				source: 'ThreejsEditor', 
				method: 'objectSelected', 
				id: null, 
			}, '*');
			return
		}
	
	
		var object = objects[ uuid ];		

		var data = {
			sniffType: sniffType(object),
	
			uuid: object.uuid,
			id: object.id,
			name: object.name,
			visible: object.visible,
	
			position: { x: object.position.x, y: object.position.y, z: object.position.z },
			rotation: { x: object.rotation.x, y: object.rotation.y, z: object.rotation.z },
			scale: { x: object.scale.x, y: object.scale.y, z: object.scale.z },
			
			castShadow : object.castShadow,
			receiveShadow : object.receiveShadow,
		}


		copyLightProperties(object, data)
		copyCameraProperties(object, data)
		copyGeometryProperties(object.geometry, data)

		if( object.material )	data.material = materialToJSON(object.material)
	
		window.postMessage( {
			source: 'ThreejsEditor', 
			method: 'objectSelected', 
			id: uuid, 
			data: JSON.stringify( data )
		}, '*');

		return
		

		function copyLightProperties(object, data){
			// handle light properties
			if(object.color !== undefined )		data.color	= object.color.getHexString()
			if(object.intensity !== undefined )	data.intensity	= object.intensity
			if(object.distance !== undefined )	data.distance	= object.distance
			if(object.angle !== undefined )		data.angle	= object.angle
			if(object.exponent !== undefined )	data.exponent	= object.exponent

			if(object.groundColor !== undefined )	data.groundColor	= object.groundColor.getHexString()
		}
		
		function copyCameraProperties(object, data){
			// handle camera properties
			if(object.fov !== undefined )	data.fov	= object.fov
			if(object.near !== undefined )	data.near	= object.near
			if(object.far !== undefined )	data.far	= object.far

			// OrthographicCamera
			if(object.left !== undefined )	data.left	= object.left
			if(object.right !== undefined )	data.right	= object.right
			if(object.top !== undefined )	data.top	= object.top
			if(object.bottom !== undefined)	data.bottom	= object.bottom
		}
		

		function copyGeometryProperties(geometry, data){

			if( geometry === undefined )	return

			var sniffedType	= sniffType(geometry)

			data.geometry = {
				sniffType	: sniffedType,
				uuid		: geometry.uuid,
				name		: geometry.name,
			}
			
			if( geometry.vertices !== undefined )	data.geometry.verticesLength = geometry.vertices.length
			if( geometry.faces !== undefined )	data.geometry.facesLength = geometry.faces.length
			if( geometry.faces !== undefined )	data.geometry.facesLength = geometry.faces.length

			if( geometry.attributes !== undefined ){
				
				if( geometry.attributes.position !== undefined ) data.geometry.positionLength = geometry.attributes.position.array.length
				if( geometry.attributes.normal !== undefined ) data.geometry.normalLength = geometry.attributes.normal.array.length
				if( geometry.attributes.color !== undefined ) data.geometry.colorLength = geometry.attributes.color.array.length
				if( geometry.attributes.tangent !== undefined ) data.geometry.tangentLength = geometry.attributes.tangent.array.length
				if( geometry.attributes.index !== undefined ) data.geometry.indexLength = geometry.attributes.index.array.length
				
			}

			if( geometry.boundingSphere !== null ){
				data.geometry.boundingSphere = {
					center: {
						x: geometry.boundingSphere.center.x,
						y: geometry.boundingSphere.center.y,
						z: geometry.boundingSphere.center.z
					},
					radius: geometry.boundingSphere.radius,
				}
			}

			if( geometry.parameters ){
				data.geometry.parameters = {}
				if( sniffedType === 'TorusKnotGeometry' ){
					data.geometry.parameters	= {
						radius	: geometry.parameters.radius,
						tube	: geometry.parameters.tube,
						radialSegments	: geometry.parameters.radialSegments,
						tubularSegments	: geometry.parameters.tubularSegments,
					};
				}else if( sniffedType === 'SphereGeometry' ){
					data.geometry.parameters.radius	= geometry.parameters.radius
					data.geometry.parameters.widthSegments	= geometry.parameters.widthSegments
					data.geometry.parameters.heightSegments	= geometry.parameters.heightSegments
				}
			}			
		}
		function materialToJSON(material){
			if( material === null )	return undefined
			
			var data = {
				sniffType	: sniffType(material),
				uuid		: material.uuid,
			}
			if( material.name !== undefined )		data.name	= material.name

			if( material.visible !== undefined )		data.visible	= material.visible
			if( material.depthTest !== undefined )		data.depthTest	= material.depthTest
			if( material.depthWrite !== undefined )		data.depthWrite	= material.depthWrite
			if( material.alphaTest !== undefined )		data.alphaTest	= material.alphaTest
			
			// texture
			if( material.map !== undefined )		data.map	= textureToJSON(material.map)
			if( material.bumpMap !== undefined )		data.bumpMap	= textureToJSON(material.bumpMap)
			if( material.bumpScale !== undefined )		data.bumpScale	= material.bumpScale
			
			// colors
			if( material.color !== undefined )		data.color	= material.color.getHexString()
			if( material.emissive !== undefined )		data.emissive	= material.emissive.getHexString()
			if( material.specular !== undefined )		data.specular	= material.specular.getHexString()
			if( material.shininess !== undefined )		data.shininess	= material.shininess
			
			// wireframe
			if( material.wireframe !== undefined )		data.wireframe	= material.wireframe
			if( material.wireframeLinewidth !== undefined )	data.wireframeLinewidth	= material.wireframeLinewidth

			if( material.opacity !== undefined )		data.opacity	= material.opacity
			if( material.transparent !== undefined)		data.transparent= material.transparent
			if( material.side !== undefined )		data.side	= material.side
			if( material.shading !== undefined )		data.shading	= material.shading
			if( material.blending !== undefined )		data.blending	= material.blending
			
			// shader material
			if( material.fragmentShader !== undefined )	data.fragmentShader	= material.fragmentShader
			if( material.vertexShader !== undefined )	data.vertexShader	= material.vertexShader
			if( material.uniforms !== undefined ){
				data.uniforms	= {}
				Object.keys(material.uniforms).forEach(function(name){
					var uniform = material.uniforms[name]
					if( uniform.type === 'f' ){
						data.uniforms[name]	= {
							type : uniform.type,
							value : uniform.value,
						}
					}else if( uniform.type === 'v2' ){
						data.uniforms[name]	= {
							type : uniform.type,
							value : {
								x : uniform.value.x,
								y : uniform.value.y,
							}
						}
					}else if( uniform.type === 'v3' ){
						data.uniforms[name]	= {
							type : uniform.type,
							value : {
								x : uniform.value.x,
								y : uniform.value.y,
								z : uniform.value.z,
							}
						}
					}else if( uniform.type === 'c' ){
						data.uniforms[name]	= {
							type : uniform.type,
							value : uniform.value.getHexString(),
						}
					}
				})
			}
			
			// line material
			if( material.linewidth !== undefined )	data.linewidth = material.linewidth
			if( material.dashSize !== undefined )	data.dashSize = material.dashSize

			// handle face material
			if( material.materials !== undefined ){
				data.materials	= []
				material.materials.forEach(function(material, index){
					data.materials.push(  materialToJSON(material) )
				})
			}
			
			// console.log('materialToJSON', data)
			return data
		}
		function textureToJSON(texture){
			if( texture === null )	return undefined
			
			var data = {
				sniffType	: sniffType(texture),
				uuid		: texture.uuid,
				name		: texture.name,
			}

			if(texture.offset !== undefined)	data.offset	= {x: texture.offset.x, y: texture.offset.y}
			if(texture.repeat !== undefined)	data.repeat	= {x: texture.repeat.x, y: texture.repeat.y}
			
			if(texture.wrapS !== undefined )	data.wrapS	= texture.wrapS
			if(texture.wrapT !== undefined )	data.wrapT	= texture.wrapT

			if(texture.sourceFile !== undefined ){
				var aDomElement = document.createElement('a')
				aDomElement.href = texture.sourceFile
				data.sourceFile	= aDomElement.href
			}
			
			if(texture.anisotropy !== undefined )	data.anisotropy	= texture.anisotropy
			
			// console.log('textureToJSON', data)
			return data
		}
	}
	
	
	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Change a property in a object - called from devtool panel 
	 * 
	 * @param {String} id   - object uid
	 * @param {String} data - property name e.g. "position.x"
	 */
	injected3jsInspect.ChangeProperty = function( object3dUUID, data ) {
		// console.log('ChangeProperty', data.property, 'to', data.value)
		var object3d = objects[ object3dUUID ];
		var curObject = object3d;
		
		var fields = data.property.split( '.' );
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
				if( indexInArray === -1 )	curObject[ fieldName ] = data.value;
				else 				curObject[ fieldName ][indexInArray] = data.value;
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
	injected3jsInspect.ChangeObject3dFunction = function( object3dUUID, fct, args ) {
		// console.log('ChangeObject3dFunction', fct.toString(), args)
		var object3d = objects[ object3dUUID ];
		console.assert(object3d instanceof THREE.Object3D)
		var newArgs	= args.slice(0)
		newArgs.unshift(object3d); 
		
		fct.apply(null, newArgs)
	}
}
