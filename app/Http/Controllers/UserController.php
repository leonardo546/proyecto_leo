<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use Auth;

class UserController extends Controller
{
    public function Registrar(Request $request)
    {
        User::create([
        	'name' => $request->nombre,
        	'email' => $request->email,
        	'password' => bcrypt($request->password),
        ]);

        return redirect(route('user.files'));
    }

    public function eliminarImagen($user, $imagen)
    {
    	$usuario = User::where('id', $user)->first();

        $imagenes = $usuario->getMedia('UserProfile');
        $imagenes[$imagen]->delete();

       $user = Auth::user();
       return view('Usuarios.index', compact('user'));
    }

    public function modificarImagen(Request $request)
    {
    	$usuario = User::where('id', $request->user_id)->first();

        $imagenes = $usuario->getMedia('UserProfile');
        $imagenes[$request->imagen_id]->delete();

        $usuario->addMediaFromRequest('file')->toMediaCollection('UserProfile');

        return redirect(route('user.files'));

    }
}
