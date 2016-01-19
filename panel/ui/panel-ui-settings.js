var PanelWin3js	= PanelWin3js	|| {}

/**
 * Handle panel for object3d
 *
 * @constructor
 */
PanelWin3js.PanelSettings	= function(){
	var editor	= PanelWin3js.editor
	var signals	= editor.signals

	var container	= new UI.Panel()


	//////////////////////////////////////////////////////////////////////////////////
	//		handle autoRefresh
	//////////////////////////////////////////////////////////////////////////////////

	var rafEnabledRow	= new UI.CheckboxRow()
	rafEnabledRow.setTitle('Enable RequestAnimationFrame hijackinglected object')
	rafEnabledRow.setLabel('RAF. Enabled').onChange(function(){
		editor.config.setKey('rafEnabled', rafEnabledRow.getValue())
		
		update()
	})
	rafEnabledRow.setValue(editor.config.getKey('rafEnabled'))
	container.add( rafEnabledRow )

	var rafFpsRow = new UI.NumberRow().onChange(function(){
		editor.config.setKey('rafFps', rafFpsRow.getValue())
		
		update()
	})
	rafFpsRow.setLabel('RAF. fps')
	rafFpsRow.value.setRange(0.0,60.0).setPrecision(0).setStep(10)
	rafFpsRow.value.setValue(editor.config.getKey('rafFps'))
	container.add( rafFpsRow );
	
	//////////////////////////////////////////////////////////////////////////////////
	//		signals
	//////////////////////////////////////////////////////////////////////////////////
	signals.injectedInspectedWin.add(function(){
		console.log('in panel-ui-settings.js: received injectedInspectedWin signals')
		update()
	})
	
	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
	
	function update(){		
		PanelWin3js.plainFunction(function(rafEnabled, fps){
			var rafThrottler	= InspectedWin3js.rafThrottler
			// console.log('in panel-ui-settings.js: setting rafThrottler to', rafEnabled ? ('enable at '+fps+' fps') : 'disable')
			if( rafEnabled !== true ){
				rafThrottler.fps = -1
			}else{
				rafThrottler.fps = fps
			}

		}, [rafEnabledRow.getValue(), rafFpsRow.getValue()]);
		
	}



	return container
};
