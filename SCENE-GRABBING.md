# SCENE GRABBING
- hook THREE.WebGLRenderer.prototype.render(scene, camera)
- hook requestAnimationFrame
  - allow you to count the number of render


### how to test if it works
- write a test code
- contentscript within a bookmarlet
- if it works, backport the whole system in three.js inspector
