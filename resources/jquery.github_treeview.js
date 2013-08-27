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
							var currentContentPath = "";
							var currentRootPath = "";
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
									.append( '<div id="xgame-gst-commit-detail" class="xgame-gst-commit-detail"></div>' );
							root
									.append( '<div class="xgame-gst-control" id="xgame-gst-control"><a class="minibutton primary" id="xgame-gst-btn-root" href="">主页</a> <a class="minibutton" id="xgame-gst-btn-back" href="">返回</a></div>' );
							root
									.append( '<div id="xgame-gst-contents" class="xgame-gst-contents"></div>' );
							var contentHeight = root.height()
									- $( "#xgame-gst-commit-detail" )
											.outerHeight()
									- $( "#xgame-gst-control" ).outerHeight();
							$( "#xgame-gst-contents" ).height(
									contentHeight - 1 );

							$( "#xgame-gst-contents" )
									.append(
											'<div id="xgame-gst-list-wrapper" class="xgame-gst-list-wrapper"></div>' );
							var ulWidth = $( "#xgame-gst-contents" ).width();
							$( "#xgame-gst-list-wrapper" )
									.width( 2.5 * ulWidth );
							$( "#xgame-gst-list-wrapper" ).append(
									'<ul class="xgame-gst-list"></ul>' );
							$( "#xgame-gst-list-wrapper > ul" ).width( ulWidth );

							$( "#xgame-gst-btn-root" )
									.click(
											function() {
												$(
														"#xgame-gst-list-wrapper > ul" )
														.slideUp(
																"normal",
																function() {
																	request(
																			"user/repos",
																			{
																				access_token : settings.accessToken
																			},
																			userRefreshCallback );
																} );
												return false;
											} );
							$( "#xgame-gst-btn-back" )
									.click(
											function() {
												var url = $( this ).attr(
														"href" );
												if ( url ) {
													if ( url == "root" ) {
														$( "#xgame-gst-btn-root" ).click();
													} else {
														request(
																url,
																{
																	access_token : settings.accessToken
																},
																pathCallback,
																true );
														currentContentPath = url;
														var lastPath = getPrevUrl( currentContentPath );
														$(
																"#xgame-gst-btn-back" )
																.attr( "href",
																		lastPath );
													}
												}
												return false;
											} );

							request( "user/repos", {
								access_token : settings.accessToken
							}, userInfoCallback );

							function request( method, parameter, callback,
									noPrefix ) {
								if ( noPrefix ) {
									$.get( method + "?" + $.param( parameter ),
											callback );
								} else {
									$.get( settings.apiUrl + method + "?"
											+ $.param( parameter ), callback );
								}
							}

							function getPrevUrl( url ) {
								var ta = url.split( '/' );
								if ( ta[ta.length - 1] == "contents" ) {
									return "root";
								} else {
									ta.pop();
									var prevUrl = ta.join( '/' );
									return prevUrl;
								}
							}

							function userInfoCallback( data ) {
								if ( !data ) {
									return;
								}
								if ( data.length == 0 ) {

								} else {
									var owner = data[0].owner;
									$( "#xgame-gst-commit-title" ).text(
											owner.html_url );
									$( "#xgame-gst-commit-detail" )
											.append(
													'<img id="xgame-gst-commit-gravatar" class="xgame-gst-commit-gravatar" src="#" width="20" height="20" /><span id="xgame-gst-commit-author" class="xgame-gst-commit-author"></span>' );
									$( "#xgame-gst-commit-gravatar" ).attr(
											"src", owner.avatar_url );
									$( "#xgame-gst-commit-author" ).text(
											owner.login );

									for ( var i in data ) {
										$( "#xgame-gst-list-wrapper > ul" )
												.append(
														'<li><span class="xgame-gst-icon gst-repo"></span><a href="'
																+ data[i].contents_url
																		.replace(
																				'/{+path}',
																				'' )
																+ '">'
																+ data[i].name
																+ '</a></li>' );
									}

									$( document )
											.on(
													"mouseover",
													"#xgame-gst-list-wrapper > ul > li",
													function() {
														$( this )
																.addClass(
																		'xgame-gst-current' );
													} );
									$( document )
											.on(
													"mouseout",
													"#xgame-gst-list-wrapper > ul > li",
													function() {
														$( this )
																.removeClass(
																		'xgame-gst-current' );
													} );
									$( document )
											.on(
													"click",
													"#xgame-gst-list-wrapper > ul > li",
													function() {
														var a = $( this ).find(
																"a" );
														currentContentPath = a
																.attr( "href" );

														$(
																"#xgame-gst-btn-back" )
																.attr(
																		"href",
																		getPrevUrl( currentContentPath ) );
														if ( !currentRootPath ) {
															currentRootPath = a
																	.attr( "href" );
														}
														request(
																currentContentPath,
																{
																	access_token : settings.accessToken
																},
																pathCallback,
																true );
														return false;
													} );
								}
							}

							function userRefreshCallback( data ) {
								if ( !data ) {
									return;
								}
								currentRootPath = "";
								currentContentPath = "";
								if ( data.length == 0 ) {

								} else {
									var owner = data[0].owner;
									$( "#xgame-gst-commit-title" ).text(
											owner.html_url );
									$( "#xgame-gst-commit-detail" ).empty();
									$( "#xgame-gst-commit-detail" )
											.append(
													'<img id="xgame-gst-commit-gravatar" class="xgame-gst-commit-gravatar" src="#" width="20" height="20" /><span id="xgame-gst-commit-author" class="xgame-gst-commit-author"></span>' );
									$( "#xgame-gst-commit-gravatar" ).attr(
											"src", owner.avatar_url );
									$( "#xgame-gst-commit-author" ).text(
											owner.login );
									$( "#xgame-gst-list-wrapper > ul" ).empty();
									for ( var i in data ) {
										$( "#xgame-gst-list-wrapper > ul" )
												.append(
														'<li><span class="xgame-gst-icon gst-repo"></span><a href="'
																+ data[i].contents_url
																		.replace(
																				'/{+path}',
																				'' )
																+ '">'
																+ data[i].name
																+ '</a></li>' );
									}
								}
								$( "#xgame-gst-list-wrapper > ul" ).slideDown();
							}

							function pathCallback( data ) {
								$( "#xgame-gst-list-wrapper" ).append(
										'<ul class="xgame-gst-list"></ul>' );
								var ul = $( "#xgame-gst-list-wrapper > ul" )
										.eq( 1 );
								ul.width( ulWidth );
								var folder = [];
								var files = [];
								for ( var i in data ) {
									if ( data[i].type == "file" ) {
										files.push( data[i] );
									} else {
										folder.push( data[i] );
									}
								}
								for ( i in folder ) {
									ul
											.append( '<li><span class="xgame-gst-icon gst-folder"></span><a href="'
													+ currentRootPath
													+ "/"
													+ folder[i].path
													+ '">'
													+ folder[i].name
													+ '</a></li>' );
								}
								for ( i in files ) {
									ul
											.append( '<li><span class="xgame-gst-icon gst-file"></span><a href="'
													+ currentRootPath
													+ "/"
													+ files[i].path
													+ '">'
													+ files[i].name
													+ '</a></li>' );
								}
								$( "#xgame-gst-list-wrapper" ).animate(
										{
											"left" : -ulWidth
										},
										'slow',
										'swing',
										function() {
											$( "#xgame-gst-list-wrapper > ul" )
													.eq( 0 ).remove();
											$( "#xgame-gst-list-wrapper" ).css(
													'left', 0 );
										} );
							}
						}
					} );

} )( jQuery );