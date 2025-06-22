<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Prize;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        $prize = Prize::orderBy('Point', 'desc')->get();
        return inertia('Home/Index',[
            'prize' => $prize
        ]);
    }
}
