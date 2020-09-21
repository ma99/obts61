<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

use App\Bus;


class BusSchedulesController extends Controller
{
    protected $request;
    
    public function __construct(Request $request)
    {   
        $this->request = $request;
    }

    public function store(Bus $bus)
    {
        // $routes = request()->input('routes');
        // dd($routes);

        $attributes = $this->validateRequest();
        
        $bus->schedules()->attach($attributes['schedules'], 
            [
                'departure_city_id' => $attributes['departure_city_id']
        ]);

        return $bus->schedules()->get();
    }

    // public function addBusesForRoute(Route $route)
    // {
    //     $buses = request()->input('buses');

    //     $route->buses()->sync($buses); //attach

    //     return 'success';
    // }


    public function destroy(Bus $bus, $schedule)
    {
        
        $bus->schedules()->detach($schedule); //attach
        
        return $bus->schedules()->get();
    }

    protected function validateRequest()
    {
        // return request()->validate(
        //     [
        //         'schedules' => 'required',
        //         'departure_city_id' => 'required',
        //     ],
        //     [
        //         'schedules.' => 'Distance must be a positive number.',
        //     ]   
        // );

        return request()->validate([
             'schedules.*' => 'required',
            'bus_id' => [
                'required',
                Rule::unique('bus_schedule')->where(function ($query) {

                    return $query
                        ->whereIn('schedule_id', $this->request->schedules);
                    }),
                ],
            'departure_city_id' => 'required',
        ],
        [
            'bus_id.unique' => 'This schedule(s) already available for this bus.',
        ]);
    }    
}