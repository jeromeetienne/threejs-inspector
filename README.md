# Three.js Inspector
three.js inspector is an extension for chrome devtool. It allows you to inspect
the three.js scene in a web page. 
You can install [three.js Inspector](https://chrome.google.com/webstore/detail/threejs-inspector/dnhjfclbfhcbcdfpjaeacomhbdfjbebi)
from chrome webstore.

It is a fork from
[WebGL GLSL Shader Editor Extension for Google Chrome](https://github.com/spite/ShaderEditorExtension)
by the excelent @thespite. Check it out! 

## How to be sure the extension find your scene
- export your THREE.Scene as a ```scene``` global variable
  - typically ```window.scene = scene;``` 
- press 'refresh' button to refresh the scene

## How to install three.js inspector locally

You can install the extensions directly from the chrome store

[three.js inspector chrome extension](https://chrome.google.com/webstore/detail/threejs-inspector/dnhjfclbfhcbcdfpjaeacomhbdfjbebi)

copy the repo files to your computer and launch the extension as a developer.
Follow those steps:

- copy the repository files - [zip](https://github.com/jeromeetienne/threejs-inspector/archive/master.zip)
- Goto the Chrome's Extensions page : Settings -> More tools -> Extensions
- Enable Developer Mode
- Click on "Load unpacked extension"...
- Select the folder /src in the checked out project

## History 1.9.7
- recapture the scene automatically if object are added to it
  - overloading Object3D.prototype.add/Object3D.prototype.remove
- Handle large image texture 
  - no more issue with "too long url"

## History 1.9.6
- better detection of the inspected window
  - detect when the inspected window is reloaded, and reinject the script
- added a timer to count the time since the last scene update
- detect when running in production and disable debug feature when not in development
- reenabled shadermaterial with uniforms tuning
- reenable texture image tunning, export+drag drop from desktop

## History 1.9.0

This version is all about a total refactor of the devtools <-> extension part.

the previous version was copied and was quite messy. It had race-conditions issues
during the start. So the extension would not start on some computers. 

i rewrote the whole devtool <-> extension. It is quite a chalenge in itself :)
more details at https://developer.chrome.com/extensions/devtools . 

To give you an idea,
- threejs-inspector needs 4 webpages, and establish messages communication between them.
- It handle 2 javascript VM in the inspected page
- Chosen quote from the docs: "Your message will now flow from the injected script, 
to the content script, to the background script, and finally to the DevTools page." 
  - and this is how every message is going thru all this :)

Yeah definitly, to code a devtools extension could be simpler. i hope this version
will be more manageable. Dont hesitate to report any issue on github.

## History 1.2.9
- better css for inline link to three.js help
- added console.dir when exporting objects to console
- added export-to-console for texture
- added support for texture in uniforms

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

### How To Release
- search /src for the previous version number
- change the version number to even patch number e.g. 1.2.2
- do ```make packageExtension``` to build the src.zip
- upload the src.zip at https://chrome.google.com/webstore/developer/edit/dnhjfclbfhcbcdfpjaeacomhbdfjbebi?hl=en
- click 'Publish Changes'
- do ```make cleanExtension``` to build the src.zip
- make the patch number as odd, by replacing all instance
- add a line in README.md Changelog
