UI.FileUpload = function () {
	var fileUpload	= this;

	UI.Element.call( this );

	var dom		= document.createElement( 'span' );
	fileUpload.dom	= dom

	//////////////////////////////////////////////////////////////////////////////////
	//		callback to notify
	//////////////////////////////////////////////////////////////////////////////////

	var _onFilesUpload	= null
	fileUpload.onFilesUpload= function(newFct){
		_onFilesUpload	= newFct
		return this
	}

	//////////////////////////////////////////////////////////////////////////////////
	//		dom creation
	//////////////////////////////////////////////////////////////////////////////////
	var inputEl	= document.createElement('input')
	inputEl.setAttribute('type', 'file')
	inputEl.setAttribute('multiple', 'multiple')
	inputEl.style.display	= 'none'
	fileUpload.dom.appendChild(inputEl)


	var dropZoneEl	= document.createElement('span')
	fileUpload.dom.appendChild(dropZoneEl)
	dropZoneEl.title		= 'Drop your files here'
	dropZoneEl.style.marginLeft	= '0.5em'
	dropZoneEl.style.display	= 'inline-block'
	dropZoneEl.style.width		= '120px'
	dropZoneEl.style.height		= '1em'
	dropZoneEl.style.border		= '2px dashed #555'
	dropZoneEl.style.textAlign	= 'center'
	dropZoneEl.innerHTML		= 'Drop files'
	dropZoneEl.fontSize		= '0.9em'

	var uploadButton	= new UI.FontAwesomeIcon().onClick(function(){
		inputEl.click();
	})
	uploadButton.addClass('fa-upload')
	uploadButton.setTitle('Browse your files')
	fileUpload.dom.appendChild(uploadButton.dom);

	//////////////////////////////////////////////////////////////////////////////////
	//		Handle input event
	//////////////////////////////////////////////////////////////////////////////////

	// file selection
	inputEl.addEventListener("change", function onInputFileChange(event) {
		var files	= event.target.files
		// notify caller
		_onFilesUpload && _onFilesUpload(files);
	}, false);

	//////////////////////////////////////////////////////////////////////////////////
	//		handle dropzone event
	//////////////////////////////////////////////////////////////////////////////////

	// file drag draghover
	function onDropZoneHover(event){
		if( event.type === 'dragover' ){
			dropZoneEl.style.borderColor	= 'orange'
			dropZoneEl.style.borderStyle	= 'solid'
			dropZoneEl.style.color		= 'orange'
		}else{
			dropZoneEl.style.borderColor	= '#555'
			dropZoneEl.style.borderStyle	= 'dashed'
			dropZoneEl.style.color		= ''
		}

		event.stopPropagation();
		event.preventDefault();
	}

	// file selection
	function onDropZoneDrop(event) {
		// cancel event and hover styling
		onDropZoneHover(event);
		// fetch FileList object
		var files	= event.dataTransfer.files;
		// notify caller
		_onFilesUpload && _onFilesUpload(files);
	}
	dropZoneEl.addEventListener("dragover"	, onDropZoneHover, false);
	dropZoneEl.addEventListener("dragleave"	, onDropZoneHover, false);
	dropZoneEl.addEventListener("drop"	, onDropZoneDrop, false);
}


UI.FileUpload.prototype = Object.create( UI.Element.prototype );


