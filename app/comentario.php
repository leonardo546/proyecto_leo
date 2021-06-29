<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\User;

class comentario extends Model
{
      public $table = 'comentarios';

      public $fillable = [
        'comentario',
        'user_id',
        'imagen_id',
        'creador_id'
    ];


    public function usuario()
    {
    	return $this->hasOne(User::class, 'id', 'user_id');
    }
}
