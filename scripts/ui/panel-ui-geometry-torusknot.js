/**
 * Handle panel for object3d
 *
 * @constructor
 */
var PanelGeometryTorusKnot	= function(object3d){
	
	var signals	= editor.signals

	var container	= new UI.Panel()
	
	//////////////////////////////////////////////////////////////////////////////////
	//		handle tab-geometry
	//////////////////////////////////////////////////////////////////////////////////

	container.add( new UI.HorizontalRule() )

	var typeRow = new UI.TextRow()
	typeRow.setLabel('Type')
	container.add( typeRow );

	var radiusRow = new UI.NumberRow().onChange(updateWhole)
	radiusRow.setLabel('Radius')
	container.add( radiusRow );

	var tubeRow = new UI.NumberRow().onChange(updateWhole)
	tubeRow.setLabel('Tube')
	container.add( tubeRow );

	var radialSegmentsRow = new UI.NumberRow().onChange(updateWhole)
	radialSegmentsRow.setLabel('Radial Segments')
	radialSegmentsRow.value.setPrecision(0).setStep(3).setRange(1, 1000)
	container.add( radialSegmentsRow );
	radialSegmentsRow.value.setPrecision(0)

	var tubularSegmentsRow = new UI.NumberRow().onChange(updateWhole)
	tubularSegmentsRow.setLabel('Tubular Segments')
	tubularSegmentsRow.value.setPrecision(0).setStep(3).setRange(1, 1000)
	container.add( tubularSegmentsRow );
	tubularSegmentsRow.value.setPrecision(0)

	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
	function updateWhole(){
		var injectProperty = InspectDevTools.propertyOnObject3d;
		var injectFunction = InspectDevTools.functionOnObject3d

		// injectFunction
		injectFunction(function(object3d, radius, tube, radialSegments, tubularSegments){
			// console.log('reinit torus knot', arguments)
			delete object3d.__webglInit; // TODO: Remove hack (WebGLRenderer refactoring)

			object3d.geometry.dispose();

			object3d.geometry = new THREE.TorusKnotGeometry(
				radius,
				tube,
				radialSegments,
				tubularSegments
			);

			object3d.geometry.computeBoundingSphere();

		}, [radiusRow.getValue(), tubeRow.getValue(), radialSegmentsRow.getValue(), tubularSegmentsRow.getValue()]);
	}
		
	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////

	function updateUI(object3d) {
		var geometry = object3d.geometry

		console.assert( geometry.parameters )

		typeRow.updateUI( geometry.sniffType )
		
		radiusRow.updateUI(geometry.parameters.radius)
		tubeRow.updateUI(geometry.parameters.tube)
		radialSegmentsRow.updateUI(geometry.parameters.radialSegments)
		tubularSegmentsRow.updateUI(geometry.parameters.tubularSegments)
	}
	
	updateUI(object3d)

	return container
};
