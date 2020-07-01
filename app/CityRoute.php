<?php

namespace App;

use Illuminate\Database\Eloquent\Relations\Pivot;

class CityRoute extends Pivot
{
    //
    public $incrementing = true;

    public function fare()
    {
        return $this->hasOne(Fare::class, 'city_route_id');
    }

    public function getCityRouteBy($departure_city, $arrival_city)
    {
        return CityRoute::where(function($query) use ($departure_city) {
            $query->where('first_city_id', $departure_city)
                ->orWhere('second_city_id', $departure_city);
        })
        ->where(function($query) use ($arrival_city)    {
            $query->where('first_city_id', $arrival_city)
                ->orWhere('second_city_id', $arrival_city);
        })
        ->first();
    }
}