<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Helpers\JwtAuth;
use App\Http\Requests;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;
use App\User;
use App\Template;
use App\StyleBody;
use App\Logo;
use App\StyleMenu;
use App\Assignment;

class UserController extends Controller
{
	//Login para profesoress
    public function login(Request $request){
    	$JwtAuth = new JwtAuth();

    	//Recibir los datos una sola linea
    	$json = $request->input('json',null);
    	$params = json_decode($json);
    	
    	//cambiar name por name
    	$name = (!is_null($json) && isset($params->name) ? $params->name : null);
    	$password = (!is_null($json) && isset($params->password) ? $params->password : null);
    	$getToken = (!is_null($json) && isset($params->gettoken) ? $params->gettoken : null);

		//Cifrar password
		$pwd = hash('sha256',$password);

		if(!is_null($name) && !is_null($password) && ($getToken == null || $getToken == 'false')){
			$signup = $JwtAuth->signup($name,$pwd);
		}elseif ($getToken != null) {
			$signup = $JwtAuth->signup($name,$pwd,$getToken);
		}else{
			$signup = array(
				'status' => 'error',
				'message' => 'Envia tus datos por post'
			);
		}
		return response()->json($signup,200);
    }

    //Obtener datos de un único maestro
    public function getMaster($name){
        $master = User::where('assignment_name',$name)
        				->where('role','ROLE_ADMIN_MAESTRO')
        				->get();
        return response()->json(array(
            'user2' => $master
        ),200);
        return response()->json(array(
            'message' => 'No autenticado'
        ),200);    	
    }

    //Actualizar password del usuario
    public function updatePassword($id,$password, Request $request){
        //Autenticacion
        $hash = $request->header('Authorization', null);
        $jwtAuth = new JwtAuth();
        $checkToken = $jwtAuth->checkToken($hash);

        if($checkToken){
            //Recoger parámetros
            //$json = $request->input('json',null);
            //$params= json_decode($json);
            //$params_array = json_decode($json,true);
            $pwd = hash('sha256',$password);

            //Actualizar registro
            $user = User::where('user_id',$id)->update(['password'=>$pwd]);

            $data = array(
                'user' => $user,
                'status' => 'success',
                'code' => 200
            );
            return response()->json($data,200);
        }else{
            return response()->json(array(
                'message' => 'No autenticado'
            ),200);
        }
    }
    
    public function saveUser(Request $request)
    {
        //Autenticacion
        $hash = $request->header('Authorization', null);
        $jwtAuth = new JwtAuth();
        $checkToken = $jwtAuth->checkToken($hash);

        if($checkToken){
            //Recoger parámetros
            $json = $request->input('json',null);
            $params= json_decode($json);

            $password = (!is_null($json) && isset($params->password)) ? $params->password : null;
            $assignment_name = (!is_null($json) && isset($params->assignment_name)) ? $params->assignment_name : null;
            $email_admin = (!is_null($json) && isset($params->email)) ? $params->email : null;
            $name = (!is_null($json) && isset($params->name)) ? $params->name : null;
            //$assignment_id = (!is_null($json) && isset($params->assignment_id)) ? $params->assignment_id : null;
            $clave_assignment = (!is_null($json) && isset($params->clave_assignment)) ? $params->clave_assignment : null;

            if (!is_null($password) && !is_null($assignment_name) && !is_null($email_admin) && !is_null($name) && !is_null($clave_assignment)) {
                
                $exis_user = User::where('name',$name)
                    ->where('role','ROLE_MAESTRO')                    
                    ->first();
                    
                if($exis_user){//Revisión de si existe el nombre de usuario
                    return response()->json(array(
                        'code' => 400,
                        'message' => 'Nombre de usuario ya existente'
                    ),200);
                }
                
                $user = new User();
                $user2 = new User();
                //Para el admin
                $user->name = "admin-".$name;
                $user->email = $email_admin;
                $user->role = "ROLE_ADMIN_MAESTRO";
                $user->image = "default.png";
                $user->assignment_name = $assignment_name;

                //Para el maestro
                $user2->name = $name;
                $user2->email = null;
                $user2->role = "ROLE_MAESTRO";
                $user2->image = null;
                $user2->assignment_name = $assignment_name;

                //validar si la asignatura ya existe
                $isset_user = User::where('assignment_name','=',$assignment_name)
                                          ->get();
                if(count($isset_user) == 0){
                    $template = new Template();
                    $style_menu = new StyleMenu();
                    $style_body = new StyleBody();
                    $assignment = new Assignment();
                    $logo = new Logo();

                    //assignment
                    $assignment->assignment_name = $assignment_name;
                    $assignment->template_select = "first";
                    $assignment->clave_assignment = $clave_assignment;
                    $assignment->catalog_profesor = null;
                    $assignment->save();

                    //assignment id para los usuarios
                    $user->assignment_id = $assignment->id;
                    $user2->assignment_id = $assignment->id;

                    //template
                    $template->assignment_name = $assignment_name;
                    $template->assignment_id = $assignment->id;
                    $template->save();
                    
                    //style_menu
                    $style_menu->fontFamily= "Ubuntu";
                    $style_menu->backgroundColor ="#497D92";
                    $style_menu->color = "#FFFFFF";
                    $style_menu->template_id = $template->id;
                    $style_menu->save();
                    
                    //style_body
                    $style_body->backgroundColor ="#d9f2f1";
                    $style_body->color = "black";
                    $style_body->fontFamily = "Ubuntu";
                    $style_body->template_id = $template->id;
                    $style_body->save();

                    //logos
                    $logo->fi = "fi3.png";
                    $logo->unam = "unam3.png";
                    $logo->assig = "mat2.jpg";
                    $logo->template_id = $template->id;
                    $logo->save();

                    //guardar usuario
                    $pass2 = 'admin'.$password;
                    $pwd = hash('sha256',$password);
                    $pwd2 = hash('sha256',$pass2);
                    $user->password = $pwd2;
                    $user2->password = $pwd;
                    $user->template_id = $template->id;
                    $user2->template_id = $template->id;
                    $user->save();
                    $user2->save();

                    $data = array(
                        'user' => $user,
                        'user_id' => $user->id,
                        'status' => 'success',
                        'code' => 200,
                        'message' => 'Usuarios creados correctamente'
                    );
                }else{
                    $data = array(
                        'status' => 'error',
                        'code' => 400,
                        'message' => 'Asignatura ya existente'
                    );
                }
            }else{
                $data = array(
                    'status' => 'error',
                    'code' => 400,
                    'message' => 'Peticion no creada'
                );
            }
            return response()->json($data,200);
        }else{
            return response()->json(array(
                'message' => 'No autenticado'
            ),200);
        }
    }

    public function uploadImage($id,Request $request)
    {
        $file = $request->file('image');
        if($file){
             $file_path = time().$file->getClientOriginalName();
             \Storage::disk('users')->put($file_path, \File::get($file));
             $user= User::where('user_id',$id)->update(['image'=>$file_path]);
             return response()->json(array(
                'code' => 200,
                'message' => 'Imagen de usuario subida'
            ),200);
        }
    }

    public function getImage($assignment_name,Request $request)
    {
        if($assignment_name == "multimedia"){
            $user = User::where('assignment_name',$assignment_name)
                    ->where('role','ROLE_ADMIN')                    
                    ->first();
            $image = Storage::disk('users')->get($user->image);
        }else{
            $user = User::where('assignment_name',$assignment_name)
                    ->where('role','ROLE_ADMIN_MAESTRO')                    
                    ->first();
            $image = Storage::disk('users')->get($user->image);
        }
        
        return new Response($image,200);
    }

    public function getsImage($file_name)
    {
        $image = Storage::disk('logos')->get($file_name);
        return new Response($image,200);
    }

    public function uploadNewImage($id,$path,Request $request)
    {
        \Storage::disk('users')->delete($path);
        $file = $request->file('image');
        if($file){
            $file_path = time().$file->getClientOriginalName();
            \Storage::disk('users')->put($file_path, \File::get($file));
            $user= User::where('user_id',$id)->update(['image'=>$file_path]);
        }
        return response()->json(array(
            'image' => $file_path
        ),200);
    }
}
