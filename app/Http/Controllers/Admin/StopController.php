<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Stop;


class StopController extends Controller
{
    protected $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }
    
    public function store()
    {
    	
        //dd($request->input('stop_list'));
        //d0d($request);

        // $this->validate($request, [            
        //     'stop_list.*.name' => 'required|max:50',       // array validation     
        // ]);

        // $stopList = $request->input('stop_list');    	
        //$cityCode = $request->input('city_id');
        $attributes = $this->validateRequest();

        Stop::insert($attributes['stop_list']);
    	return $attributes;
    }

    public function destroy(Stop $stop)
    {
        $error = ['error' => 'No results found'];
        
        if($stop) {
            $stop->delete();
            return 'success';            
        }
        return $error;
    }

    protected function validateRequest()
    {
        return $this->request->validate([           
           'stop_list.*.city_id' => 'required',
           'stop_list.*.address' => 'required',
           'stop_list.*.phone' => 'required',
           'stop_list.*.latitude' => 'required',
           'stop_list.*.longitude' => 'required',
           'stop_list.*.name' => [
                'required',
                Rule::unique('stops')->where(function ($query) {
                    return $query
                        ->where('city_id', $this->request->input('stop_list.*.city_id'));
                        // ->where('name', $this->request->input('stop_list.*.name'));
                    }),
                ]    
        ],
        [
            'stop_list.*.name.unique' => 'The stop name :input already exists!'
        ]); 
    }
}