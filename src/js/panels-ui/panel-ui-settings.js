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
	}



	return container
};
