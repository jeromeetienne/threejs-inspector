### Cleanup
- use object3dJson when applicaable
- split the injected_script.js
- there are 3 versions of font awesome


### TODO
- bring material/geometry panel. then clean up
- address the three.js detection mechanism. currently manual with button
  - no emergency
  - you dont know any good solution for now



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
  
