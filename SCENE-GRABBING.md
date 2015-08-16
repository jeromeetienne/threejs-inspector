# SCENE GRABBING
- hook THREE.WebGLRenderer.prototype.render(scene, camera)
- hook requestAnimationFrame
  - allow you to count the number of render


### how to test if it works
- write a test code
  - put the tree in a json object
- contentscript within a bookmarlet
  - see http://stackoverflow.com/questions/106425/load-external-js-from-bookmarklet
- if it works, backport the whole system in three.js inspector
- provide a .js to include just after you load the three.js
  - cooperating with the author of the page

---
# Notes
- currently there is two sidebars
- the left with object selector
- the right with the inspector

## How to present the selector
- able to select renderer
  - renderer isnt an object3d. 
  - currently the item sidebar assume UISelect will give a object3d
- on selector, you pass all renderings info at the root
- if an object got no parent for a while, remove it
- 

## What can be selected
