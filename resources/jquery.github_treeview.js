( function( $ ) {
	$
			.extend(
					$.fn,
					{
						githubTreeview : function( options ) {

							var defaultOptions = {
								rootContainer : true,
								container : $( this ),
								autoWidth : true,
								width : 0,
								autoHeight : false,
								height : 300,
								accessToken : "",
								apiUrl : "https://api.github.com/"
							};

							var settings = $.extend( {}, defaultOptions,
									options );
							if ( !settings.accessToken ) {
								alert( "Access Token can't be null" );
								return;
							}
							if ( !settings.rootContainer ) {
								$( this )
										.append(
												'<div id="github_treeview_plugin"></div>' );
								settings.container = $( "#github_treeview_plugin" );
							}
							var root = settings.container;
							root.addClass( 'xgame-gst-container' );
							if ( settings.autoWidth ) {
								settings.container.width( settings.container
										.parent().width() - 6 );
							} else {
								settings.container.width( settings.width );
							}
							if ( settings.autoHeight ) {
								settings.container.height( settings.container
										.parent().height() );
							} else {
								settings.container.height( settings.height );
							}

							root
									.append( '<div id="xgame-gst-commit-title" class="xgame-gst-commit-title"></div>' );
							root
									.append( '<div id="xgame-gst-commit-detail" class="xgame-gst-commit-detail"></div>' );
							root
									.append( '<div id="xgame-gst-contents" class="xgame-gst-contents"></div>' );
							var contentHeight = root.height()
									- $( "#xgame-gst-commit-title" )
											.outerHeight()
									- $( "#xgame-gst-commit-detail" )
											.outerHeight();
							$( "#xgame-gst-contents" ).height(
									contentHeight - 1 );

							$( "#xgame-gst-contents" )
									.append(
											'<div id="xgame-gst-list-wrapper" class="xgame-gst-list-wrapper"></div>' );
							$( "#xgame-gst-list-wrapper" ).append(
									'<ul class="xgame-gst-list"></ul>' );

							request( "user", {
								access_token : settings.accessToken
							}, userInfoCallback );

							function request( method, parameter, callback ) {
								$.get( settings.apiUrl + method + "?"
										+ $.param( parameter ), callback );
							}

							function userInfoCallback( data ) {
								if ( !data ) {
									return;
								}
								$( "#xgame-gst-commit-title" ).text(
										data.html_url );
								$( "#xgame-gst-commit-detail" )
										.append(
												'<img id="xgame-gst-commit-gravatar" class="xgame-gst-commit-gravatar" src="#" width="20" height="20" /><span id="xgame-gst-commit-author" class="xgame-gst-commit-author"></span>' );
								$( "#xgame-gst-commit-gravatar" ).attr( "src",
										data.avatar_url );
								$( "#xgame-gst-commit-author" )
										.text( data.name );

							}
						}
					} );

} )( jQuery );