# About the UI
- this is all taken from [three.js editor](http://threejs.org/editor) ui. thanks for doing the hard work :)
- on top of this, three.js inspector added a [layer for each type of row](https://github.com/jeromeetienne/threejs-inspector/tree/master/src/editor-libs/ui.rows)
  - the ui.js cover the atom type (number, button, text etc..) but not the row levels
  - currently in the editor, the code for each type of row (color, texture, vector3) is duplicated
  - to avoid this duplication allows better refactoring
    - see the texture row for example. it handles the repeat/offset/wrapST. 
    - it has upload texture and even handles drag/drop from desktop
- it implement tabs
  - it is well used for the object3d/material/geometry triplet
  - in the editor, we end up with a 'too long' panel. we scroll it all the time
  - to put object3d/geometry/material in tabs like the inspector, make it easier 
- more details were added here and there
  - when dragging on number support shift to 10-fold, meta to 100-fold, shift+meta for 1000-fold
  - awesome icon for button

i likely forget other stuff. but the good part is that most of it is directly compatible
with the three.js editor. I forked it twice already (thanks again :)). 
i believe the modification are inline with the spirit of the editor.

if we backport that to the editor, we would end up with 
- a better UI (thanks to the tabs+texture)
- a cleaner code (as we reduce duplication of the row code)
- a richer tool to design the ui of the future version of the editor
