### TODO
- there are 3 versions of font awesome

- port this injection mechanism
```
		var injectProperty = InspectDevTools.propertyOnObject3d;
		var injectFunction = InspectDevTools.functionOnObject3d
```
- port the selection mechanism
- address the three.js detection mechanism. currently manual with button
		
### start inspection of object on click
- onSelect, trigger a function in inspected window
- get the uuid selected
- convert the object3d into json
- send it to the panel
- display the result in panel
- import all the ui for the object in inspect
