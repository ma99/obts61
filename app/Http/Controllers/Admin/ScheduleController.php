<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Schedule;

class ScheduleController extends Controller
{
    protected $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store()
    {
        $attributes = $this->validateRequest();

        return Schedule::create($attributes);  
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Schedule  $schedule
     * @return \Illuminate\Http\Response
     */
    public function show(Schedule $schedule)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Schedule  $schedule
     * @return \Illuminate\Http\Response
     */
    public function edit(Schedule $schedule)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Schedule  $schedule
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Schedule $schedule)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Schedule  $schedule
     * @return \Illuminate\Http\Response
     */
    public function destroy(Schedule $schedule)
    {
        $error = ['error' => 'No results found'];
      
        if ($schedule) {
            $schedule->delete();
            return 'success';            
        }

        return $error;
    }
    
    protected function validateRequest()
    {
        return request()->validate([
            'departure_time' => [
                'required',
                Rule::unique('schedules')->where(function ($query) {

                    return $query
                        ->where('departure_time', $this->request->departure_time)
                        ->where('arrival_time', $this->request->arrival_time);
                    }),
                ],
            'arrival_time' => 'required|after:departure_time',
        ],
        [
            'departure_time.unique' => 'This schedule is already available.',
            'arrival_time.after' => 'The arrival time must be after departure time.'
        ]);
    }
}
