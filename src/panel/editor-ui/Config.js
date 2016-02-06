/**
 * @author mrdoob / http://mrdoob.com/
 */

var Config = function () {

	var namespace = 'threejs-inspector';

	var storage = {
		'selectionBoxEnabled': false,
		'rafEnabled'	: false,
		'rafFps'	: 30,
	}

	if ( window.localStorage[ namespace ] === undefined ) {

		window.localStorage[ namespace ] = JSON.stringify( storage );

	} else {

		var data = JSON.parse( window.localStorage[ namespace ] );

		for ( var key in data ) {

			storage[ key ] = data[ key ];

		}

	}

	return {

		getKey: function ( key ) {

			return storage[ key ];

		},

		setKey: function () { // key, value, key, value ...

			for ( var i = 0, l = arguments.length; i < l; i += 2 ) {

				storage[ arguments[ i ] ] = arguments[ i + 1 ];

			}

			window.localStorage[ namespace ] = JSON.stringify( storage );

			console.log( '[' + /\d\d\:\d\d\:\d\d/.exec( new Date() )[ 0 ] + ']', 'Saved config to LocalStorage.' );

		},

		clear: function () {

			delete window.localStorage[ namespace ];

		}

	}

};
