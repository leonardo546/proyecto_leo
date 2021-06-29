<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', 'HomeController@general')->name('general');

Auth::routes();
Route::get('/logout', 'Auth\LoginController@logout');
Route::post('/registar', 'UserController@Registrar')->name('registrar');
Route::get('verImagen/{user}/{imagen}', 'HomeController@verImagen')->name('ver.imagen');


Route::group(['middleware' => ['auth']], function () { 
    Route::get('userFiles', 'HomeController@userFiles')->name('user.files');
    Route::post('agregarFiles', 'HomeController@agregarFile')->name('agregar.file');
    Route::get('verImagen/{user}/{imagen}', 'HomeController@verImagen')->name('ver.imagen');
    Route::post('comentar', 'HomeController@agregarComentario')->name('agregar.comentario');
    Route::get('eliminar/imagen/{user}/{imagen}', 'UserController@eliminarImagen')->name('eliminar.imagen');
    Route::post('modificar/imagen', 'UserController@modificarImagen')->name('modificar.imagen');
});
