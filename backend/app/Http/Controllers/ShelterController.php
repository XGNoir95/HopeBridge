<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Shelter;

class ShelterController extends Controller
{
    public function index()
    {
        $shelters = Shelter::all();
        return response()->json($shelters);
    }

    public function show(){
        
    }
   
}