<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>You2be</title>

        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link rel="icon" type="image/png" href="images/icons/favicon.ico"/>
            <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport' />

            <!--     Fonts and icons     -->
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
            <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" />
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css" />

            <!-- CSS Files -->
            <link href="{{ asset('css/bootstrap.min.css') }}" rel="stylesheet" />
            <link href="{{ asset('css/material-kit.css') }}" rel="stylesheet"/>
            <link href="{{ asset('css/demo.css') }}" rel="stylesheet" />

            <script src="https://google-code-prettify.googlecode.com/svn/loader/run_prettify.js"></script>
                <link rel="apple-touch-icon" sizes="76x76" href="assets/img/apple-icon.png">
            <link rel="icon" type="image/png" href="assets/img/favicon.png">
            <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />

            <link href="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">
            <script src="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
            <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>



           <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css" integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l" crossorigin="anonymous">

            <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.min.js" integrity="sha384-+YQ4JLhjyBLPDQt//I+STsc9iw4uQqACwlvpslubQzn4u2UU2UFM80nGisd026JF" crossorigin="anonymous"></script>


        <!-- Styles -->
        <style>
            html, body {
                background-color: #fff;
                color: #636b6f;
                font-family: 'Nunito', sans-serif;
                font-weight: 200;
                height: 100vh;
                margin: 0;
            }

            .full-height {
                height: 100vh;
            }

            .flex-center {
                align-items: center;
                display: flex;
                justify-content: center;
            }

            .position-ref {
                position: relative;
            }

            .top-right {
                position: absolute;
                right: 10px;
                top: 18px;
            }

            .content {
                text-align: center;
            }

            .title {
                font-size: 84px;
            }

            .links > a {
                color: #636b6f;
                padding: 0 25px;
                font-size: 13px;
                font-weight: 600;
                letter-spacing: .1rem;
                text-decoration: none;
                text-transform: uppercase;
            }

            .m-b-md {
                margin-bottom: 30px;
            }
        </style>
    </head>
    <body>
        <nav class="navbar navbar-expand-lg  navbar-dark bg-dark">
          <a class="navbar-brand" href="#"><strong> You2Be </strong></a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarText">
            <ul class="navbar-nav mr-auto">
              <li class="nav-item">
                <a class="nav-link" href="{{route('general')}}">Inicio <span class="sr-only">(current)</span></a>
              </li>
               @auth
                  <li class="nav-item">
                    <a class="nav-link" href="{{route('user.files')}}">Mis Archivos</a>
                  </li>
              @endauth
            </ul>
            <span class="navbar-text">
              @if (Route::has('login'))
                        @auth
                            <a href="{{ url('/logout') }}">Cerrar Sesión</a>
                        @else
                            <a href="{{ route('login') }}">Iniciar Sesión o registrarse</a>
                        @endauth
                @endif
            </span>
          </div>
        </nav>
        <div class="contenido">

            <h1 style="text-align: center;">Todos los archivos</h1>
            <div style="margin-top: 20px;">
                @foreach($users as $user)
                    <h3 style="text-align: center;">{{$user->name}}</h3>

                    <div class="row" style="text-align: center;"> 
                        @foreach($user->getMedia('UserProfile') as $key => $image)
                        <div class="col-sm-3">
                            <a href="{{route('ver.imagen', ['user'=>$user->id, 'imagen' => $key])}}">
                                <img  src="{{$image->getUrl()}}" width="200px;" height="200px;">
                                <p>{{$image->name}}</p>
                            </a>
                        </div>
                        @endforeach
                    </div>
                @endforeach
            </div>

        </div>
    </body>
</html>
