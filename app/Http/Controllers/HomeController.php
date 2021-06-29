<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\comentario;
use Auth;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth', ['except' => ['general', 'verImagen', 'Registrar']]);
        
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        return view('home');
    }

    public function general()
    {
        $users = User::all();
        return view('welcome', compact('users'));
    }

    public function userFiles()
    {
        $user = Auth::user();
       return view('Usuarios.index', compact('user'));
    }

    public function agregarFile(Request $request)
    {
        $user = User::where('id', Auth::user()->id)->first();

        $user->addMediaFromRequest('file')->toMediaCollection('UserProfile');

        return redirect(route('user.files'));
    }

    public function verImagen($user, $imagen)
    {
        $user = User::where('id', $user)->first();

        $imagenes = $user->getMedia('UserProfile');

        $comentarios = comentario::where('user_id', $user->id)->where('imagen_id', $imagen)->get();

        $path = $imagenes[$imagen]->getUrl();
        $nombre = $imagenes[$imagen]->name;

        return view('Usuarios.ver', compact('path', 'nombre', 'comentarios','user','imagen'));
    }

    public function agregarComentario(Request $request)
    {
        $comentario = comentario::create([
            'user_id' => $request->user_id,
            'imagen_id' => $request->imagen_id,
            'creador_id' => Auth::user()->id,
            'comentario' => $request->comentario,
        ]);

        return redirect(route('ver.imagen', ['user'=>$request->user_id, 'imagen' => $request->imagen_id]));
    }

}
