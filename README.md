### Cleanup
- split the injected_script.js
  - how to handle the detection of the previous inclusion ?
- test on alexandra mac book air
  - configure it for coding
  - iterm + git + github auth rsa key + screen switch
- address the three.js detection mechanism. currently manual with button
  - no emergency
  - you dont know any good solution for now

- test on most recent version of three.js
- use object3dJson var name when applicable


### TODO



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
  
