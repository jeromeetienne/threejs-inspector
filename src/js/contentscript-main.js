/**
 * code to inject into the inspected page
 */
function injectMain() {
	
	
	
	
var Inspect3js	= Inspect3js	|| {}

window.Inspect3js	= Inspect3js

//////////////////////////////////////////////////////////////////////////////////
//		Wrap function with postCall
//////////////////////////////////////////////////////////////////////////////////
Inspect3js.overloadPostProcess	= function( originalFunction, postProcessFct ) {
	return function() {
		var returnValue = originalFunction.apply( this, arguments );
		returnValue = postProcessFct.apply( this, [ returnValue, arguments ] ) || returnValue;
		return returnValue;
	}
}


//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////
Inspect3js._classNames = [];

Inspect3js.getClassName		= function( object ) {
	for( var j in Inspect3js._classNames ) {
		if( object instanceof THREE[ Inspect3js._classNames[ j ] ] ) {
			var result = Inspect3js._classNames[j]
			return result;
		}
	}

	debugger; // dafuc?
}	
/**
 * extract all constructors functions name from three.js
 */
Inspect3js.extractClassNames	= function() {
	for( var property in THREE ){
		if( typeof THREE[ property ] !== 'function' )	continue
		// NOTE: unshift is key here to get proper inheritance
		// - https://github.com/spite/ThreeJSEditorExtension/issues/9
		Inspect3js._classNames.unshift( property );
	}
}




//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////
Inspect3js.reccursiveAddObject	= reccursiveAddObject
function reccursiveAddObject( object3d, parent ) {
	
	addObject( object3d, parent );

	object3d.children.forEach( function( child ) {
		reccursiveAddObject( child, object3d  );
	} );

}
function reccursiveRemoveObject( object3d, parent ) {

	removeObject( object3d, parent );

	object3d.children.forEach( function( child ) {
		reccursiveRemoveObject( child, object3d  );
	} );

}

/**
 * adding object
 * @param {THREE.Object3D} object - 
 * @param {THREE.Object3D=} parent [description]
 */
function addObject( object, parent ) {

	objectsCache[ object.uuid ] = object;

	var type = Inspect3js.getClassName( object );
	
	if( parent && ( type === 'PerspectiveCamera' || type === 'OrthographicCamera' ) ) {
		if( Inspect3js.getClassName( parent ) === 'Scene' ) {
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

	//objectsCache[ object.uuid ] = object;

	// var type = Inspect3js.getClassName( object );
	//console.log( '++ Removing Object ' + type + ' (' + object.uuid + ') (parent ' + ( parent?parent.uuid:'' ) + ')' );
	window.postMessage( {
		source	: 'ThreejsEditor', 
		method	: 'removeObject', 
		id	: object.uuid, 
		parentId: parent ? parent.uuid : null
	}, '*');						
}


//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////

Inspect3js.instrumentWebGLRenderer	= function(renderer){
	var previousFunction = renderer.render;
	renderer.render = function(scene, camera) {
		previousFunction.apply( renderer, arguments );
		
		
		// reccursiveAddObject(scene)
		
		window.postMessage({
			source	: 'ThreejsEditor', 
			method	: 'render', 
			sceneId	: scene.uuid, 
			cameraId: camera.uuid
		}, '*');
	}
}
//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////

Inspect3js.instrumentObject	= function(object){
	if( object instanceof THREE.WebGLRenderer ) {
		Inspect3js.instrumentWebGLRenderer( object );			
	}else if( object instanceof THREE.Object3D ) {
		reccursiveAddObject( object );
	}
}

/**
 * instrument instanced objectsCache WebGLRenderer/Object3D in window.*
 * - aka totally ignore any others in closure or elsewhere ...
 */
Inspect3js.instrumentWindowGlobals	= function() {
	var propertiesToIgnore = [ 'webkitStorageInfo', 'webkitIndexedDB' ];

	for( var property in window ) { 
		if( propertiesToIgnore.indexOf( property ) >= 0 ) continue;
		Inspect3js.instrumentObject( window[property] )
	}	
}



//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////
Inspect3js.injectInThreejs	= injectInThreejs
/**
 * Modify three.js to intercept calls
 */
function injectInThreejs() {

	Inspect3js.extractClassNames()

	Inspect3js.instrumentWindowGlobals();

	//////////////////////////////////////////////////////////////////////////////////
	//		THREE.WebGLRenderer
	//////////////////////////////////////////////////////////////////////////////////

	// post process on constructor		
	THREE.WebGLRenderer = Inspect3js.overloadPostProcess( THREE.WebGLRenderer, function() {
		Inspect3js.instrumentWebGLRenderer( this );
	});

	//////////////////////////////////////////////////////////////////////////////////
	//		THREE.Object3D
	//////////////////////////////////////////////////////////////////////////////////

	var oldObject3D = THREE.Object3D;
	// post process on constructor
	THREE.Object3D = Inspect3js.overloadPostProcess( THREE.Object3D, function() {
		addObject( this );
	} );
	// copy prototype
	THREE.Object3D.prototype = oldObject3D.prototype;
	// add all static properties of THREE.Object3D
	for( var j in oldObject3D ) { 
		if( oldObject3D.hasOwnProperty( j ) ) {
			THREE.Object3D[ j ] = oldObject3D[ j ];
		} 
	}

	// post process on object3d.add()
	THREE.Object3D.prototype.add = Inspect3js.overloadPostProcess( THREE.Object3D.prototype.add, function(returnValue, args) {
		var parent = this;
		for( var j = 0; j < args.length; j++ ) {
			var object = args[ j ];
			reccursiveAddObject( object, parent );
		}
	} );

	// post process on object3d.remove()
	THREE.Object3D.prototype.remove = Inspect3js.overloadPostProcess( THREE.Object3D.prototype.remove, function(returnValue, args) {			
		var parent = this;
		for( var j = 0; j < args.length; j++ ) {
			var object = args[ j ];
			reccursiveRemoveObject( object, parent );
		}
	} );
}

//////////////////////////////////////////////////////////////////////////////////
//		handle autoRefresh
//////////////////////////////////////////////////////////////////////////////////

Inspect3js._autoRefreshTimer	= null
Inspect3js.autoRefreshStart	= function(delay){
	if( delay === undefined )	delay	= 0.5 * 1000

	Inspect3js.autoRefreshStop()

	Inspect3js.UISelect(Inspect3js._lastSelectedUuid)

	this._autoRefreshTimer	= setInterval(function(){
		Inspect3js.UISelect(Inspect3js._lastSelectedUuid)
	}, 0.5 * 1000);			
}

Inspect3js.autoRefreshStop	= function(){
	if( this._autoRefreshTimer === null )	return

	clearInterval(this._autoRefreshTimer)
	this._autoRefreshTimer = null
}

//////////////////////////////////////////////////////////////////////////////////
//		Inspect3js.UISelect
//////////////////////////////////////////////////////////////////////////////////

Inspect3js._lastSelectedUuid	= null

Inspect3js.getSelected	= function(){
	var uuid = Inspect3js._lastSelectedUuid
	return this.getObjectByUuid(uuid)
}
Inspect3js.getObjectByUuid	= function(uuid){
	var object = objectsCache[uuid]
	if( object === undefined )	return null
	return object
}	
/**
 * selection in the UI - called from devtools
 * 
 * @param {String} uuid - the selection object.uuid
 */
Inspect3js.UISelect = function( uuid ) {
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


	var object = objectsCache[ uuid ];		

	var data = {
		sniffType: Inspect3js.getClassName(object),

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

		var sniffedType	= Inspect3js.getClassName(geometry)

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
			sniffType	: Inspect3js.getClassName(material),
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
			sniffType	: Inspect3js.getClassName(texture),
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
Inspect3js.ChangeProperty = function( object3dUUID, data ) {
	// console.log('ChangeProperty', data.property, 'to', data.value)
	var object3d = objectsCache[ object3dUUID ];
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
Inspect3js.ChangeObject3dFunction = function( object3dUUID, fct, args ) {
	// console.log('ChangeObject3dFunction', fct.toString(), args)
	var object3d = objectsCache[ object3dUUID ];
	console.assert(object3d instanceof THREE.Object3D)
	var newArgs	= args.slice(0)
	newArgs.unshift(object3d); 
	
	fct.apply(null, newArgs)
}

//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////
var objectsCache = {};
Inspect3js._objectsCache = objectsCache

function checkThreeJs() {
	var isThreejsPresent = (window.THREE && window.THREE.REVISION) ? true : false

	if( isThreejsPresent === false ) {
		console.log('three.js not present', window.THREE.REVISION)
		setTimeout( checkThreeJs, 10 );
		return
	}

	console.log('three.js inpector: Injected in THREE.js', window.THREE.REVISION)
	
	injectInThreejs();
}

checkThreeJs();
//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////

// console.assert(window.__Injected === undefined)
// if( window.__Injected === true )	return

window.__Injected = true;

/** 
 * signal devtool panel that the injection is completed
 */
window.addEventListener( 'load', function(){
	console.log('POST INIT',arguments)
	// window.postMessage({
	// 	source: 'ThreejsEditor', 
	// 	method: 'init'
	// }, '*');

});

setInterval(function(){	
	window.postMessage({
		source: 'ThreejsEditor', 
		method: 'init'
	}, '*');
}, 100)



} // End of the containing function
