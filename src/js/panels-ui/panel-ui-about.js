/**
 * Handle panel for object3d
 *
 * @constructor
 */
var PanelAbout	= function(){
	
	var signals	= editor.signals

	var container	= new UI.Panel()
	container.dom.style.textAlign	= 'center'
	
	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
	
	
	var domElement	= document.createElement('div')
	domElement.innerHTML	= 'THREE.js Inspector'
	domElement.style.fontSize = '2em'
	domElement.style.paddingTop = '1em'
	domElement.style.width = '100%';
	domElement.style.color = '#aaa'
	container.dom.appendChild(domElement)
	
	var domElement	= document.createElement('div')
	domElement.innerHTML	= 'v ' + '1.2.7'	
	domElement.style.color = '#888'
	container.dom.appendChild(domElement)

	container.dom.appendChild( document.createElement('br') )
	


	var authorRow	= document.createElement('div')
	authorRow.innerHTML	= 'Contact me on twitter '
	container.dom.appendChild(authorRow)

	var domElement	= document.createElement('a')
	domElement.href	= 'https://twitter.com/jerome_etienne'
	domElement.innerHTML	= '@jerome_etienne'	
	domElement.target	= '_blank'
	domElement.style.color = '#888'
	authorRow.appendChild(domElement)


	container.dom.appendChild( document.createElement('br') )
	container.dom.appendChild( document.createElement('br') )
	container.dom.appendChild( document.createElement('br') )
	container.dom.appendChild( document.createElement('br') )
	container.dom.appendChild( document.createElement('br') )
	container.dom.appendChild( document.createElement('br') )
	container.dom.appendChild( document.createElement('br') )
	container.dom.appendChild( document.createElement('br') )
	container.dom.appendChild( document.createElement('br') )
	container.dom.appendChild( document.createElement('br') )

	var feedbackRow	= document.createElement('div')
	feedbackRow.innerHTML	= 'Bugs, ideas and feedback: '
	container.dom.appendChild(feedbackRow)
	var domElement	= document.createElement('a')
	domElement.href	= 'https://github.com/jeromeetienne/threejs-inspector'
	domElement.innerHTML	= 'GitHub page'	
	domElement.target	= '_blank'	
	domElement.style.color = '#888'
	feedbackRow.appendChild(domElement)

	container.dom.appendChild( document.createElement('br') )

	var feedbackRow	= document.createElement('div')
	feedbackRow.innerHTML	= 'Chrome Store Extension: '
	container.dom.appendChild(feedbackRow)
	var domElement	= document.createElement('a')
	domElement.href	= 'https://chrome.google.com/webstore/detail/threejs-inspector/dnhjfclbfhcbcdfpjaeacomhbdfjbebi?hl=en'
	domElement.innerHTML	= 'three.js inspector'	
	domElement.target	= '_blank'	
	domElement.style.color = '#888'
	feedbackRow.appendChild(domElement)

	container.dom.appendChild( document.createElement('br') )

	var versionRow	= document.createElement('div')
	versionRow.innerHTML	= 'Work better with the last version of three.js (r71 atm) '
	container.dom.appendChild(versionRow)
	
	container.dom.appendChild( document.createElement('br') )

	var creditRow	= document.createElement('div')
	creditRow.innerHTML	= 'forked of the excelent @thespite\'s three.js extension'
	container.dom.appendChild(creditRow)
	
	return container
};
