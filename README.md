### About Detection
- on panel load, have a splash with a button which captureScene
- have a capture button on the UI in the open panel
- have captureScene to clear the treeView to start with
  - ```InspectedWin3js.postMessageToPanel('clearObject3DTreeView')```
  - it works
- it should provide a consitent basic detection system

### Cleanup

- reimport the raf throttler
  - thus you got interest in reimporting the config too
- when to switch to threejs-doctor and to update threejs-inspector
  - When detection + raf throttler is done
- address the three.js detection mechanism. currently manual with button
- what to do when the inspected page is reloaded ?

- test on most recent version of three.js
- use object3dJson var name when applicable
- test on alexandra mac book air
  - configure it for coding
  - iterm + git + github auth rsa key + screen switch
  - seems to work

### Detection of the three.js in the page
- see about the splash screen
- we want mainly the scene for now
  - we can provide a explicit API for that. the inspectedWin.* API will do it
- this inspectedWin.sendSceneToPanel(scene) API... can be used to 
- address the three.js detection mechanism. currently manual with button
  - no emergency
  - you dont know any good solution for now
  - what about binding THREE.WebGLRenderer.prototype.render ?
  - what i want is periodic update of the scene.
    - then i update the treeview in the panel
  - so we got t

### TODO



- DONE split the injected_script.js
  - how to handle the detection of the previous inclusion ?
- DONE bring material/geometry panel. then clean up
- FIXED there are 3 versions of font awesome
- DONE port this injection mechanism. to enable the action from panel to object3d properties
```
var injectProperty = InspectDevTools.propertyOnObject3d
var injectFunction = InspectDevTools.functionOnObject3d
```
- DONE port the selection mechanism
  - inspectedWin.selected = object3dJson
  - panelWin.editor.selected = object3dJson
  - editor.signals.object3dSelected, ui panels listens on that
  - ui panels for object3d, material, geometry
  
