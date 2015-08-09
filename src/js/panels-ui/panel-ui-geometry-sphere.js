/**
 * Handle panel for object3d
 *
 * @constructor
 */
var PanelGeometrySphere	= function(object3d){
	
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

	var widthSegmentsRow = new UI.NumberRow().onChange(updateWhole)
	widthSegmentsRow.setLabel('Width Segments')
	widthSegmentsRow.value.setPrecision(0).setStep(5).setRange(1, 1000)
	container.add( widthSegmentsRow );

	var heightSegmentsRow = new UI.NumberRow().onChange(updateWhole)
	heightSegmentsRow.setLabel('Height Segments')
	heightSegmentsRow.value.setPrecision(0).setStep(5).setRange(1, 1000)
	container.add( heightSegmentsRow );


	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
	function updateWhole(){
		var injectProperty = InspectDevTools.propertyOnObject3d;
		var injectFunction = InspectDevTools.functionOnObject3d

		// injectFunction
		injectFunction(function(object3d, radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength){
			// console.log('reinit torus knot', arguments)
			delete object3d.__webglInit; // TODO: Remove hack (WebGLRenderer refactoring)

			object3d.geometry.dispose();

			object3d.geometry = new THREE.SphereGeometry(
				radius, widthSegments, heightSegments
			);

			object3d.geometry.computeBoundingSphere();
			// TODO trigger .onGeometryChange()

		}, [radiusRow.getValue(), widthSegmentsRow.getValue(), heightSegmentsRow.getValue()]);
	}
		
	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////

	function updateUI(object3d) {
		var geometry = object3d.geometry

		console.assert( geometry.parameters )
		
		// set defaults values - may happen when it was undefined in constructor
		if( geometry.parameters.widthSegments === undefined )	geometry.parameters.widthSegments = 8
		if( geometry.parameters.heightSegments === undefined )	geometry.parameters.heightSegments = 8

		typeRow.updateUI( geometry.sniffType )
		
		radiusRow.updateUI(geometry.parameters.radius)
		widthSegmentsRow.updateUI(geometry.parameters.widthSegments)
		heightSegmentsRow.updateUI(geometry.parameters.heightSegments)
	}
	
	updateUI(object3d)

	return container
};
