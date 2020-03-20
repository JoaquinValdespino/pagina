<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Helpers\JwtAuth;
use Illuminate\Support\Facades\DB;
use App\Peticion;
use App\Subtopic;

class PeticionController extends Controller
{
    public function saveRequest(Request $request)
    {
    	//Autenticacion
        $hash = $request->header('Authorization', null);
        $jwtAuth = new JwtAuth();
        $checkToken = $jwtAuth->checkToken($hash);

        if($checkToken){
            //Recoger parámetros
            $json = $request->input('json',null);
            $params= json_decode($json);
            //$params_array = json_decode($json,true);

            $name = (!is_null($json) && isset($params->name)) ? $params->name : null;
            $file_name = (!is_null($json) && isset($params->file_name)) ? $params->file_name : null;
            $link = (!is_null($json) && isset($params->link)) ? $params->link : null;
            $subtopic = (!is_null($json) && isset($params->subtopic)) ? $params->subtopic : null;
            $profesor_name = (!is_null($json) && isset($params->profesor_name)) ? $params->profesor_name : null;
            $tipoET = (!is_null($json) && isset($params->tipoET)) ? $params->tipoET : null;
            $estatus = 'Pendiente';
            $justification = (!is_null($json) && isset($params->justification)) ? $params->justification : null;
            $assignment_id = (!is_null($json) && isset($params->assignment_id)) ? $params->assignment_id : null;
            $material_id = (!is_null($json) && isset($params->material_id)) ? $params->material_id : null;

         	if (!is_null($name) && !is_null($profesor_name) && !is_null($tipoET) && !is_null($justification) && !is_null($assignment_id) && !is_null($material_id) && !is_null($subtopic)) {
                   
				//validar si el subtopico_id existe
				$isset_request = Subtopic::where('subtopic_id','=',$subtopic)
										  ->first();
				if($isset_request){
                    $checkPeticion =  Peticion::where('name',$name)
                                        ->where('subtopic',$isset_request->name)
                                        ->where('material_id',$material_id)
                                        ->where('assignment_id',$assignment_id)
                                        ->where('tipoET',$tipoET)
                                        ->where('estatus','Pendiente')
                                        ->first();

                    if($checkPeticion){//ya existe una peticion con estatus pendiente
                        $data = array(
                            'status' => 'error',
                            'code' => 400,
                            'message' => 'Ya existe una petición activa para ese material'
                        );
                        return response()->json($data,200);
                    }
                    
                    $peticion = new Peticion();
                    $peticion->name = $name;
                    $peticion->file_name = $file_name;
                    $peticion->link = $link;
                    $peticion->profesor_name = $profesor_name;
                    $peticion->tipoET = $tipoET;
                    $peticion->estatus = $estatus;
                    $peticion->justification = $justification;
                    $peticion->assignment_id = $assignment_id;
                    $peticion->material_id = $material_id;
                    $peticion->subtopic = $isset_request->num_subtopic.' '.$isset_request->name;
                    $peticion->save();
					$data = array(
		                'status' => 'success',
		                'code' => 200,
		                'message' => 'Peticion creada correctamente'
		            );
				}else{
					$data = array(
		                'status' => 'error',
		                'code' => 400,
		                'message' => 'Subtopico no encontrado'
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

    public function getRequests($assignment_id)
    {
    	$requests = Peticion::where('assignment_id',$assignment_id)->get();
        return response()->json(array(
            'requests' => $requests
        ),200);   
    }

    public function updateRequest($id, $estatusnew, Request $request)
    {
    	//Autenticacion
        $hash = $request->header('Authorization', null);
        $jwtAuth = new JwtAuth();
        $checkToken = $jwtAuth->checkToken($hash);

        if($checkToken){

            //Actualizar registro
            $peticion = Peticion::where('request_id',$id)->update(['estatus'=>$estatusnew]);
            $data = array(
                'peticion' => $peticion,
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
