<script>
    export default {
      props: ['cities'],
      
      data() {
          return {
              alertType: '',
              bookedSeatInfo: { },
              busId:'',
              busScheduleId:'',
              busError: false,
              buses:[],
              cityList:[],
              availableCityList: [],
              availableStopList: [],
              pickupStops: [],
              droppingStops: [],
              cityToList:[],
              //error: false,
              dataErrors: [],
              error: {
                city: false,
                pickupPoint: false,
                droppingPoint: false
              },
              loading: false,
              message: '',
              modal: false,
              showAlert: false, // for alert Component
              showSearch: true,
              showSchedule: false,              
              scheduleId:'',
              selection: '',
              startDate: '11-04-2020',               
              selectedBus: '',
              selectedCityFrom: 'Dhaka',
              selectedTo: 'Sylhet',
              selectedPickupPoint: '',
              selectedDroppingPoint: '',
              //url: 'seatbooking',             
              url: 'bookings',             
              // seat display
              seatChar:["A","B", "C" , "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"],                             
              seatNo: '',
              seatStatus: '',              
              seatError: false,                                 
              selectedSeat: [],
              seatList: [],              
              indexList: [],
              index: 2, // space starting from this index then 2+4, 6+4
              numberOfRow: '',              
              totalFare: 0,
              totalSeats: 0,              
              // end seat display
              //guestUser: true,   
              payment: {
                method: 'cash',
                transaction: ''
              },           
              userInfo: {
                id: '',
                name: '',
                phone: '',
                email:'',
                error: '',
              },
              userExist: false,
              form: new Form({  //data as object
                name: '',
                email:'',
                phone:'',
                //non form data
                bus_id: '',
                date: '',
                schedule_id: '',
                bus_schedule_id: '',
                selected_seats: '',
                total_seats: '',
                amount: '',
                pickup_point: '',
                dropping_point:'',
              })
          }
      },
      
      mounted() {
           console.log('Seat search Component ready.');
           //this.createIndexList();            
           //this.cityList = JSON.parse(this.cities);
           this.enableScroll();         
           this.fetchCities();
           this.fetchStops();
           this.showDate();                      
            // Echo.channel('mychannel.1')
            //   .listen('SeatStatusUpdatedEvent', this.updateSeatStatus); 
          this.eventListenThroughBroadcastChannel();
      },
      watch: {
       'form.phone'(val, oldVal) {
        this.getUserInfoIfExist(this.form.phone);
       },
       seatStatus() {        
        var type = this.seatStatus;
        switch (type) {
          case 'available':
            this.alertType = 'success';           
            break;            
          case 'booked':
           this.alertType = 'warning';
            break;          
          case 'confirmed':
            this.alertType = 'danger';           
            break;  
          case 'cancelled':
            this.alertType = 'info';
            break;
          default:
            console.log('Sorry, we are out of ' + type + '.');
        }
       },
       buses() {
        this.isBusAvailable();
        //this.sortBusByDepartureTime(); 
       }, 
       selectedCityFrom() {
          //console.log();
         // this.fetchCityToList(this.selectedCityFrom);                        
          //this.pickupStopsBy(this.selectedCityFrom);   // Pickup Area List based On From City       
          
         //this.arr.push(val);
       },
       selectedTo() {
          //this.buses=[];
          //this.droppingStopsBy(this.selectedTo);   // Pickup Area List based On From City       
       },      
       
        seatList() {
            this.createIndexList();
        }
      },
      computed: {
        // userNotExist() {        
        //   return (!this.userExist ||
        //     this.userInfo.error
        //     )
        //    ? true : false;
        // },
        showDataErrors() {
          return (this.dataErrors.length > 0) ? true : false;
        },
        // routeName() {
        //   return '/pay/'+this.bookedSeatInfo.booking_ref;
        // },
        totalFareForSelectedSeats() {          
          var fare = 0;
          let len = this.selectedSeat.length;
          for (var i=0; i<len; i++){
            //fare = fare + parseInt(this.selectedSeat[i].fare, 10);
            fare = fare + parseInt(this.getFareFor(this.selectedSeat[i]), 10);
          }
          //console.log('total fare:', fare);
          //console.log('total seats:', len);
          this.totalFare = fare; 
          this.totalSeats = len;         
        },
        disablePayButton() {
          if ( Object.keys(this.bookedSeatInfo).length === 0 ) return true; // empty object

          if (this.payment.method == 'pos') { 
            return ( this.payment.transaction == ''  || this.bookedSeatInfo.booking_ref == '') ?
                true : false;
          }
          return ( this.bookedSeatInfo.booking_ref == '' ) ?
                true : false;
        },
        // validPaymentOption() {
        //   return ( this.payment.method == 'pos' && 
        //     this.payment.transaction != "" ) ?
        //     true : false;
        // },
        isDisabled() {        
          return ( this.selectedCityFrom == "" || this.selectedTo == "" || this.startDate =='' || !this.validJourneyDate ) ? true : false;
       },

       validJourneyDate() {
        //let today = new Date().toISOString().slice(0, 10);
        let date = this.startDate.split('-');

        let today = new Date();
        let dateOfJourney = new Date(`${date[2]}-${date[1]}-${date[0]} 23:50:00`); //yyyy-mm-dd        
        return (dateOfJourney >= today) ? true : false;
       },
        //showSelectedSeatList() {
        isSeatSelected() {
          let len = this.selectedSeat.length;
          return ( len >0 ) ? true : false;
        },
        isValid() {
            return this.isSeatSelected != false &&
              this.selectedPickupPoint != '' &&
              this.selectedDroppingPoint != ''
          },
        isSeatBooked() {
          let len = Object.keys(this.bookedSeatInfo).length;
          //return ( len >0 ) ? true : false;
          if (len >0) {
            this.showSearch = false;
            return true;
          } 
          return false;
        },
      },
      methods: {
        eventListenThroughBroadcastChannel() {
          Echo.channel('mychannel.1')
              .listen('SeatStatusUpdated', this.updateSeatStatus); 
        },
        getIdOfCity(name) {
          return this.availableCityList.find(city => city.name == name).id;
        },
        getUserInfoIfExist(phone) {
          if (phone.length < 11) {
            this.userInfo.error = 'Phone number not given or Invalid number';
            this.resetUserInfo();
            return;
          }
          this.loading = true;          
          this.userInfo.error = ''; 
          this.resetUserInfo();
          var vm = this;                
          axios.get(`/users/${phone}`)
              .then(function (response) {                  
                response.data.error ? vm.error = response.data.error : vm.userInfo = response.data;
                if( !vm.isEmpty(vm.userInfo) ){                  
                  vm.userExist = true;
                  vm.userInfo.error = '';
                  vm.fillupUserForm(vm.userInfo);
                  //console.log('not empty');                 
                }       
                vm.loading = false;
          });
        },
        fillupUserForm(userInfo) {          
          this.form.phone = userInfo.phone;
          this.form.name = userInfo.name;
          this.form.email = userInfo.email;          
        },
        isEmpty(obj) {
          //console.log('lenn='+ Object.values(obj).length);
          //return Object.keys(obj).length === 0;
          return Object.values(obj).length <= 1;
        },
        resetUserInfo() {
          this.userExist = false;
          this.form.name = '';
          this.form.email = '';
        },
        sortBusByDepartureTime() {
          var vm = this;
          this.buses.sort(function(a, b) {
            var timeA = vm.convertTime12to24(a.departure_time);
             // ignore upper and lowercase
            var timeB = vm.convertTime12to24(b.departure_time );// ignore upper and lowercase
            if (timeA < timeB) {
              return -1;
            }
            if (timeA > timeB) {
              return 1;
            }
            // names must be equal
            return 0;
          });
        },
        convertTime12to24(time12h) {
          const [time, modifier] = time12h.split(' ');

          let [hours, minutes] = time.split(':');

          if (hours === '12') {
            hours = '00';
          }

          if ( modifier === 'PM' || modifier === 'pm') {
            hours = parseInt(hours, 10) + 12;
          }

         // return `${hours}:${minutes}`;
          return `${hours}${minutes}`;
        },
        enableScroll() {
          //initializes the plugin with empty options
          $('#scrollbar').overlayScrollbars({ /* your options */ 
            sizeAutoCapable: true,
            overflowBehavior : {
              x : "scroll",
              y : "scroll"
            },
            scrollbars: {
              autoHide: "never",
              clickScrolling: true
            }
          }); 
        },   
        getFareFor(seat) {
          //console.log(seat);
          let combinedFare = this.isCombinedType(seat.fare);
          if (combinedFare) {
            let fares = seat.fare.split('|');
            let f1, f2;
            f1 = parseInt(fares[0], 10);
            f2 = parseInt(fares[1], 10);                        

            return (seat.special) ? 
                    ( (f1 > f2) ? f1 : f2 ) : ( (f1 < f2) ? f1 : f2 );
          }
          return seat.fare;
        },        
        isCombinedType(fare) {
          return fare.includes('|') ? true : false;
        },
        close() {
                this.modal = false;
                this.loading = false;                
                this.selectedSeat = [];
                if(this.form.errors) {
                  this.form.errors.clear();                
                }
        },
        isBusAvailable() {
          let len = this.buses.length;
          //this.showSchedule = ( len >0 && this.error==false && this.selectedTo !=="" ) ? true : false;  //true show table
          this.showSchedule = ( len >0 ) ? true : false;  //true show table
        },
        isSeatBuying(seatStatus){
          return seatStatus == 'buying' ? true : false;
        },
        updateSeatStatus(evnt) {          
          var seatNo = evnt.seat.seat_no;
          console.log('seaaatno=', seatNo);
          //var vm = this;
          if ( this.busScheduleId == evnt.busScheduleId &&
              this.startDate == evnt.date) {
            
              var indx = this.seatList.findIndex(function(seat){ 
                // here 'seat' is array object of selectedSeat array
                return seat.seat_no == seatNo;
              });

             // this.seatList[indx].status = "booked"; //prev
            this.seatList[indx].status = evnt.seat.status;
            this.seatNo = seatNo;
            this.seatStatus = evnt.seat.status;         
            this.showAlert = true;
          }
          console.log(evnt.seat.seat_no, evnt.busScheduleId, evnt.date);
        },
        
        searchBus() {         
          console.log(this.startDate);

          this.busError = false;
          this.loading = true;
           
          var vm = this;
          this.buses ='';
          axios.get('/search', {
              params: {                
                // from: this.selectedCityFrom,
                // to: this.selectedTo,
                from: this.getIdOfCity(this.selectedCityFrom),
                to: this.getIdOfCity(this.selectedTo),
                date: this.startDate,              
              }  
            })          
            .then(function (response) {             
               console.log(response.data);
               response.data.error ? vm.busError = response.data.error : vm.buses = response.data;
               vm.sortBusByDepartureTime(); 
               vm.loading = false;
               if (vm.busError) {
                  vm.seatNotAvailableAlert('SCHEDULE', 'warning');
                  return;
               }
            });
        },
        //viewSeatsOf(busScheduleId, busId, busFare) {
        viewSeatsOf(bus) {
          // console.log('busSchId=', scheduleId);
          // console.log('busId=', busId);
          this.selectedBus = bus;
          this.seatError = false;
          this.selectedSeat = [];
          this.busScheduleId = bus.bus_schedule_id;
          this.busId = bus.bus_id;
          this.selectedPickupPoint = '';
          this.selectedDroppingPoint = '';
         
          this.loading = true;
          this.pickupStopsBy(this.selectedCityFrom);
          this.droppingStopsBy(this.selectedTo);
          var vm = this;
          axios.get('/viewseats/buses/'+bus.bus_id, {
              params: {
                // from: this.selectedCityFrom,
                // to: this.selectedTo,
                // date: this.startDate,
                bus_schedule_id: bus.bus_schedule_id,
                bus_id: bus.bus_id,
                bus_fare: bus.fare,
                date: vm.startDate,
              }  
            })          
            .then(function (response) {             
                console.log(response.data);
                response.data.error ? vm.seatError = response.data.error : vm.seatList = response.data;
                vm.loading = false;
                if (vm.seatError) {
                  vm.seatNotAvailableAlert('SEAT PLAN', 'error');
                  return;
                }
                vm.modal = true;

            });
        },

        seatNotAvailableAlert(val, type) {
          swal({
            //title: "Sorry! Not Available",
            title: val,
            text: "Not Available!",
           // title: '<span style="color:#F8BB86"> <strong>'+val+'</strong></span></br>Not Available. Sorry!',
            //text: '<span style="color:#F8BB86"> <strong>'+val+'</strong></span> Not Available.',
            //html: true,
            //type: "info",
            //type: type,
            icon: type,
            timer: 2000,
            //showConfirmButton: false,
            closeOnClickOutside: true,
          });
        },
        seatBookingByStaff() {         
          // this.url = (this.userInfo.hasOwnProperty('id')) ? `bookings/byStaff/${this.userInfo.id}` : 'bookings/byStaff';
          // if (this.userInfo.name == '' && this.form.name != '' ) {
          //   this.userInfo.name = this.form.name;
          // }
          if (this.userExist) {
            this.url = `bookings/byStaff/${this.userInfo.id}`;
          } else {
            this.url = 'bookings/byStaff';
            this.userInfo.phone = this.form.phone;
            this.userInfo.name = this.form.name;
          }
          var vm = this; 
          swal({
            title: "Are you sure?",
            text: "This will register a BOOKING for you",
            icon: "info",                 
            //dangerMode: true,
            buttons: {
                cancel: "cancel",
                confirm: {
                  text: "Yes! Book It.",
                  value: true,
                },                                
            },
          })
          .then((value) => {
            if (value) {

              vm.loading = true;
              vm.buses = []; // hide table
              vm.changeStatusOfSelectedSeat(vm.selectedSeat); 
              // // non form data  
              vm.form.bus_id = vm.busId;
              vm.form.date = vm.startDate;
              //vm.form.schedule_id = vm.scheduleId;
              vm.form.bus_schedule_id = vm.busScheduleId;
              vm.form.selected_seats = vm.selectedSeat;
              vm.form.total_seats = vm.totalSeats;
              vm.form.amount = vm.totalFare; 
              vm.form.pickup_point = vm.selectedPickupPoint; 
              vm.form.dropping_point = vm.selectedDroppingPoint; 


              vm.form.post(vm.url)
                  //.then(response => alert('Wahoo!'));
              .then(function (response) {
                 //console.log(response.data)
                 vm.selectedSeat= [];                                  
                 vm.bookedSeatInfo = response;
                 vm.modal = false;
                 vm.loading = false;
                 //console.log('res=', response);
              })
              .catch(function (error) {
                console.log(error);
                vm.loading = false;
              });
              
            } 
            
          }); 
        },
        seatBookingByUser() {          
          var vm = this; 
          swal({
            title: "Are you sure?",
            text: "This will register a BOOKING for you",
            icon: "info",                 
            //dangerMode: true,
            buttons: {
                cancel: "cancel",
                confirm: {
                  text: "Yes! Book It.",
                  value: true,
                },                                
            },
          })
          .then((value) => {
            if (value) {

              vm.loading = true;
              vm.buses = []; // hide table
              vm.changeStatusOfSelectedSeat(vm.selectedSeat);               

              axios.post(vm.url, {
                //bus_id: vm.busId,
                date: vm.startDate,
                //schedule_id: vm.scheduleId,
                bus_schedule_id: vm.busScheduleId,
                selected_seats:vm.selectedSeat,
                total_seats: vm.totalSeats,
                amount: vm.totalFare,
                pickup_point:  vm.selectedPickupPoint,
                dropping_point: vm.selectedDroppingPoint 
              })                           
              .then(function (response) {
                 //console.log(response.data)
                 vm.selectedSeat= [];
                 vm.bookedSeatInfo = response.data;
                 vm.loading = false;
                 vm.modal = false;
                 // response.data.error ? vm.busError = response.data.error : vm.buses = response.data;
              })
              .catch(function (error) {
                //console.log('error='+ error);
                console.log(error.response.data.errors);
                vm.dataErrors = Object.values(error.response.data.errors);
                console.log(vm.dataErrors);
                vm.loading = false;
              });              
            } //if            
          }); 
        },
        // showDataErrors() {
        //   return (this.dataErrors.length > 0) ? true : false;
        // },
        changeStatusOfSelectedSeat(selectedSeat) {
          var vm = this;
          selectedSeat.forEach( function(seat){
            seat.status = (vm.url == 'bookings') ? 'booked' : 'buying';
            //seat.status = 'buying';
          });
        },
        fetchCities() {
          this.loading = true;
          this.availableCityList= [];            
          var vm = this;                
          axios.get('/api/cities')  
              .then(function (response) {
                 response.data.error ? vm.error = response.data.error : vm.availableCityList = response.data;
                 vm.loading = false;
          });
        },
        fetchStops() {
          this.loading = true;
          this.availableStopList= [];            
          var vm = this;                
          axios.get('/api/stops')  
              .then(function (response) {
                 response.data.error ? vm.error = response.data.error : vm.availableStopList = response.data;
                 vm.loading = false;
          });
        },        
        // getCityIdBy(cityName) {
        //   let city = this.availableCityList.find(city => city.name == cityName);
        //   return city.id;
        // },
        pickupStopsBy(city) {          
          this.error.pickupPoint = false;
          this.loading = true;
          let cityId = this.getIdOfCity(city);      
      
          this.pickupStops = [];          
          this.pickupStops =  this.availableStopList.filter(stop => stop.city_id == cityId);
          this.loading = false;
        },

        droppingStopsBy(city) {          
          this.error.droppingPoint = false;
          this.loading = true;
          let cityId = this.getIdOfCity(city);
          
          this.droppingStops = [];          
          this.droppingStops =  this.availableStopList.filter(stop => stop.city_id == cityId);
          this.loading = false;
        },        

        showDate() {
          var vm = this;
          $('#sandbox-container .input-group.date').datepicker({
              format: 'dd-mm-yyyy',                        
              startDate: '0d',
              todayHighlight: true,
              autoclose: true
          }).on("changeDate", () => {vm.startDate = $('#sandbox-container #startDate').val()});

        },
        testDate() {
          console.log(this.startDate); // the startDate value is ''
        },
        
        /*** seat display methods ******/
        createIndexList() {
            this.indexList=[];
            var index = this.index;
            //var numberOfRow = this.numberOfRow;            
            var seatListLength =  this.seatList.length;
            // if (seatListLength < 5 ) {
            //     this.indexList.push(index);
            //     return;
            // } 
            
            var numberOfRow = (seatListLength-1) /4; //2
            this.numberOfRow = numberOfRow;
            var r;
            for ( r=1; r<numberOfRow; r++ ) { 
                this.indexList.push(index);
                index = index+4; 
                //console.log('index', index);
            }
        },

        emptySpace(index, seatNo) {           
            
            if ( this.isFiveCol(seatNo) ) {
              return false; // no need empty space between columns
            }
            /*var seatNumber = parseInt(seatNo.match(/\d+/),10);            
            return ( (seatNumber % 3) == 0 ) ? true : false;*/
            return this.isEmptySpaceAvailable(index);

        },
        
        isFiveCol(seatNo) {          
          /*var seatListLength =  this.seatList.length;
          var numberOfRow = (seatListLength-1) /4; //2*/
          var lastRowChar = this.seatChar[numberOfRow-1] || ''; //B
          var numberOfRow = parseInt(this.numberOfRow);
          //var lastRowChar = this.seatChar[numberOfRow-1]; //B
          lastRowChar = lastRowChar.trim();
          
          var seatChar = seatNo.substr(0, 1); //extract char from seat no
          return ( lastRowChar == seatChar ) ? true : false ;
        },

        isEmptySpaceAvailable(index) {
            var val = this.indexList.find( function(indx) {                            
                return indx == index;
            });
            return (index == val) ? true : false;
        },

        toggle(seat) {
          // console.log('clicked');
          // console.log(seat.no);
          seat.checked = !seat.checked;                         
              if (seat.checked) {
                //console.log('seat checked=', seat.checked);
                //this.addSeat(seat.seat_no); // to selectedSeat array               
                this.addSeat(seat); // to selectedSeat array               
                return ;
              }
              //console.log('seat NOT checked=', seat.checked);               
              this.removeSeat(seat.seat_no, seat); // to selectedSeat array                            
        },
        addSeat(seat) {
          //console.log('+', seatNo);
          this.selectedSeat.push({
          seat_no: seat.seat_no,
          fare: seat.fare,
          special:seat.special,
          status: 'booked' //'selected'
          });
          this.sortSelectedSeat();
        },
        sortSelectedSeat(){
          this.selectedSeat.sort(function(a, b) {
            var nameA = a.seat_no.toUpperCase(); // ignore upper and lowercase
            var nameB = b.seat_no.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            // names must be equal
            return 0;
          });
        },
        removeSeat(seatNo) {                    
          this.assignSeatCheckedStatusFalseInSeatList(seatNo); // checked = false 
          this.removeSeatFromSelectedSeat(seatNo);
        },
        assignSeatCheckedStatusFalseInSeatList(seatNo) {         
          let index = this.seatList.findIndex(seat =>              
            seat.seat_no == seatNo &&
            seat.status == 'available'
          );
          //let index = this.seatList.indexOf(seat);
          this.seatList[index].checked = false;               
        },
        removeSeatFromSelectedSeat(seatNo) {
          let index = this.selectedSeat.findIndex(seat =>            
             seat.seat_no == seatNo
          );
          //let index = this.selectedSeat.indexOf(seat);      
          this.selectedSeat.splice(index, 1);     
        },
        isDisabledSeatSelection(seatStatus) {
          //console.log('disableSelection=', seatStatus);
          return ( seatStatus == 'booked' || 
              seatStatus == 'buying' ||
              seatStatus == 'confirmed' || 
              seatStatus == 'n/a' ) 
              ? 
              true : false;
        }        
        // end display methods
        // totalFareForSelectedSeats(seat) {
        //   console.log('Seatfare=', seat.fare);
        //   let fare;
        //   fare = parseInt(seat.fare, 10) + this.totalFare;
        //   this.totalFare = fare;
        //   console.log('fare=', fare);
        //  return fare;
        // }
      }
      
    }              
</script>

<style lang="scss" scoped>
  // @media (min-width: 992px) { 
  //   // .btn-search {
  //   //   margin-top: 25px;
  //   // }
  //   // #app .alert {
  //   //   margin-top: 65px;
  //   // }
  // }
  
  // @media (max-width: 767px) { 
  //   #app .alert {
  //     margin-top: 15px;
  //   }
  // }

  // @media (max-width: 991px) { 
  //   // #app .alert {
  //   //   margin-top: 15px;
  //   // }
  // }

  // /*[v-cloak] { display:none; }*/
  .search-form {
    background: linear-gradient(0deg, #8BC34A, #FFF59D);
    padding: 1.5rem 0;
    border-radius: 0.27rem;
  }

  // .loading {
  //   text-align: center;
  //   z-index: 11111;
  // }

 .seat-error {
    text-align: center;
  }

  // .form-control[disabled] {
  //   background-color: #3097D1;
  // }
  
  /* The Modal (background) */
  // .modal {
  //     display: block; 
  //     position: fixed; //* Stay in place */
  //     z-index: 11111; //* Sit on top */
  //     left: 0;
  //     top: 0;
  //     width: 100%; //* Full width */
  //     height: 100%; //* Full height */
  //     overflow: auto; //* Enable scroll if needed */
  //     background-color: rgb(0,0,0); //* Fallback color */
  //     background-color: rgba(0,0,0,0.4); //* Black w/ opacity */
  // }

#app .seat-layout {
      //padding-left: 50px;
      // .row {
      //   margin-left: 0px;
      // }
      display: flex;
      flex-wrap: wrap;
      justify-content:  center;
      button {               
        height: 34px; //50px;
        margin: 10px 10px 0 0;
        font-size: 0.8rem;
        &.col-xs-2 {
          width: 15.666667%;
        }
        &.col-xs-offset-2 {
          margin-left: 17.666667%;
        }
        &.is-white {
          background-color: #fff; 
          border-width: 0;
          color: #0a0a0a;
        }
      }   
  }
  
  div.row.driver-seat {      
    height: 4rem;
    position: relative;
  }
  div.row.driver-seat > button {
    position: absolute;
    top: 0;
    right: 10%;
  }  

  /* seat display */
  .is-active {
    background-color: green;
    color: #fff;
  }     
  .booked {
    background-color: yellow; 
    color: black;
  }
  .buying {
    background-color: orange; 
    color: #fff;
  }
  .confirmed {
    background-color: red;
    color: #fff;
  }
  .empty {
    background-color: white;
    border-width: 0;
      /*color: #0a0a0a;*/
    color:white;        
  }
  
  .search-form {
    .input-group-text i {
      color: #a0cc59;
    }
  } 
  .warning-l {
    background-color: #FFE006;
    border-radius: 0.25rem 0 0 0.25rem;
    color: #FAB005;
    text-align: center;
  }
  .warning-r {
    background-color: #fff9db;
    border-radius: 0 0.25rem 0.25rem 0;
    //color: #FAB005;
    //text-align: center;
  }
  .info-l {
    color: #0c5460;
    background-color: #bee5eb; //#d1ecf1;
    border-radius: 0.25rem 0 0 0.25rem;
    text-align: center;
  }
  .info-r {
    background-color: #d1ecf1;
    border-radius: 0 0.25rem 0.25rem 0;
    //color: #FAB005;
    //text-align: center;
  }  
  // #seat-layout {
  //   .seat-plan-body {
  //     padding-left: 20px;
  //      button {       
  //         height: 50px;
  //         margin: 10px 10px 0 0;
  //          &.col-xs-2 {
  //               width: 16.76666667%;          
  //           }
  //         &.col-xs-offset-2 {
  //             margin-left: 17.666667%;
  //         }
  //         &.is-white {
  //             background-color: #fff; 
  //             border-width: 0;
  //             color: #0a0a0a;
  //         }
  //       }   
  //   }   
  // }  
  /*#modal .row  {
    background-color: #e5ecff;
  }*/  
/* end seat display */

</style>