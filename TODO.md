### TODO
- add a 'NO SCENE' in the left panel
  - how to know there are no scene ?
- add a message counter in the source
  - apparently the update are super slow...
  - maybe there are a lot of message shared between window
  - if so, one can reduce the number of message by packing them together
- on scene refresh, be sure the inspected object3d is still present
  - if so update it
- make it run in http://threejs.org page
  - window.frames[0].frameElement.contentWindow.THREE
- DONE find an automatic way to identify when you run in -dev or in prod
  - change things based on it... 
  - simple principle: even patch number are dev version, odd patch number
  - maybe thanks to the url ?
- DONE add the date in the three.js inspector

### old TODO
- bug in treeview
  - it is does empty on http://127.0.0.1:3000/examples/webgl_geometry_cube.html
  - debug treeView.empty() in standalone page
- check how the previous extension is doing the detection
  - see what you can learn from it
- remove the debug console.log when releasing
- if scene isnt found, notify it with an alert in inspected window

### About detection
- on page reload, test if can inspect scene
- on panel show, test if can inspect scene
- on button press, test if can inspect scene
- on timer interval, test if can inspect scene
