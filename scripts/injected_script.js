function injected_script(){

        // make sure it is loaded only once
        if( window.InspectedWin3js !== undefined ){
                console.log('in injected_script.js: already injected, bailing out')
                return                
        }

        console.log('in injected_script.js: running start')

        //////////////////////////////////////////////////////////////////////////////////
        //                detection
        //////////////////////////////////////////////////////////////////////////////////
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
                var dataJson = {
                        uuid    : object3d.uuid,
                        name    : object3d.name,

                        className: InspectedWin3js.getThreeJSClassName(object3d),                        
                        parentUuid : object3d.parent ? object3d.parent.uuid : null,
                        childrenUuid: [],

        		visible: object3d.visible,

        		position: { x: object3d.position.x, y: object3d.position.y, z: object3d.position.z },
        		rotation: { x: object3d.rotation.x, y: object3d.rotation.y, z: object3d.rotation.z },
        		scale: { x: object3d.scale.x, y: object3d.scale.y, z: object3d.scale.z },
		
        		castShadow : object3d.castShadow,
        		receiveShadow : object3d.receiveShadow,
                }
                // populate dataJson.childrenUuid
                object3d.children.forEach(function(child){
                        dataJson.childrenUuid.push(child.uuid)
                })
                

        	copyLightProperties(object3d, dataJson)
        	copyCameraProperties(object3d, dataJson)
        	copyGeometryProperties(object3d.geometry, dataJson)
                // 
        	if( object3d.material )	dataJson.material = materialToJSON(object3d.material)
                
                // return the dataJson
                return dataJson
                
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

        		var className	= InspectedWin3js.getThreeJSClassName(geometry)

        		data.geometry = {
        			className	: className,
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
        			if( className === 'TorusKnotGeometry' ){
        				data.geometry.parameters	= {
        					radius	: geometry.parameters.radius,
        					tube	: geometry.parameters.tube,
        					radialSegments	: geometry.parameters.radialSegments,
        					tubularSegments	: geometry.parameters.tubularSegments,
        				};
        			}else if( className === 'SphereGeometry' ){
        				data.geometry.parameters.radius	= geometry.parameters.radius
        				data.geometry.parameters.widthSegments	= geometry.parameters.widthSegments
        				data.geometry.parameters.heightSegments	= geometry.parameters.heightSegments
        			}
        		}			
        	}
        	function materialToJSON(material){
        		if( material === null )	return undefined
        		
        		var data = {
        			className	: InspectedWin3js.getThreeJSClassName(material),
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
        		if( material.normalMap !== undefined )		data.normalMap	= textureToJSON(material.normalMap)
        		if( material.normalScale !== undefined )	data.normalScale= {x: material.normalScale.x, y: material.normalScale.y}
        		
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
        		
        		// point SpriteMaterial
        		if( material.rotation !== undefined )		data.rotation	= material.rotation
        		// point cloud mateiral
        		if( material.size !== undefined )		data.size	= material.size
        		if( material.sizeAttenuation !== undefined )	data.sizeAttenuation	= material.sizeAttenuation

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
        				}else if( uniform.type === 'i' ){
        					data.uniforms[name]	= {
        						type : uniform.type,
        						value : uniform.value,
        					}
        					console.log('uniform', name, data.uniforms[name])
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
        				}else if( uniform.type === 't' ){
        					data.uniforms[name]	= {
        						type : uniform.type,
        						value : textureToJSON(uniform.value),
        					}
        				}else{
        					// console.warn('uniform type', uniform.type, 'not handled.')
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
        			className	: InspectedWin3js.getThreeJSClassName(texture),
        			uuid		: texture.uuid,
        			name		: texture.name,
        		}

        		if(texture.offset !== undefined)	data.offset	= {x: texture.offset.x, y: texture.offset.y}
        		if(texture.repeat !== undefined)	data.repeat	= {x: texture.repeat.x, y: texture.repeat.y}
        		
        		if(texture.wrapS !== undefined )	data.wrapS	= texture.wrapS
        		if(texture.wrapT !== undefined )	data.wrapT	= texture.wrapT
        		
        		if(texture.magFilter !== undefined )	data.magFilter	= texture.magFilter
        		if(texture.minFilter !== undefined )	data.minFilter	= texture.minFilter

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
        
        InspectedWin3js.selectUuid = function(uuid){
                console.log('in injected_script.js: selectUuid', uuid)
                
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
        InspectedWin3js.ChangeObject3dFunction = function( object3dUUID, fct, args ){
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
