<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\ProfesorsAssignments;
use App\Profesor;
use App\Helpers\JwtAuth;
use Carbon\Carbon;


class ProfesorAssignmentController extends Controller
{
    public function getNameProfesors($assignment){
    	$json = [];
        $profesor_assignments = ProfesorsAssignments::where('assignment_id',$assignment)
                                                    ->where('disponible',1)
                                                    ->get();
    	foreach ($profesor_assignments as $a) {
    		$profesor =  Profesor::where('profesor_id',$a['profesor_id'])->get();
    		$profesor = json_decode($profesor);
    		$json = array_merge($json,$profesor);
        }
        return response()->json(array(
            'profesors' => $json
           ),200);
    }

    public function saveProfesor($assignment_id,Request $request){
        //Autenticacion
        $hash = $request->header('Authorization', null);
        $jwtAuth = new JwtAuth();
        $checkToken = $jwtAuth->checkToken($hash);

        if($checkToken){
            //Recoger parámetros
            $json = $request->input('json',null);
            $params= json_decode($json);
            
            $profesor_name = (!is_null($json) && isset($params->profesor_name)) ? $params->profesor_name : null;
            $profesor_first_last_name = (!is_null($json) && isset($params->profesor_first_last_name)) ? $params->profesor_first_last_name : null;
            $profesor_second_last_name = (!is_null($json) && isset($params->profesor_second_last_name)) ? $params->profesor_second_last_name : null;
            $profesor_rfc = (!is_null($json) && isset($params->rfc)) ? $params->rfc : null;
            $profesor_email = (!is_null($json) && isset($params->email)) ? $params->email : null;

            if (!is_null($profesor_name) && !is_null($profesor_first_last_name) && !is_null($profesor_second_last_name) && !is_null($profesor_rfc) && !is_null($profesor_email)) {
                
                //validar si ya está dado de alta el profesor
                $isset_profesor = Profesor::where('profesor_name','=',$profesor_name)
                                        ->where('profesor_first_last_name','=',$profesor_first_last_name)
                                        ->where('profesor_second_last_name','=',$profesor_second_last_name)
                                        ->first();

                if(!$isset_profesor){//No está en el catálogo
                    $profesor = new Profesor();
                    $profesor->profesor_name = $profesor_name;
                    $profesor->profesor_first_last_name = $profesor_first_last_name;
                    $profesor->profesor_second_last_name = $profesor_second_last_name;
                    $profesor->rfc = $profesor_rfc;
                    $profesor->email = $profesor_email;
                    $profesor->save();
                    $profesorAssignment = new ProfesorsAssignments();
                    $profesorAssignment->assignment_id = $assignment_id;
                    $profesorAssignment->profesor_id = $profesor->id;
                    $profesorAssignment->disponible = 1;
                    $profesorAssignment->creado = Carbon::now()->toDateTimeString();
                    $profesorAssignment->save();
                    $data = array(
                        'status' => 'success',
                        'code' => 200,
                        'message' => 'Profesor creado en el catalogo y asignado a la asignatura'
                    );
                }else{//Está en el catálogo
                    $isset_profesor_assignment = ProfesorsAssignments::where('profesor_id','=',$isset_profesor->profesor_id)
                                            ->where('assignment_id','=',$assignment_id)
                                            ->where('disponible',1)
                                            ->first();
                    if($isset_profesor_assignment){//Ya esta el profesor dado de alta en la asignatura
                        $data = array(
                            'status' => 'error',
                            'code' => 400,
                            'message' => 'Ya existe el profesor dado de alta en la asignatura'
                        );
                    }else{//Esta registrado el profesor pero no esta dado de alta en la asignatura
                        $profesorAssignment = new ProfesorsAssignments();
                        $profesorAssignment->assignment_id = $assignment_id;
                        $profesorAssignment->profesor_id = $isset_profesor->profesor_id;
                        $profesorAssignment->disponible = 1;
                        $profesorAssignment->creado = Carbon::now()->toDateTimeString();
                        $profesorAssignment->save();
                        $data = array(
                            'status' => 'success',
                            'code' => 200,
                            'message' => 'Profesor guardado en la asignatura'
                        );
                    }
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

    public function deleteProfesor($assignment_id,$profesor_id,Request $request){
        //Autenticacion
        $hash = $request->header('Authorization', null);
        $jwtAuth = new JwtAuth();
        $checkToken = $jwtAuth->checkToken($hash);

        if($checkToken){
            
            $profesor= ProfesorsAssignments::where('profesor_id','=',$profesor_id)
                                            ->where('assignment_id','=',$assignment_id)
                                            ->where('disponible',1)
                                            ->update(['disponible'=>'0','eliminado'=>Carbon::now()->toDateTimeString()]);
            $data = array(
                'status' => 'success',
                'code' => 200,
                'message' => 'Profesor borrado de la asignatura'
            );
            return response()->json($data,200);
        }else{
            return response()->json(array(
                'message' => 'No autenticado'
            ),200);
        }
    }
}
