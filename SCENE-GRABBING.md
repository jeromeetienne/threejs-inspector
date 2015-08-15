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

javascript:(function(){document.body.appendChild(document.createElement('script')).src='http://127.0.0.1:8080/experiments/build/inspect3js.js';})();
