<?php

namespace plugins\xgames_github_share\inc;

if (! function_exists ( 'add_action' ))
{
	echo "Hi there!  I'm just a plugin, not much I can do when called directly.";
	exit ();
}

include_once 'functions/url.function.php';
class Github
{
	private $client_id = null;
	private $client_secret = null;
	private $scope = 'repo, user';
	private $enableSSL = true;
	private $postPath = null;
	private $oauthPath = 'https://github.com/login/oauth/';

	function __construct()
	{
		$this->load_config ();
	}

	private function load_config()
	{
	}

	public function start_oauth()
	{
		if (! empty ( $this->client_id ) && ! empty ( $this->client_secret ))
		{
			$parameter = array(
				'client_id'			=>	$this->client_id,
				'scope'				=>	$this->scope
			);
			redirect($this-oauthPath . 'authorize?' . query_string($parameter));
		}
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
			$ip = $this->input->ip_address ();
			$header = array (
				'CLIENT-IP:' . $ip,
				'X-FORWARDED-FOR:' . $ip 
			);
			curl_setopt ( $ch, CURLOPT_HTTPHEADER, $header );
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