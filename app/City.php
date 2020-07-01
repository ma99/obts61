<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    protected $guarded = [];
    protected $casts = [
        'id' => 'integer', 
    ];

    public function district()
    {
    	return $this->belongsTo(District::class);
    }

    public function routes()
    {
        return $this->belongsToMany(Route::class)
                    ->using(CityRoute::class); 
    }

    public function stops()
    {
    	return $this->hasMany(Stop::class);
    }

    // public function fares()
    // {
    //     return $this->hasMany(Fare::class);
    // }

    // public function cityFareBy($cityRoute)
    // {
    //     return $this->hasMany(Fare::class)
    //                 ->where('city_route_id', $cityRoute->id)->first();
    // }
    
	public function path()
	{
	    return "/cities/{$this->id}";
	}
}
