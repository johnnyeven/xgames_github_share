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
							$( "#xgame-gst-list-wrapper > ul" ).width($( "#xgame-gst-contents" ).width());

							request( "user/repos", {
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
								if(data.length == 0) {
									
								} else {
									var owner = data[0].owner;
									$( "#xgame-gst-commit-title" ).text(
											owner.html_url );
									$( "#xgame-gst-commit-detail" )
											.append(
													'<img id="xgame-gst-commit-gravatar" class="xgame-gst-commit-gravatar" src="#" width="20" height="20" /><span id="xgame-gst-commit-author" class="xgame-gst-commit-author"></span>' );
									$( "#xgame-gst-commit-gravatar" ).attr( "src",
											owner.avatar_url );
									$( "#xgame-gst-commit-author" )
											.text( owner.login );
									
									for(var i in data) {
										$( "#xgame-gst-list-wrapper > ul" ).append('<li><span class="xgame-gst-icon gst-repo"></span><a href="' + data[i].contents_url.replace('/{+path}', '') + '">' + data[i].name + '</a></li>');
									}

									$( "#xgame-gst-list-wrapper > ul > li" ).mouseover(function() {
										$(this).addClass('xgame-gst-current');
									}).mouseout(function() {
										$(this).removeClass('xgame-gst-current');
									});
									$( "#xgame-gst-list-wrapper > ul > li > a" ).click(function() {
										alert($(this).attr('href'));
										return false;
									});
								}
							}
						}
					} );

} )( jQuery );