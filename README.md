# Three.js Inspector
three.js inspector is an extension for chrome devtool. It allows you to inspect
the three.js scene in a web page. 
You can install [three.js Inspector](https://chrome.google.com/webstore/detail/threejs-inspector/dnhjfclbfhcbcdfpjaeacomhbdfjbebi)
from chrome webstore.

It is a fork from
[WebGL GLSL Shader Editor Extension for Google Chrome](https://github.com/spite/ShaderEditorExtension)
by the excelent @thespite. Check it out! 

## History 1.2.8
- added support material.magFilter and material.minFilter
  - http://127.0.0.1:8000/examples/webgl_materials_texture_filters.html
- added support for spriteMaterial.rotation
- support for material.uniforms texture and integer
- handled material.bumpScale
- pointCloudmaterial material.size/material.sizeAttenuation
- able to fully stop requestAnimationFrame in setting tabs

## History 1.2.7
- started refactoring the scene grabbing
- added requestAnimationFrame force rate in setting tabs
- added 'purge obsolete objects' in treeview popup menu - better scene capture
- source cleanup

## History 1.2.5
- added a popup menu in scene-brower
  - http://127.0.0.1:8000/examples/webgl_materials_bumpmap_skin.html
- ability to manually content scripts - more robust
- improved tab css for visibility
- added 'inject in three.js' in treeview popup menu - better scene capture
  - find a demo without working well 
- massive cleanup of the scene capture code
- added range limit to material.opacity
- added ability to create a texture from material popup menu
- added export-in-console for material and geometry
- added upload support for texture
- added dragdrop support for texture
- added "about" tab
- added texture.sourceFile it is now possible to change texture
  - texture needs to be on a CORS server
- added 'visibility toggle'/'export to console' and better css on treeview
- added an object is now relative to the selected parent
  - better controls over the scene tree when you build something
- added support for face material
  - take the lightmap example in three.js
- added texture.anisotropy
  - take the anisotropy demo
- added texture handling
  - demo: move texture repeat + offset + wrapS/wrapT. find a good demo for that
- added help button linking to three.js documentation
  - good for learning
- added object3d.castShadow / receiveShadow
  - http://i.imgur.com/IGVLPBB.gif
- added material.shadding
  - http://127.0.0.1:8000/examples/webgl_lights_hemisphere.html
  - http://i.imgur.com/kJl6thS.gif
- added left/right/top/bottom for ortho camera
- fixed Sprites crash + castShadow support
- added viewVertices + viewFaces in geometry menu
- added a Config.js and save autoRefresh
- added bounding sphere in geometry
- added linewidth, dashSize in material
  - demo of a line example
- added auto refresh to on by default
- fixed bug in case of typedGeometry, PointCloud
- 'export in console' in object3d inspector popup menu
  - demo: show an object, move it thru inspector, then export it, and change $3js position in console
- implemented a tab for setting
  - show it
- added autoRefresh setting to periodically refresh the inspector
  - demo with turning cube
  - http://imgur.com/XZdWjt3
- added the 'no' panels for a better visibility in the UI
  - simply show it with a object3d selected and without
- uniform live tuning for shader material
  - demo bubble fresnel
- implemented better number tuning with the mouse. 
  - if shift is pressed, it goes 10 times faster
  - it meta is pressed, it goes 100 times faster
  - if shift+meta are pressed, it goes 1000 times faster
