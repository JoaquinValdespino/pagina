<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Peticion extends Model
{
    public $timestamps = false;
    protected $table = 'requests';
}
