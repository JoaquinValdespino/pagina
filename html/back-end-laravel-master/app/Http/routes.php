<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/
 
Route::get('/', function () {
    return view('welcome');
});

//Rutas para assignment
Route::get('/getInfoAssignments','AssignmentController@getInfoAssignments')->middleware('cors');
Route::get('/getInfoAssignment/{id}','AssignmentController@getInfoAssignment')->middleware('cors');
Route::put('/updateAssignment/{id}','AssignmentController@updateAssignment')->middleware('cors');

//Rutas para user
Route::post('/login','UserController@login')->middleware('cors');
Route::get('/getMaster/{name}','UserController@getMaster')->middleware('cors');
Route::put('/updatePassword/{id}/{password}','UserController@updatePassword')->middleware('cors');
Route::post('/register','UserController@saveUser')->middleware('cors');
Route::post('/uploadImage/{id}','UserController@uploadImage')->middleware('cors');
Route::get('/getImage/{assignment_name}','UserController@getImage')->middleware('cors');
Route::get('/getsImage/{file_name}','UserController@getsImage')->middleware('cors');
Route::post('/uploadNewImage/{id}/{path}','UserController@uploadNewImage')->middleware('cors');

//Rutas para template
Route::get('/getInfoTemplate/{id}','TemplateController@getInfoTemplate')->middleware('cors');
Route::put('/updateTemplate/{id}','TemplateController@updateTemplate')->middleware('cors');

//Rutas para profesor_assignment
Route::get('/getNameProfesors/{id}','ProfesorAssignmentController@getNameProfesors')->middleware('cors');
Route::post('/saveProfesor/{assignment_id}','ProfesorAssignmentController@saveProfesor')->middleware('cors');
Route::put('/deleteProfesor/{assignment_id}/{profesor_id}','ProfesorAssignmentController@deleteProfesor')->middleware('cors');

//Rutas para topic
Route::get('/getInfoTopics/{id}','TopicController@getInfoTopics')->middleware('cors');
Route::post('/uploadCatalogoTopics/{assignment_id}','TopicController@uploadCatalogoTopics')->middleware('cors');

//Rutas para subtopic
Route::get('/getInfoSubtopics/{topic}','SubTopicController@getInfoSubtopics')->middleware('cors');
Route::post('/uploadCatalogoSubtopics/{assignment_id}','SubTopicController@uploadCatalogoSubtopics')->middleware('cors');

//Rutas para material
Route::post('/saveMaterial','MaterialController@saveMaterial')->middleware('cors');
Route::get('/getInfos/{subtopic_id}/{type}','MaterialController@getInfos')->middleware('cors');
Route::post('/uploadFile/{id}','MaterialController@uploadFile')->middleware('cors');
Route::get('/getFile/{file}','MaterialController@getFile')->middleware('cors');
Route::delete('/deleteMaterial/{id}','MaterialController@deleteMaterial')->middleware('cors');

//Rutas para request
Route::post('/saveRequest','PeticionController@saveRequest')->middleware('cors');
Route::get('/getRequests/{assignment_id}','PeticionController@getRequests')->middleware('cors');
Route::put('/updateRequest/{id}/{estatusnew}','PeticionController@updateRequest')->middleware('cors');



