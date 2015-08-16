/**
 * code to inject into the inspected page
 */
;(function(){
	
	
/**
 * define content script namespace
 * @type {Object}
 */
window.Inspect3js	= window.Inspect3js	|| {}

//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////
Inspect3js.reccursiveAddObject		= reccursiveAddObject
Inspect3js.reccursiveRemoveObject	= reccursiveRemoveObject
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
	// if( Inspect3js._objectsCache[ object.uuid ] !== undefined ) return
	Inspect3js._objectsCache[ object.uuid ] = object;

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
		object3dUuid: object.uuid, 
		parentUuid: parent ? parent.uuid : null, 
		type: type, 
		label: label }
	, '*');
}

function removeObject( object, parent ) {

	//Inspect3js._objectsCache[ object.uuid ] = object;

	// var type = Inspect3js.getClassName( object );
	//console.log( '++ Removing Object ' + type + ' (' + object.uuid + ') (parent ' + ( parent?parent.uuid:'' ) + ')' );
	window.postMessage( {
		source	: 'ThreejsEditor', 
		method	: 'removeObject', 
		object3dUuid	: object.uuid, 
		parentUuid: parent ? parent.uuid : null
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

/**
 * Modify three.js to intercept calls
 */
Inspect3js.injectInThreejs = function() {
	console.assert( window.THREE !== undefined )

	console.log('three.js inspector: Injected in THREE.js', window.THREE.REVISION)	

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
	for( var property in oldObject3D ) { 
		if( oldObject3D.hasOwnProperty( property ) ) {
			THREE.Object3D[ property ] = oldObject3D[ property ];
		} 
	}

	// post process on object3d.add()
	THREE.Object3D.prototype.add = Inspect3js.overloadPostProcess( THREE.Object3D.prototype.add, function(returnValue, args) {
		var parent = this;
		for( var i = 0; i < args.length; i++ ) {
			var object3d = args[ i ];
			reccursiveAddObject( object3d, parent );
		}
	} );

	// post process on object3d.remove()
	THREE.Object3D.prototype.remove = Inspect3js.overloadPostProcess( THREE.Object3D.prototype.remove, function(returnValue, args) {			
		var parent = this;
		for( var i = 0; i < args.length; i++ ) {
			var object3d = args[ i ];
			reccursiveRemoveObject( object3d, parent );
		}
	} );
}



	
})()
