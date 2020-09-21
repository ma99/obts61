<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\City;
use App\Route;


class RouteCitiesController extends Controller
{
    
    public function store(Route $route)
    {
        // $routes = request()->input('routes');
        // dd($routes);

        $attributes = $this->validateRequest();
        
        //$route->cities()->attach($attributes['cities']); //attach
        $route->cities()->attach($attributes['first_city_id'], 
                        [
                            'second_city_id' => $attributes['second_city_id'],
                            'distance' => $attributes['distance']
                        ]);

        return $route->cities;
    }

    // public function addBusesForRoute(Route $route)
    // {
    //     $buses = request()->input('buses');

    //     $route->buses()->sync($buses); //attach

    //     return 'success';
    // }


    public function destroy(Route $route, $city)
    {
        
        $route->cities()->detach($city); //attach

        return $route->cities;
    }

    protected function validateRequest()
    {
        return request()->validate(
            [
                'first_city_id' => 'required',
                'second_city_id' => 'required',
                'distance' => 'required|numeric|gt:0'
            ],
            [
                'distance.gt' => 'Distance must be a positive number.',
            ]   
        );
    }    
}