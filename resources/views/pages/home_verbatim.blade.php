@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        welcome to home page of obts
     {{--  <seat cities= "{{ $cities }}" ></seat>        --}}
      <seat-display cities= "{{ $cities }}" inline-template>
      	@verbatim
		    
                <div>
                    <form>
                      <div class="col-md-3">
                        <div class="form-group">
                          <label for="cityFrom"> From</label>
                          <!-- <input type="email" class="form-control" id="exampleInputEmail1" placeholder="Email" -->
                          <select v-model="selected" class="form-control" id="cityFrom">
                            <option disabled value="">Please select one</option>
                            <option v-for="city in cityList">
                              {{ city.name }}
                            </option>                           
                          </select>
                        </div>
                      </div>  

                      <div class="col-md-3">  
                        <div class="form-group">
                          <label for="cityTo">To</label>  
                          <select v-model="selectedTo" class="form-control" id="cityTo">
                            <option v-if="!error" disabled value="">Please select one</option>
                            <option v-if="error" disabled value="">{{ error }}</option>
                            <option v-for="city in cityToList">
                              {{ city.arrival_city }}                            
                            </option>                          
                          </select>                         
                        </div>
                      </div>
                        
                      <div class="col-md-4">
                        <div class="form-group">  
                            <label for="startDate">Select Date</label> 
                            <div id="sandbox-container">
                              <div class="input-group date">
                                <input name="date" id="startDate" class="form-control" type="text" v-model="startDate" placeholder="select date">
                                <span class="input-group-addon">
                                  <i class="glyphicon glyphicon-calendar"></i>
                                </span>
                              </div>
                            </div>
                        </div>
                      </div>  

                      <div class="col-md-2">
                        <button v-on:click.prevent="searchBus" class="btn btn-primary btn-search form-control">Search &nbsp;
                          <i class="fa fa-search"></i>
                        </button>
                      </div>                     
                    
                    </form>     
                    <div class="panel-body">
                        <table class="table table-striped task-table">

                            <!-- Table Headings -->
                            <thead>
                                <th>SL No.</th>                                
                                <th>Dept. Time</th>                                
                                <th>Arr. Time</th>                                
                                <th>Type</th>                                
                                <th>Available Seats</th>                                
                                <th>Fare</th>                                
                                <th>View</th>
                                <th>&nbsp;</th>
                            </thead>

                            <!-- Table Body -->
                            <tbody>
                                <tr v-for="(bus, index) in buses">
                                    <td class="table-text">
                                      <div> {{ index + 1 }} </div>
                                    </td>

                                    <td class="table-text">
                                      <div> {{ bus.departure_time }} </div>
                                    </td>
                                    <td class="table-text">
                                      <div> {{ bus.arrival_time }} </div>
                                    </td>
                                    <td class="table-text">
                                      <div> {{ bus.bus_type }} </div>
                                    </td>
                                    <td class="table-text">
                                      <div> {{ bus.available_seats }} </div>
                                    </td>
                                    <td class="table-text">
                                      <div> {{ bus.fare }} </div>
                                    </td>
                                    <td class="table-text">
                                      <div> 
                                        <button v-on:click.prevent="viewSeats(bus.schedule_id, bus.bus_id, bus.fare)" class="btn btn-success">View</button> 
                                      </div>
                                    </td>
                                </tr>                                                            
                            </tbody>
                        </table>
                        <div v-show="busError" class="alert alert-danger" role="alert">
                            <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                            <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
                            {{ busError }}
                        </div>
                    </div>
                    <div class="loading"><i v-show="loading" class="fa fa-spinner fa-pulse fa-3x text-primary"></i></div>

                    <!-- Modal -->
                    <div id="modal" class="modal" v-if="modal">
                        <div class="modal-content">
                            <div class="circle">
                                <span class="close" data-toggle="tooltip" data-placement="top" title="Press esc to close" @click="close">x</span>                  
                            </div>    
                            
                            <div class="alert alert-danger" role="alert" v-if="seatError">
                                <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                                <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
                                {{ seatError }}
                            </div>
                            <div class="row">
                              <div class="col-sm-6">
                                <div class="row">
                                    <div class="col-xs-offset-8">
                                      <button :disabled="true">Driver Seat</button>
                                    </div>              
                                    <button 
                                      class="col-xs-2"
                                      v-bind:class="{ 
                                      active : seat.checked, 
                                      booked: seat.status=='booked'? true : false, 
                                      confirmed: seat.status=='confirmed'? true : false, 
                                      empty: seat.status=='n/a'? true : false,             
                                      'col-xs-offset-2': emptySpace(seat.seat_no) }"
                                      v-for="seat in seatList"          
                                      @click="toggle(seat)"           
                                      :disabled="isDisabledSeatSelection(seat.status)"                   
                                    >               
                                      {{ seat.seat_no }} - {{ seat.status }}
                                    </button> 
                                </div>
                              </div>
                              <div class="col-sm-6">
                                <div v-show="showSelectedSeatList" class="row">
                                  <table class="table table-striped">
                                    <thead>
                                      <th>Sl.#</th>
                                      <th>Seat Selected</th>
                                      <th>Price</th>
                                      <!-- <th>&nbsp;</th> -->
                                    </thead>
                                    <tbody>
                                      <tr v-for="(seat, index) in selectedSeat">
                                        <td class="table-text">
                                          <div> {{ index + 1 }} </div>
                                        </td>
                                        <td class="table-text">
                                          <div> {{ seat.seat_no }} </div>
                                        </td>
                                        <td class="table-text">
                                           <div> {{ seat.fare }} </div>
                                        </td>                                         
                                      </tr>                                      
                                      {{ totalFareForSelectedSeats }}                                       
                                    </tbody>
                                  </table> 
                                  <span class="total"> Total Amount {{ totalFare }} </span>
                                </div>

                                <div class="row">
                                  <form>
                                      <div class="form-group">
                                        <label for="name" class="control-label">Name</label>
                                        <div class="input-group">
                                            <span class="input-group-addon"><i class="fa fa-user fa-fw"></i></span>
                                            <input id="name" type="text" class="form-control" name="name" required autofocus>
                                        </div>
                                      </div>
                                      
                                      <div class="form-group">
                                        <label for="email" class="control-label">E-Mail</label>
                                        <div class="input-group">
                                            <span class="input-group-addon"><i class="fa fa-envelope-o fa-fw"></i></span>
                                            <input id="email" type="email" class="form-control" name="email" required>
                                        </div>
                                      </div>
                                      
                                      <div class="form-group">
                                        <label for="phone" class="control-label">Mobile No.</label>
                                        <div class="input-group">
                                            <span class="input-group-addon"><i class="fa fa-mobile fa-fw"></i></span>
                                            <input id="phone" type="text" class="form-control" name="phone" required>
                                        </div>
                                      </div>                                      
                                  </form>
                                </div>
                                <button v-on:click.prevent="seatBooking()" class="btn btn-primary">Continue</button>
                              </div>
                            </div>                           
                        </div>          
                    </div> 
                  </div>  
		@endverbatim
      </seat-display>       
    </div>
</div>
@endsection
