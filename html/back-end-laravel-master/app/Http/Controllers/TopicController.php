<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Topic;
use App\Helpers\JwtAuth;

class TopicController extends Controller
{
    public function getInfoTopics($id){
        $topics = Topic::where('assignment_id',$id)->get();
        return response()->json(array(
            'topics' => $topics
        ),200);   	
    }

    public function uploadCatalogoTopics($assignment_id,Request $request){

        $file = $request->file('file');
        if($file){
            $file_path = time().$file->getClientOriginalName();
            \Storage::disk('catalogoTopics')->put($file_path, \File::get($file));
            if (($handle = fopen ( storage_path("app/catalogoTopics/" . $file_path) , 'r' )) !== FALSE) {
                while ( ($data = fgetcsv ( $handle, 1000, ',' )) !== FALSE ) {
                    $topic_data = new Topic ();
                    $topic_data->name = $data [0];
                    $topic_data->num_topic = $data [1];
                    $topic_data->assignment_id = $assignment_id;
                    $topic_data->save ();
                }
                fclose ( $handle );
            }
            \Storage::disk('catalogoTopics')->delete($file_path);
            return response()->json(array(
                'code' => 200,
                'message' => 'Catálogo de tópicos subido'
            ),200);
        }        
    }
}
