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
	//		popupMenu
	//////////////////////////////////////////////////////////////////////////////////
	
	var popupMenu	= UI.PopupMenuHelper.createSelect({
		''			: '--- Options ---',
		'clear'		: 'Clear',
	}, onPopupMenuChange)
	container.add(popupMenu)
	function onPopupMenuChange(value){
		if( value === 'clear' ){
			editor.config.clear()
			updateUI();
		}
	}

	container.dom.appendChild( document.createElement('br') )
	container.dom.appendChild( document.createElement('br') )
	container.dom.appendChild( document.createElement('br') )
	//////////////////////////////////////////////////////////////////////////////////
	//		handle selectionBoxEnabled
	//////////////////////////////////////////////////////////////////////////////////

	var selectionBoxEnabledRow	= new UI.CheckboxRow()
	selectionBoxEnabledRow.setTitle('Show a bounding box on the selected object')
	selectionBoxEnabledRow.setLabel('Selection Box').onChange(update)
	container.add( selectionBoxEnabledRow )

	//////////////////////////////////////////////////////////////////////////////////
	//		handle rafThrottler
	//////////////////////////////////////////////////////////////////////////////////

	var rafEnabledRow	= new UI.CheckboxRow()
	rafEnabledRow.setTitle('Enable RequestAnimationFrame hijackinglected object')
	rafEnabledRow.setLabel('RAF. Enabled').onChange(update)
	container.add( rafEnabledRow )

	var rafFpsRow = new UI.NumberRow().onChange(update)
	rafFpsRow.setLabel('RAF. fps')
	rafFpsRow.value.setRange(0.0,60.0).setPrecision(0).setStep(10)
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
	function updateUI(){
		rafEnabledRow.setValue(editor.config.getKey('selectionBoxEnabled'))	
		rafEnabledRow.setValue(editor.config.getKey('rafEnabled'))
		rafFpsRow.value.setValue(editor.config.getKey('rafFps'))
	}
	
	
	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
	function update(){
		editor.config.setKey('selectionBoxEnabled', selectionBoxEnabledRow.getValue())
		editor.config.setKey('rafEnabled', rafEnabledRow.getValue())
		editor.config.setKey('rafFps', rafFpsRow.getValue())

		//////////////////////////////////////////////////////////////////////////////////
		//		honot rafEnabledRow
		//////////////////////////////////////////////////////////////////////////////////
		PanelWin3js.plainFunction(function(selectionBoxEnabled){
			var selectionBox	= InspectedWin3js.selectionBox
			selectionBox.enabled	= selectionBoxEnabled
		}, [selectionBoxEnabledRow.getValue()]);

		//////////////////////////////////////////////////////////////////////////////////
		//		honot rafEnabledRow
		//////////////////////////////////////////////////////////////////////////////////
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

	updateUI();

	return container
};
