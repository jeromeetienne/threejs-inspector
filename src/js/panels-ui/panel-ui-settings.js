/**
 * Handle panel for object3d
 *
 * @constructor
 */
var PanelSettings	= function(){
	
	var signals	= editor.signals

	var container	= new UI.Panel()

	//////////////////////////////////////////////////////////////////////////////////
	//		handle autoRefresh
	//////////////////////////////////////////////////////////////////////////////////

	var autoRefreshRow	= new UI.CheckboxRow()
	autoRefreshRow.setTitle('Automatically refresh the selected object')
	autoRefreshRow.setLabel('Auto Refresh').onChange(function(){
		editor.config.setKey('autoRefresh', autoRefreshRow.getValue())
		
		update()
	})
	autoRefreshRow.setValue(editor.config.getKey('autoRefresh'))
	container.add( autoRefreshRow )


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
	signals.initialized.add(function(){
		update()
	})
	
	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
	
	function update(){
		// update auto-refresh
		InspectDevTools.plainFunction(function(autoRefresh){
			if( autoRefresh ){
				Inspect3js.autoRefreshStart()
			}else{
				Inspect3js.autoRefreshStop()				
			}
		}, [autoRefreshRow.getValue()]);
		
		InspectDevTools.plainFunction(function(rafEnabled, fps){
			var rafThrottler	= Inspect3js.rafThrottler
			if( rafEnabled !== true ){
				rafThrottler.fps = -1
			}else{
				rafThrottler.fps = fps
			}

		}, [rafEnabledRow.getValue(), rafFpsRow.getValue()]);
		
	}



	return container
};
