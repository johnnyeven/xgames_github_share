<?php
/*
 Plugin Name: xGame's Github sharing tools
Plugin URI: http://www.johnnyeven.com/
Description: 
Version: 1.0.0
Author: johnnyeven
Author URI: http://www.johnnyeven.com/
License: GPLv2 or later
*/

if ( !function_exists( 'add_action' ) ) {
	echo "Hi there!  I'm just a plugin, not much I can do when called directly.";
	exit();
}

define('XGAME_GST_VERSION', '1.0.0');
define('XGAME_GST_URL', plugin_dir_url( __FILE__ ));

$xgames_gst_options = get_option('xgames_gst_options');

include_once 'inc/github.class.php';
include_once 'admin_page.php';

add_action('wp_footer', 'gst_style');

function gst_style()
{
	wp_register_style( 'xgames-gst-style', XGAME_GST_URL . 'resources/xgames-gst-style.css');
	wp_enqueue_style( 'xgames-gst-style' );
}