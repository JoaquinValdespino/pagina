<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Template;
use App\StyleBody;
use App\StyleMenu;
use App\Logo;
use App\Helpers\JwtAuth;

class TemplateController extends Controller
{
    public function getInfoTemplate($id){
        //$template =new Template();
        $template= Template::where('assignment_id',$id)->first();
        $styleB = StyleBody::where('template_id',$template->template_id)->first();
        $styleM = StyleMenu::where('template_id',$template->template_id)->first();
        $logo = Logo::where('template_id',$template->template_id)->first();
        
        //$template2 = $template; 
        	return response()->json([
                'assignment' => [ 
                    'template_id' => $template->template_id,
                    'assignment' => $template->assignment_id,
                    'assignment_name' => $template->assignment_name,
                    'style_body' => $styleB,
                    'style_menu' => $styleM,
                    'logos' => $logo
            ]],200); 
    }

    //Falta que juan lo complete 
    public function updateTemplate($id, Request $request){
        //Autenticacion
        $hash = $request->header('Authorization', null);
        $jwtAuth = new JwtAuth();
        $checkToken = $jwtAuth->checkToken($hash);

        if($checkToken){
            //Recoger parámetros
            $json = $request->input('json',null);
            $params= json_decode($json);
            $params_array = json_decode($json,true);
            $params_style_body = $params_array["style_body"];
            $params_style_menu = $params_array["style_menu"];
            $params_logos = $params_array["logos"];

            //Actualizar registro
            //$template = Template::where('template_id',$id)->update($params_array);
            $styleB = StyleBody::where('template_id',$id)->update($params_style_body);
            $styleM = StyleMenu::where('template_id',$id)->update($params_style_menu);
            $logo = Logo::where('template_id',$id)->update($params_logos);

            $data = array(
                'template' => $params,
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
}
