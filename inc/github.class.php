<?php
if (! function_exists ( 'add_action' ))
{
	echo "Hi there!  I'm just a plugin, not much I can do when called directly.";
	exit ();
}

include_once 'functions/url.function.php';
class Github
{
	private $options = null;
	private $client_id = null;
	private $client_secret = null;
	private $access_token = null;
	private $scope = 'repo,user';
	private $enableSSL = true;
	private $postPath = null;
	private $oauthPath = 'https://github.com/login/oauth/';

	function __construct()
	{
		$this->load_config ();
	}

	private function load_config()
	{
		$this->options = get_option ( 'xgames_gst_options' );
		if (! empty ( $this->options ))
		{
			$this->client_id = $this->options ['gst_input_client_id'];
			$this->client_secret = $this->options ['gst_input_client_secret'];
			$this->access_token = $this->options ['gst_access_token'];
		}
	}

	public function start_oauth()
	{
		if (! empty ( $this->client_id ) && ! empty ( $this->client_secret ))
		{
			$parameter = array (
				'client_id' => $this->client_id,
				'scope' => $this->scope,
				'redirect_uri' => urlencode ( $this->options ['gst_base_path'] . '&action=callback' ),
				'state' => base64_encode ( time () ) 
			);
			redirect ( $this->oauthPath . 'authorize?' . query_string ( $parameter ) );
		}
	}

	public function exchange_access_token()
	{
		$parameter = array (
			'client_id' => $this->client_id,
			'client_secret' => $this->client_secret,
			'redirect_uri' => urlencode ( $this->options ['gst_base_path'] . '&action=success' ),
			'code' => $_GET ['code'] 
		);
		$result = $this->post ( 'access_token', $parameter );
		echo $result;
		exit ();
	}

	public function post($controller, $parameter)
	{
		if (! empty ( $controller ))
		{
			$this->postPath = $this->oauthPath . $controller;
			
			$ch = curl_init ();
			curl_setopt ( $ch, CURLOPT_URL, $this->postPath );
			curl_setopt ( $ch, CURLOPT_POST, 1 );
			curl_setopt ( $ch, CURLOPT_POSTFIELDS, $parameter );
			curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, 1 );
			curl_setopt ( $ch, CURLOPT_FOLLOWLOCATION, 1 );
			curl_setopt ( $ch, CURLOPT_USERAGENT, $_SERVER ['HTTP_USER_AGENT'] );
			
			if ($this->enableSSL)
			{
				curl_setopt ( $ch, CURLOPT_SSL_VERIFYPEER, FALSE );
				curl_setopt ( $ch, CURLOPT_SSL_VERIFYHOST, FALSE );
			}
			
			$monfd = curl_exec ( $ch );
			
			curl_close ( $ch );
			
			return $monfd;
		} else
		{
			return false;
		}
	}
}

?>