<?php
if (! function_exists ( 'add_action' ))
{
	echo __ ( "Hi there!  I'm just a plugin, not much I can do when called directly.", 'xgames-gst' );
	exit ();
}

add_action ( 'admin_menu', 'gst_add_admin_menu' );
add_action ( 'admin_init', 'gst_option_init' );
add_action ( 'admin_enqueue_scripts', 'gst_load_js_css' );

$action = trim ( $_GET ['action'] );
if ($action == 'auth')
{
	start_oauth();
}
elseif ($action == 'callback')
{
	exchange_access_token();
}

function gst_option_init()
{
	load_plugin_textdomain ( 'xgames-gst', false, dirname ( plugin_basename ( __FILE__ ) ) . '/language' );
	
	register_setting ( 'xgames_gst_options', 'xgames_gst_options', 'gst_options_validate' );
	add_settings_section ( 'gst_options_top', __ ( 'General Settings', 'xgames-gst' ), 'gst_section_top', 'default' );
	add_settings_field ( 'gst_input_client_id', __ ( 'Client Id', 'xgames-gst' ), 'gst_add_settings_client_id', 'default', 'gst_options_top' );
	add_settings_field ( 'gst_input_client_secret', __ ( 'Client Secret', 'xgames-gst' ), 'gst_add_settings_client_secret', 'default', 'gst_options_top' );
	add_settings_field('gst_access_token', __ ( 'Access Token', 'xgames-gst' ), 'gst_add_settings_access_token', 'default', 'gst_options_top');
	add_settings_field('gst_base_path', __ ( 'Current Url', 'xgames-gst' ), 'gst_add_settings_base_path', 'default', 'gst_options_top');
}

function gst_options_validate($input)
{
	return $input;
}

function gst_section_top()
{
}

function gst_add_settings_client_id()
{
	global $xgames_gst_options;
	echo '<label><input id="gst_input_client_id" name="xgames_gst_options[gst_input_client_id]" type="text" value="' . $xgames_gst_options ['gst_input_client_id'] . '"/>  ';
	echo __ ( 'Your Client id of the Github application', 'xgames-gst' ) . '</label>';
}

function gst_add_settings_client_secret()
{
	global $xgames_gst_options;
	echo '<label><input id="gst_input_client_secret" name="xgames_gst_options[gst_input_client_secret]" type="text" value="' . $xgames_gst_options ['gst_input_client_secret'] . '"/>  ';
	echo __ ( 'Your Client secret of the Github application', 'xgames-gst' ) . '</label>';
}

function gst_add_settings_base_path()
{
	global $xgames_gst_options;
	if(empty($xgames_gst_options['gst_base_path']))
	{
		$xgames_gst_options['gst_base_path'] = 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF'] . '?page=xgames_gst';
	}
	echo '<label><input id="gst_base_path" name="xgames_gst_options[gst_base_path]" type="text" value="' . $xgames_gst_options ['gst_base_path'] . '"/>  ';
	echo __ ( 'Current url', 'xgames-gst' ) . '</label>';
}

function gst_add_settings_access_token()
{
	global $xgames_gst_options;
	echo '<label><input id="gst_access_token" name="xgames_gst_options[gst_access_token]" type="text" value="' . $xgames_gst_options ['gst_access_token'] . '"/>  ';
	echo __ ( 'Access Token', 'xgames-gst' ) . '</label>';
}

function gst_load_js_css()
{
	wp_register_style ( 'xgames-gst-style', XGAME_GST_URL . 'resources/xgames-gst-admin.css' );
	wp_enqueue_style ( 'xgames-gst-style' );
}

function gst_add_admin_menu()
{
	add_options_page ( __ ( "xGame's Github Sharing Tools Option", 'xgames-gst' ), __ ( 'xGame GST', 'xgames-gst' ), 'manage_options', 'xgames_gst', 'gst_add_admin_page' );
}

function gst_add_admin_page()
{
	global $xgames_gst_options;
	if (! current_user_can ( 'manage_options' ))
	{
		wp_die ( __ ( 'You do not have sufficient permissions to access this page.', 'xgames-gst' ) );
	}
	
	?>
<div class="wrap">
		<?php if ( function_exists('screen_icon') ) echo screen_icon(); ?>
        <h2><?php echo __("xGame's Github Sharing Tools Option", 'xgames-gst'); ?></h2>
	<form method="POST" action="options.php">
<?php
	settings_fields ( 'xgames_gst_options' );
	do_settings_sections ( 'default' );
	echo " <p class='submit'> <input name='Submit' type='submit' class='button-primary' value=\"" . __ ( 'Save Changes', 'xgames-gst' ) . "\" />";
	if (! empty ( $xgames_gst_options ['gst_input_client_id'] ) && ! empty ( $xgames_gst_options ['gst_input_client_secret'] ) && empty ( $xgames_gst_options ['gst_access_token'] ))
	{
		$url = $xgames_gst_options['gst_base_path'] . '&action=auth';
		?>
        	<a class="button-primary" type="button"
			href="<?php echo $url; ?>"><?php echo __("Authenticate", 'xgames-gst') ?></a>
<?php
	}
	echo "</p>";
	?>
        </form>
	<p>
		<a href="https://developer.github.com/" target="_blank"><?php echo __("You can sign up for a Client Id here", 'xgames-gst') ?></a>
	</p>
</div>
<?php
}

function start_oauth()
{
	$github = new Github();
	$github->start_oauth();
}

function exchange_access_token()
{
	global $xgames_gst_options;
	$github = new Github();
	$result = $github->exchange_access_token();
	$xgames_gst_options['gst_access_token'] = $result->access_token;
	
	update_option('xgames_gst_options', serialize($xgames_gst_options));
	
	redirect($xgames_gst_options['gst_base_path']);
}
?>