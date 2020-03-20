<?php
namespace App\Helpers;

use Firebase\JWT\JWT;
use Illuminate\Support\Facades\DB;
use App\User;

/**
* 
*/
class JwtAuth 
{
	public $key;

	public function __construct()
	{
		$this->key = 'PaginaMaterial18=)';
	}
	
	public function signup($name, $password, $getToken = null)
	{
		$user = User::where(
			array(
				'name' => $name,
				'password' => $password
			))->first();

		$signup = false;
		if(is_object($user)){
			$signup = true;
		}

		if($signup){
			$token = array(
				'sub' => $user->user_id,
				'assignment_name' => $user->assignment_name,
				'image' =>  $user->image,
				'role' => $user->role,
				'email' => $user->email,
				'name' => $user->name,
				'assignment_id' => $user->assignment_id,
				'template_id' => $user->template_id,
				'iat' => time(),
				'exp' => time() + (7 * 24 * 60 * 60)
			);

			$jwt = JWT::encode($token, $this->key, 'HS256');
			$decoded = JWT::decode($jwt,$this->key, array('HS256'));
			
			if(is_null($getToken)){
				return $jwt;
			}else{
				return $decoded;
			}

		}else{
			return array('status' => 'error','message'=> 'Login ha fallado');
		}
	}


	public function checkToken($jwt, $getIdentity = false)
	{
		$auth = false;

		try{
			$decoded = JWT::decode($jwt, $this->key, array('HS256'));
		}catch(\UnexpectedValueException $e){
			$auth = false;
		}catch(\DomainException $e){
			$auth = false;
		}

		if(isset($decoded) && is_object($decoded) && isset($decoded->sub)){
			$auth = true;
		}else{
			$auth = false;
		}

		if($getIdentity){
			return decoded;
		}

		return $auth;
	}
}