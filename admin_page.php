<?php
if (! function_exists ( 'add_action' ))
{
	echo "Hi there!  I'm just a plugin, not much I can do when called directly.";
	exit ();
}


add_action('admin_menu', 'xgame_add_admin_menu');

function xgame_add_admin_menu()
{
	add_options_page('xGame Github Option', 'xGame Github', 'manage_options', 'xgame_github', 'xgame_add_admin_page');
}

function xgame_add_admin_page()
{
	if ( !current_user_can( 'manage_options' ) )
	{
		wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
	}

	if ( $_SERVER["REQUEST_METHOD"] == "POST" )
	{
		update_option( 'GITHUB_API_KEY', $_POST['api_key'] );
		update_option( 'GITHUB_API_SECRET_KEY', $_POST['api_secret_key'] );
	}

	?>
<div class="github-admin-options">
		<?php if ( function_exists('screen_icon') ) echo screen_icon(); ?>
        <h2>GitHub Options</h2>
        <form name="options" method="POST" action="<?php echo $_SERVER['REQUEST_URI']; ?>">
            <label for="api_key">API Key<span class="required">(*)</span>: </label>
            <input type="text" name="api_key" value="<?php echo get_option( 'GITHUB_API_KEY', '' ); ?>"size="70">
            <br />
            <label for="api_secret_key">Consumer Secret<span class="required">(*)</span>: </label>
            <input type="text" name="api_secret_key" value="<?php echo get_option( 'GITHUB_API_SECRET_KEY', '' ); ?>" size="70">
            <br />
            <label for="bearer_token">Authentication Token: </label>
            <input type="text" disabled value="<?php echo get_option( 'GITHUB_AUTHENTICATION_TOKEN', '' ); ?>" size="70">
            <br />
            <input class="button-primary" type="submit" name="save" />
            <?php
            $state = base64_encode(time());
            $redirect = XGAME_GST_URL . 'github_callback.php';
            $api_key = get_option( 'GITHUB_API_KEY' );
            $api_secret = get_option( 'GITHUB_API_SECRET_KEY' );
            $token = get_option( 'GITHUB_AUTHENTICATION_TOKEN' );
            if($api_key && $api_secret && !$token) {
                $api_url = "https://github.com/login/oauth/authorize?client_id=$api_key&scope=&state=$state&redirect_uri=$redirect";
                ?>
                <a class="button-primary" type="button" href="<?php echo $api_url; ?>">Authenticate</a>
                <?php
            }
 
            ?>
            <br/>
            <small>You can sign up for a API key <a href="https://developer.github.com/"target="_blank">here</a></small>
        </form>
    </div>
<?php
}
?>