<?php
if (! function_exists ( 'add_action' ))
{
	echo "Hi there!  I'm just a plugin, not much I can do when called directly.";
	exit ();
}

if (! function_exists ( 'redirect' ))
{

	function redirect($uri = '', $method = 'location', $http_response_code = 302)
	{
		if (! preg_match ( '#^https?://#i', $uri ))
		{
			$uri = '/' . $uri;
		}
		
		switch ($method)
		{
			case 'refresh' :
				header ( "Refresh:0;url=" . $uri );
				break;
			default :
				header ( "Location: " . $uri, TRUE, $http_response_code );
				break;
		}
		exit ();
	}
}

if (! function_exists ( 'query_string' ))
{

	function query_string($parameter)
	{
		if (! empty ( $parameter ))
		{
			$r = array();
			foreach($parameter as $key => $value)
			{
				array_push($r, "{$key}={$value}");
			}
			return implode('&', $r);
		}
		return null;
	}
}
?>