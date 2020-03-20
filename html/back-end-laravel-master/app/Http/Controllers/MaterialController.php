<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Helpers\JwtAuth;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;
use App\Material;
use Illuminate\Support\Facades\Storage;

class MaterialController extends Controller
{
    public function saveMaterial(Request $request) {
    	//Autenticación
        $hash = $request->header('Authorization', null);//Hash para la autorización
        $jwtAuth = new JwtAuth();//Creacion del objeto que tiene el método para autorizar el request
        $checkToken = $jwtAuth->checkToken($hash);//Método para verificar el hash
        if($checkToken){ //Si la autorización es correcta
            //Recoger parámetros
            $json = $request->input('json',null);
            $params= json_decode($json); //Convertir string a JSON
            //Obtener elementos del JSON y almacenarlos en variables locales
            $name = (!is_null($json) && isset($params->name)) ? $params->name : null; 
            $dificultad = (!is_null($json) && isset($params->dificultad)) ? $params->dificultad : null;
            $profesor = (!is_null($json) && isset($params->profesor)) ? $params->profesor : null;
            $file = null;
            $tipoET = (!is_null($json) && isset($params->tipoET)) ? $params->tipoET : null;
            $tipoVD = (!is_null($json) && isset($params->tipoVD)) ? $params->tipoVD : null;
            $subtopic_id = (!is_null($json) && isset($params->subtopic_id)) ? $params->subtopic_id : null;
            $link = (!is_null($json) && isset($params->link)) ? $params->link : null;
            //Si se obtuvieron todos los elementos necesarios para la creación del material entra a la condición
         	if (!is_null($name) && !is_null($dificultad) && !is_null($profesor) && !is_null($subtopic_id)) {       			
       			$material = new Material(); //Inicializa el objeto para el modelo de Material
       			//Se guardan el objeto todas la variables recabadas por el JSON
       			$material->name = $name;
				$material->dificultad = $dificultad;
				$material->profesor = $profesor;
				$material->file = $file;
				$material->tipoET = $tipoET;
				$material->tipoVD = $tipoVD;
				$material->subtopic_id = $subtopic_id;
				$material->link = $link;
				//Validar si ya existe el material con el mismo nombre para un subtopico
				$isset_material = Material::where('name','=',$name)
										  ->where('subtopic_id','=',$subtopic_id)
                                          ->get();                                     
				if(count($isset_material) == 0){ //Si no existe el material     
                    //Se guarda el material en la base de datos
					$material->save();
					$data = array( //Se crea una respuesta para elFront-end de que el material fue creado correctamente
                        'material' => $material,
                        'material_id' => $material->id,
		                'status' => 'success',
		                'code' => 200,
		                'message' => 'Material creado correctamente'
		            );
				}else{ //Si el material existe                    
					$data = array(//Se crea una respuesta para el Front-end de que el material ya existe en la base de datos
		                'status' => 'error',
		                'code' => 400,
		                'message' => 'Nombre para el material ya existente'
	            	);
                }
                
         	}else{ //Se crea una respuesta para el Front-end de que el material no fue creado porque faltaron elementos para crearlo
         		$data = array(
	                'status' => 'error',
	                'code' => 400,
	                'message' => 'Material no creado'
            	);
             }
             
            return response()->json($data,200); //Se envia la respuesta al Front-end
        }else{ //En cado de que no se haya autenticado el usuario de forma correcta
            return response()->json(array(
                'message' => 'No autenticado'
            ),200);
        }
    }

    public function getInfos($subtopic_id,$type)
    {
       $materials = Material::where('subtopic_id',$subtopic_id)
                            ->where('tipoET',$type)
                            ->get();
        return response()->json(array(
            'materials' => $materials
        ),200);
    }

    public function uploadFile($id,Request $request)
    {
        $file = $request->file('file');
        if($file){
            /*if($file->getSize() >= xx){ //El tamaño se mide en bytes
                Material::where('material_id',$id)->delete();
                return response()->json(array(
                    'code' => 400,
                    'message' => 'Archivo demasiado grande'
                ),200);
            }*/
            //Encontrar la información del material y la validación de las extensiones
            $material_tipo = Material::where('material_id',$id) -> first();
            $material_tipo = $material_tipo->tipoVD;
            if($material_tipo == 'Video'){
                if($file->extension() == 'mp4' || $file->extension() == 'mkv' || $file->extension() == 'avi'){
                    $file_path = time().$file->getClientOriginalName();
                    \Storage::disk('materials')->put($file_path, \File::get($file));
                    $material= Material::where('material_id',$id)->update(['file'=>$file_path]);
                    return response()->json(array(
                        'code' => 200,
                        'message' => 'Material de tipo video subido '
                    ),200);
                }else{
                    Material::where('material_id',$id)->delete();
                    return response()->json(array(
                        'code' => 400,
                        'message' => 'Extensión inválida para los videos'
                    ),200);
                }
            }else if($material_tipo == 'Documento'){
                if($file->extension() == 'docx' || $file->extension() == 'doc' || $file->extension() == 'xls'|| $file->extension() == 'xlsx'|| $file->extension() == 'pdf'|| $file->extension() == 'ppt'|| $file->extension() == 'pptx'){
                    $file_path = time().$file->getClientOriginalName();
                    \Storage::disk('materials')->put($file_path, \File::get($file));
                    $material= Material::where('material_id',$id)->update(['file'=>$file_path]);
                    return response()->json(array(
                        'code' => 200,
                        'message' => 'Material de tipo documento subido '
                    ),200);
                }else{
                    Material::where('material_id',$id)->delete();
                    return response()->json(array(
                        'code' => 400,
                        'message' => 'Extensión inválida para los documentos'
                    ),200);
                }
            }else if($material_tipo == 'Imagen'){
                if($file->extension() == 'png' || $file->extension() == 'jpg' || $file->extension() == 'jpeg'){
                    $file_path = time().$file->getClientOriginalName();
                    \Storage::disk('materials')->put($file_path, \File::get($file));
                    $material= Material::where('material_id',$id)->update(['file'=>$file_path]);
                    return response()->json(array(
                        'code' => 200,
                        'message' => 'Material de tipo imagen subido '
                    ),200);
                }else{
                    Material::where('material_id',$id)->delete();
                    return response()->json(array(
                        'code' => 400,
                        'message' => 'Extensión inválida para las imágenes'
                    ),200);
                }
            }else{
                Material::where('material_id',$id)->delete();
                return response()->json(array(
                    'code' => 400,
                    'message' => 'Ese tipo es inexistente'
                ),200);
            }
        }
    }

     public function getFile($file)
    {
        return response()->file(storage_path("app/materials/" . $file));
    }

    public function deleteMaterial($id, Request $request)
    {
        //Autenticacion
        $hash = $request->header('Authorization', null);
        $jwtAuth = new JwtAuth();
        $checkToken = $jwtAuth->checkToken($hash);

        if($checkToken){
            $material = Material::where('material_id',$id)->first();
            \Storage::disk('materials')->delete($material->file);
            $material = Material::where('material_id',$id)->delete();
            return response()->json(array(
                'message' => 'Material Eliminado'
            ),200);
        }else{
            return response()->json(array(
                'message' => 'No autenticado'
            ),200);
        }
    }
}
