<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ProfesorsAssignments extends Model
{
	public $timestamps = false; 
    protected $table = 'profesors_assignments';

    /*public function profesors()
    {
    	return $this->belongsTo('App\Profesor','profesor_id');
    }

    public function assignments()
    {
    	return $this->belongsTo('App\Assignment','assignment_id');
    }*/
}
