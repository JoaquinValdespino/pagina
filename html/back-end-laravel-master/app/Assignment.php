<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Assignment extends Model
{
	public $timestamps = false;
    protected $table = 'assignments'; 

    public function profesors_assignments()
    {
    	return $this->hasMany('App\ProfesorsAssignments','assignment_id');
    }
}
