( function( $ ) {

	$.extend( {
		githubTreeview : function( options ) {

			var defaultOptions = {
				rootContainer : true,
				container : $( this ),
				autoWidth : true,
				width : 0,
				autoHeight : true,
				height : 0,
			};

			var settings = $.extend( {}, defaultOptions, options );

			if ( !settings.rootContainer ) {
				$( this ).append( '<div id="github_treeview_plugin"></div>' );
				settings.container = $( "#github_treeview_plugin" );
			}
			if ( settings.autoWidth ) {

			} else {

			}
			if ( settings.autoHeight ) {

			} else {

			}
		}
	} );

} )( jQuery );