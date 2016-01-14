### TODO
- bring material/geometry panel. then clean up

- port this injection mechanism. to enable the action from panel to object3d properties
```
var injectProperty = InspectDevTools.propertyOnObject3d
var injectFunction = InspectDevTools.functionOnObject3d
```
- port the selection mechanism
  - inspectedWin.selected = object3dJson
  - panelWin.editor.selected = object3dJson
  - editor.signals.object3dSelected, ui panels listens on that
  - ui panels for object3d, material, geometry
  
- address the three.js detection mechanism. currently manual with button
  - no emergency
  - you dont know any good solution for now
		
### Later
- there are 3 versions of font awesome
