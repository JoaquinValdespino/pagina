<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Assignment;
use App\Helpers\JwtAuth;

class AssignmentController extends Controller
{
    public function getInfoAssignments(){
        $assignments = Assignment::all();
        return response()->json(array(
            'assignments' => $assignments
        ),200); 	
    }

    public function getInfoAssignment($id){
        $assignment = Assignment::where('assignment_id',$id)->get();
        return response()->json(array(
            'assignment' => $assignment
        ),200);
    }

    public function updateAssignment($id, Request $request){
        //Autenticacion
        $hash = $request->header('Authorization', null);
        $jwtAuth = new JwtAuth();
        $checkToken = $jwtAuth->checkToken($hash);

        if($checkToken){
            //Recoger parámetros
            $json = $request->input('json',null);
            $params= json_decode($json);
            $params_array = json_decode($json,true);

            //Actualizar registro
            $assignment = Assignment::where('assignment_id',$id)->update($params_array);

            $data = array(
                'assignment' => $params,
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
