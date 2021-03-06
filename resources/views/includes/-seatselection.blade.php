<div class="row row-cols-1 row-cols-md-2">
  <div class="seat-layout col mb-4">
    <div class="card">
      <div class="card-header">Seat Plan</div>      
      <div class="card-body">
        <div class="row driver-seat">                      
          <button class="btn btn-outline-secondary" :disabled="true">Driver</button>
        </div>
        <div class="row justify-content-center" style="margin-left: -5px;">
              <!-- <button
                class="btn btn-outline-primary col-xs-2"
                v-bind:class="{
                  empty: seat.status=='n/a'? true : false,                                    
                  'col-xs-offset-2': emptySpace(index, seat.no) }"
                v-for="(seat, index) in seatList"
                v-on:click.prevent=""
                :disabled="buttonIsDisabled(seat.status)"
              >               
                {{-- {{ seat.no }} --}}
              </button>  -->
              <button
                class="btn btn-outline-secondary col-xs-2"
                v-bind:class="{ 
                  'is-active': seat.checked, 
                  booked: seat.status=='booked'? true : false,
                  buying: isSeatBuying(seat.status),                 
                  confirmed: seat.status=='confirmed'? true : false, 
                  empty: seat.status=='n/a'? true : false,             
                  'col-xs-offset-2': emptySpace(index, seat.seat_no) }"
                v-for="(seat, index) in seatList"          
                @click="toggle(seat)"           
                :disabled="isDisabledSeatSelection(seat.status)"                   
              >               
                <span v-show="!isSeatBuying(seat.status)" > @{{ seat.seat_no }} </span>
                <span v-show="isSeatBuying(seat.status)" class="fa fa-refresh fa-spin text-danger"></span>  
               
              </button> 
        </div>
      </div>
      <!-- {{-- card-footer --}} -->           
      <div class="card-footer">
        <show-alert :show="showAlert" :type="alertType" @cancel="showAlert=false"> 
        <!-- altert type can be info/warning/danger -->
          <strong>@{{ seatNo }} </strong> has been <strong>@{{ seatStatus }} </strong>
        </show-alert>
      </div>  
    </div>
  </div>
  <div v-show="isSeatSelected" class="col mb-4">
    <div class="card">      
      <div class="card-header">Selected Seat Info</div>
      <div class="card-body p-0">
        <table class="table table-striped">
          <thead>
            <th>Sl.#</th>
            <th>Seat Selected</th>
            <th>Price</th>
            <th>Remove</th>
            <!-- <th>&nbsp;</th> -->
          </thead>
          <tbody>
            <tr v-for="(seat, index) in selectedSeat">
              <td class="table-text">
                <div> @{{ index + 1 }} </div>
              </td>
              <td class="table-text">
                <div> @{{ seat.seat_no }} </div>
              </td>
              <td class="table-text text-primary">
                 <div> @{{ seat.fare }} </div>
              </td>
              <td class="table-text">
                 <div>
                    <button @click.prevent="removeSeat(seat.seat_no, seat)" type="button" class="close" data-dismiss="alert" aria-label="Close">
                     <i class="fa fa-times text-danger" aria-hidden="true"></i>
                    </button>
                  </div>
                </td>                                          
            </tr>                                      
            {{-- @{{ totalFareForSelectedSeats }} --}}      
          </tbody>
        </table>       
      </div>
      <div class="card-footer total"><strong>Total Amount:</strong> @{{ totalFare }} </div>        
    </div>
  </div>
  <div class="col mb-4">
    <!-- Pickup & Dropping Selection -->
    <div class="card card-success">
      <div class="card-header">Pickup & Dropping</div>
      <div class="card-body">
        @include('includes.stops')
      </div>
    </div>      
  </div>
  <div class="col mb-4">
    @if (auth()->check())
      @if (auth()->user()->isNormalUser())
        @include('includes.user')
      @else
        @include('includes.guest')
      @endif                          
    @else
      @include('includes.guest')
    @endif       
  </div>
</div>
