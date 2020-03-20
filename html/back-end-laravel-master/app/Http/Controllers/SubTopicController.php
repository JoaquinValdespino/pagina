<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Subtopic;
use App\Topic;
use App\Helpers\JwtAuth;

class SubTopicController extends Controller
{
    public function getInfoSubtopics($topic){
        $subtopics = Subtopic::where('topic_id',$topic)->get();
        return response()->json(array(
            'subtopics' => $subtopics
        ),200);   	
    }

    public function uploadCatalogoSubtopics($assignment_id,Request $request){

        $file = $request->file('file');
        if($file){
            $file_path = time().$file->getClientOriginalName();
            \Storage::disk('catalogoSubtopics')->put($file_path, \File::get($file));
            if (($handle = fopen ( storage_path("app/catalogoSubtopics/" . $file_path) , 'r' )) !== FALSE) {
                while ( ($data = fgetcsv ( $handle, 1000, ',' )) !== FALSE ) {
                    $subtopic_data = new Subtopic ();
                    $subtopic_data->name = $data [0];
                    $subtopic_data->num_subtopic = $data [1];
                    $subtopic_data->topic = $data [2];
                    $subtopic_data->save ();
                }
                fclose ( $handle );
            }
            \Storage::disk('catalogoSubtopics')->delete($file_path);
            //foreach para revisar los registros nulos y asignarlos a los topicos correspondientes   
            $subtopics = Subtopic::where('topic_id',null)->get();
            foreach ($subtopics as $subtopic) {
                $topic = Topic :: where('assignment_id',$assignment_id)
                                ->where('num_topic',$subtopic->topic)
                                ->first();
                                /*->skip(0)
                                ->take(1)
                                ->get()*/
                $sub = Subtopic :: where('subtopic_id',$subtopic->subtopic_id)
                                ->update(['topic_id'=>$topic->topic_id]);
            }
            return response()->json(array(
                'code' => 200,
                'message' => 'Catálogo de subtópicos subido'
            ),200);
        }        
    }
}
