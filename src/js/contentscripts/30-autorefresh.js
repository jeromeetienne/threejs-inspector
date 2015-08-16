/**
 * define content script namespace
 * @type {Object}
 */
window.Inspect3js	= window.Inspect3js	|| {}


//////////////////////////////////////////////////////////////////////////////////
//		handle autoRefresh
//////////////////////////////////////////////////////////////////////////////////

Inspect3js._autoRefreshTimer	= null
Inspect3js.autoRefreshStart	= function(delay){
	if( delay === undefined )	delay	= 0.5 * 1000

	Inspect3js.autoRefreshStop()

	Inspect3js.UISelect(Inspect3js._lastSelectedUuid)

	this._autoRefreshTimer	= setInterval(function(){
		Inspect3js.UISelect(Inspect3js._lastSelectedUuid)
	}, 0.5 * 1000);		
}

Inspect3js.autoRefreshStop	= function(){
	if( this._autoRefreshTimer === null )	return

	clearInterval(this._autoRefreshTimer)
	this._autoRefreshTimer = null
}
