<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Route;
use App\Bus;
use App\City;

class SearchTicketController extends Controller
{
    public function index()
    {
    	//dd('test');
    	$cities = City::all();
    	//dd($cities);
    	return view('pages.home', compact('cities'));
    }

    public function searchTicket() 
    {
		$error = ['error' => 'No results found'];
		
		$departure_city  = request()->input('from');
		$arrival_city = request()->input('to');		
		//dd($arrival_city);
		//$arrival_city = $city['name'];		
		$date = request()->input('date');

		$date = date("Y-m-d", strtotime($date)); //wk if input date is dd-mm-yyyy format in vue script

		$route = $this->getRouteBy($departure_city, $arrival_city);		
		//dd($route);
		//dd($route->cities()->first());
		$arrival_city = $route->cities[0];

		
		$route = $route->load([
			'buses.schedules.bookings' => function($query) use ($date) {
				$query->where('date', $date);
		}]);

	 	if ($route->buses->count())  {
		 	
		 	foreach ($route->buses as $bus) {
		 		//dd($bus->schedules);
		 		//dd($bus->schedulesBy($route->id)->get());
		 		$schedules = $bus->schedulesBy($route->id)->get();

		 		if ($schedules->count()) {

			 		foreach ($schedules as $schedule) {
				 		
				 	// 	$schedule = $schedule->load([
				  //   		'bookings' => function($query) use ($date) {
						// 		$query->where('date', $date);
						// }]);
						$schedule = $this->getScheduleWithBookingsOn($date, $schedule);

				 		if ($schedule->bookings->count()) {
							
							$availableSeats = 0;				 			
				 			$totalSeatsBooked = 0;

				 			foreach ($schedule->bookings as $booking) {
					 			
					 			$totalSeatsBooked = $totalSeatsBooked + $booking->total_seats; 
				 			}
				 			$availableSeats = $bus->seat_plan->total_seats - $totalSeatsBooked;
				 		}
				 		else {
				 			$availableSeats = $bus->seat_plan->total_seats;
				 		}

				 		//$fare = $arrival_city->cityFareBy($route)->getFareByBus($bus->type); 
				 		$type = $bus->type;
				 		$fare = $arrival_city->cityFareBy($route)->getFareByBus($type['key']); 

				        $buses[] = [
				        	//'route_id'	=> $route->id,
							'bus_id' => $bus->id,
							'bus_type' => $type->name,
							'fare' => $fare,
							'available_seats' => $availableSeats,
							'schedule_id' => $schedule->id,
							'departure_time' => $schedule->departure_time,
							'arrival_time' => $schedule->arrival_time,
						];
			 		}
		 		}
		 	}
		 	$buses = json_decode(json_encode($buses));
		 	//dd($buses);		
			return $buses; 
	 	} 	
	 	return $error;
    }

    public function getRouteBy($departure_city, $arrival_city)
    {
		// return Route::where('departure_city', $departure_city)
		// 			->where( 'arrival_city', $arrival_city)
		// 			->first();
		//$city_name = $arrival_city->name;
		return Route::where('departure_city', $departure_city)
					->with(['cities' => function ($query) use ($arrival_city) {
    					$query->where('name', $arrival_city);
				}])->first();			
    }

    public function getScheduleWithBookingsOn($date, $schedule)
    {
    	return $schedule->load([
		    		'bookings' => function($query) use ($date) {
						$query->where('date', $date);
				}]);
    }

    public function viewSeats(Bus $bus)
    {
    	$scheduleId = request()->input('schedule_id');     	
    	$busFare = request()->input('bus_fare');
    	$date = request()->input('date');

		$date = date("Y-m-d", strtotime($date)); //wk if input date is dd-mm-yyyy format in vue script 

		$seatsBySeatPlanOfBus = $this->getSeatsBySeatPlanOf($bus, $busFare);


  		$schedule = $this->getScheduleOfBusBy($scheduleId, $bus);
    	
		$seatsByBooking = $this->getSeatsByBookingOn($date, $schedule, $busFare);

		if ( count($seatsByBooking) >0 && count($seatsBySeatPlanOfBus) >0) {

			return $result = $this->mergeArray($seatsByBooking, $seatsBySeatPlanOfBus);
			
		}
		
		if (count($seatsBySeatPlanOfBus) >0) {
			return $seatsBySeatPlanOfBus; 	
		} 
		return $error = ['error' => 'Not Available'];	
    }

    public function mergeArray($seatBooking, $seatPlan)
    {  
	    for ($i=0; $i < count($seatBooking) ; $i++) { 
	    	for ($j=0; $j < count($seatPlan) ; $j++) { 
	    		if ( $seatPlan[$j]['status'] == 'available') {
	        		if ($seatPlan[$j]['seat_no'] == $seatBooking[$i]['seat_no']) {
	        			$seatPlan[$j]['status'] = $seatBooking[$i]['status'];
	        			$seatPlan[$j]['special'] = $seatBooking[$i]['special'];
	        			break;
	        		}
	        	}	    		
	    	}
	    }

	    return $seatPlan;
    }
    public function getScheduleOfBusBy($scheduleId, $bus)
    {
    	$bus = $bus->load([
    		'schedules' => function($query) use ($scheduleId) {
				$query->where('schedule_id', $scheduleId);
		}]);

		return $bus->schedules[0];    
    }
    
    public function getSeatsByBookingOn($date, $schedule, $busFare) 
    {
  		$schedule = $this->getScheduleWithBookingsOn($date, $schedule);
		
		if ($schedule->bookings->count()) {
			foreach ($schedule->bookings as $booking) {
				//$seats = Seat::where('booking_id', $booking->id)->get(); //collection
				//$booking = $booking->load('seats'); //collection
				//dd($booking->seats);				
					foreach ($booking->seats as $seat) {
						$arr_seats[] = [								
							'seat_no' => $seat->seat_no,
							'status'  => $seat->status,
							'special' => $seat->special,
							'checked' => false,
							'fare'	  => $busFare
						];
					}										
			}
			return $arr_seats;
		}
		return $arr_seats = [];			 
    }

    public function getSeatsBySeatPlanOf($bus, $busFare) 
    {
		//$seats = SeatPlan::where('bus_id', $busId)->first(); //collection
		$seats = $bus->seat_plan->seat_list; 
        //dd($seats);//->seat_list);
        if (count($seats) < 1) {
        	return;
        }
        
		foreach ($seats as $seat) {
			$arr_seats[] = [								
				'seat_no' => $seat['no'],
				'status'  => $seat['status'],
				'special' => $seat['special'],
				'checked' => false,
				'fare'	  => $busFare, 	 
			];
		}							
		return $arr_seats; 
    }

    /*public function unique_multidim_array($array, $key)
    {
	    $temp_array = [] ;// = array();
	    $i = 0;
	    $key_array = []; // array();
	   
	    foreach($array as $val) {
	        if (!in_array($val[$key], $key_array)) {
	            $key_array[$i] = $val[$key];
	            $temp_array[$i] = $val;
	        }
	        $i++;
	    }
	    return $temp_array;
	}     */
}