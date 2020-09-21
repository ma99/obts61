<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

use App\Fare;

class FareController extends Controller
{
    public function store()
    {
    	$attributes = $this->validateRequest();

        return Fare::create($attributes);  
    }

    public function update(Fare $fare)
    {
    	$attributes = $this->validateRequest($fare);

        $fare->update($attributes);

        return $fare->updated_at;
    }

    public function destroy(Fare $fare)
    {
        $error = ['error' => 'No results found'];
      
        if ($fare) {
            $fare->delete();
            return 'success';            
        }

        return $error;
    }

    protected function validateRequest(Fare $fare = NULL)
    {
        return request()->validate([
           // 'city_route_id' => 'required|unique:fares',
           'city_route_id' => [
                'required',
                Rule::unique('fares')->ignore($fare ? $fare->id : null),
            ],
           'details' => 'required'
        ], [
            'city_route_id.unique' => 'Fare for this cities already exists!'
        ]);
    }
}