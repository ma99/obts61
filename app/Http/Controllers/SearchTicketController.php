<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Bus;
use App\City;
use App\Fare;
use App\Route;
use App\Booking;
use App\CityRoute;

class SearchTicketController extends Controller
{
	protected $cityRoute;
	protected $route;
	protected $fare;
	protected $booking;

	function __construct(CityRoute $cityRoute, Route $route, Fare $fare, Booking $booking)
	{
		$this->cityRoute = $cityRoute;
		$this->route = $route;
		$this->fare = $fare;
		$this->booking = $booking;
	}
    public function index()
    {
    	//dd('test');
    	$cities = City::all();
    	//dd($cities);
    	return view('pages.home', compact('cities'));
    }

    public function searchTicket() 
    {
		$error = ['error' => 'Schedules not fixed.'];
		
		$departure_city  = request()->input('from');
		$arrival_city = request()->input('to');		
		$date = request()->input('date');

		$date = date("Y-m-d", strtotime($date)); //wk if input date is dd-mm-yyyy format in vue script
		$cityRouteInfo = $this->cityRoute->getCityRouteBy($departure_city, $arrival_city);

		//return $cityRouteInfo;
		if ( is_null($cityRouteInfo) ) { 
			return 
				$error = ['error' => 'Service not available.'];
		}

		$route = $this->route->getRouteBy($cityRouteInfo->route_id);		
		//return $route;

		$route = $route->load([
			'buses' => function($query) use ($departure_city) {
				$query->whereHas('schedules', function($q) use ($departure_city) {
					$q->where('departure_city_id', $departure_city);
				});
			},

			'buses.schedules' => function($query) use ($departure_city) {
				$query->where('departure_city_id', $departure_city);
			},
		]);

	 	if ($route->buses->count())  {
		 	
		 	foreach ($route->buses as $bus) {
		 		//dd($bus->schedules);
		 		
		 		$schedules = $bus->schedules;

		 		if ($schedules->count()) {

			 		foreach ($schedules as $schedule) {

						$busScheduleId = $schedule->pivot->id;
						$bookings = $this->booking->getBookingsByBusScheduleIdOnDate($busScheduleId, $date);
						//dd($bookings);

				 		if ($bookings->count()) {
							
							$availableSeats = 0;				 			
				 			$totalSeatsBooked = 0;

				 			foreach ($bookings as $booking) {
					 			
					 			$totalSeatsBooked = $totalSeatsBooked + $booking->total_seats; 
				 			}
				 			$availableSeats = $bus->seat_plan->total_seats - $totalSeatsBooked;
				 		}
				 		else {
				 			$availableSeats = $bus->seat_plan->total_seats;
				 		}

				 		//dd($availableSeats);
				 		//$fare = $arrival_city->cityFareBy($route)->getFareByBus($bus->type); 
				 		$type = $bus->type;
				 		$fare =$this->fare->getFareBy($cityRouteInfo->id)->getFareByBus($type['key']); 
			

				        $buses[] = [
				        	//'route_id'	=> $route->id,
							'bus_id' => $bus->id,
							'bus_number_plate' => $bus->number_plate,
							'schedule_id' => $schedule->id,
							'bus_schedule_id' => $busScheduleId,
							'bus_type' => $type->name,
							'fare' => $fare,
							'available_seats' => $availableSeats,
							'departure_time' => $schedule->departure_time,
							'arrival_time' => $schedule->arrival_time,
						];
			 		}
		 		}
		 	}
		 	
		 	//$buses = json_decode(json_encode($buses));
		 	//dd($buses);		
			return $buses; 
	 	} 	
	 	return $error;
    }

    public function viewSeats(Bus $bus)
    {
    	$busScheduleId = request()->input('bus_schedule_id');     	
    	$busFare = request()->input('bus_fare');
    	$date = request()->input('date');

    	// $busScheduleId = 1;
    	// $busFare = '1500';
    	// $date = '24-04-2020';

		$date = date("Y-m-d", strtotime($date)); //wk if input date is dd-mm-yyyy format in vue script 

		$seatsBySeatPlanOfBus = $this->getSeatsBySeatPlanOf($bus, $busFare);
    	
		$seatsByBooking = $this->getSeatsByBookingOn($date, $busScheduleId, $busFare);

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
    
    public function getSeatsByBookingOn($date, $busScheduleId, $busFare) 
    {
  		$bookings = $this->booking->getBookingsByBusScheduleIdOnDate($busScheduleId, $date);
		
		if ($bookings->count()) {
			foreach ($bookings as $booking) {
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
}