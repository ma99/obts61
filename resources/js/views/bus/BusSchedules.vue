<template>
  <div>    
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0 text-dark">Bus Schedules</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item">
                <router-link to="/dashboard">
                  <i class="fa fa-tachometer nav-icon"></i> Dashboard
                </router-link>
              </li>
              <li class="breadcrumb-item active">Bus Schedules</li>
            </ol>
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div><!-- /.container-fluid -->
    </div>

    <section class="content">      
      <show-alert :show.sync="showAlert" :type="alertType">               
       <strong> City </strong> has been <strong>{{ actionStatus }} </strong>
      </show-alert>        
      <loader :show="loading"></loader>
      
      <div class="d-md-flex">
        <div class="p-3 bg-aliceblue flex-fill">
          <form>
            <div class="form-group">
              <label for="bus">Bus</label>
              <select
              id="bus" 
              class="form-control custom-select"
              v-model="bus"
             >
              <option value="" disabled>Please select one</option>         
              <option v-for="bus in availableBusList" v-bind:value="
                  bus"             
              >
                {{ bus.bus.id }} 
              </option>                 
              </select>                      
            </div>
            <!-- v-show="bus" -->
            <div class="shadow p-3 mb-3 bg-white rounded text-muted">
              <div>
                Bus No.: <span class="text-secondary">{{ numberPlate }}</span>
              </div>
              <div class="mt-2">
                Route: <span class="text-secondary" v-html="routeName"><!-- {{ routeName }} --></span>
              </div>

              <div class="mt-2">
                Seats: <span class="text-secondary">{{ totalSeats }}</span>
              </div>
            </div>

            <div class="form-group">
                <label for="city">Departure City</label>
                  <select v-model="departureCity" class="form-control custom-select"> 
                      <option value="" disabled>Please select one</option>
                      <option v-for="city in routeCityList"
                           v-bind:value="city.id"
                        >
                          {{ city.name }}
                      </option>                                             
                  </select>
            </div>

            <div class="form-group">
                <label for="schedule">Schedules: 
                </label>
                <span class="text-muted"><small>Departure - Arrival</small></span>
                <select v-model="schedules" class="form-control" multiple size="7">

                  <option v-for="schedule in availableScheduleList"
                       v-bind:value="
                            schedule.id"
                    >
                       {{ schedule.departure_time }}  - {{ schedule.arrival_time }}
                  </option>                                             
                </select>
                <span v-show="availableScheduleList.length > 0" class="text-muted font-italic"><small>*Select multiple by pressing <kbd>Ctrl</kbd> key </small></span>
            </div>    

            <div v-show="show" class="alert alert-warning" role="alert">
                <h4 class="alert-heading">
                  <i class="fas fa-exclamation-triangle text-red"></i>
                  <button type="button" class="close" aria-label="Close">
                    <span aria-hidden="true" v-on:click.prevent="show = false">&times;</span>
                  </button>
                </h4>                
                <span v-show="false"> {{ showError }}</span>

              {{ get('bus_id') }}
            </div>

            <div class="form-group mt-4">
              
                <button v-on:click.prevent="save()"  type="button" class="btn btn-primary" :disabled="!isValid">Add</button>
                <button v-on:click.prevent="reset('all')"  type="button" class="btn btn-warning">Cancel</button>
              
            </div>               
          </form>
          
        </div>
        <div class="p-3 bg-mayablue flex-fill">
            
            <div v-if="!schedulesAvailable" class="text-center mt-2">
              <span class="fa-stack">
                <i class="fas fa-circle fa-stack-2x" style="color: #228be6"></i>
                <i class="fas fa-clock fa-stack-1x" style="color: #74C0FC"></i>
              </span>         
            </div>                

            <div class="text-muted text-center h4 mt-3" v-if="has('schedules')">
            <i class="fas fa-info-circle"></i>
              {{ get('schedules') }}
            </div>              

            <div v-show="schedulesAvailable" class="card mt-1 w-100">
              <div class="card-header">
                Available Schedules for the BUS
              </div>
              <div class="card-body p-0">
                <div id="scrollbar">
                  <table class="table table-striped table-hover">
                      <thead>
                        <tr>
                          <th>SL.# </th>
                          <th>DEPARTURE CITY
                            <span type="button" @click.prevent="sortBusSchedulesBy('city')" :disabled="!disableSorting">
                                  <i class="fas fa-sort-alpha-down" aria-hidden="true"></i>
                              </span>
                          </th>
                          <th>DEPARTURE TIME
                              <span type="button" @click.prevent="sortBusSchedulesBy('time')" :disabled="disableSorting">
                                  <i class="fas fa-sort-numeric-down" aria-hidden="true"></i>
                              </span>
                          </th>
                          <th>ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(schedule, index) in schedulesByBus" >                              
                          <td>{{ index+1 }}</td>                      
                          <td>
                            {{ getCityById(schedule.pivot.departure_city_id).name }}
                          </td>
                          
                          <td>{{ schedule.departure_time }}</td>
                          <td>                          
                              <button v-on:click.prevent="remove(schedule)" class="btn btn-outline-danger">
                                <i class="button-icon fas fa-trash"></i>Remove
                              </button> 
                          </td>                        
                        </tr>                            
                      </tbody>
                  </table>      
                </div>
              </div>            
            </div>

        </div>        
      </div>      
    </section>
  </div>      
</template>
<script>

import { mapState, mapGetters, mapActions } from 'vuex';

export default {        
    data() {
            return {                    
                actionStatus: '',
                alertType: '',
                bus: {}, 
                loading: false,                   
                showAlert: false,
                show: false,                    
                departureCity: '',
                disableSorting: true,
                schedules: [],
            }
            },
            watch: {                    
              async 'bus.bus.id'(val, oldVal) {

                  if (this.isEmpty(this.bus)) return;
                  
                  await this.getCitiesFromRoutesBy(
                    this.bus.bus.route_id);

                  this.getRouteCityList();

                  if (this.any) {
                    this.resetErrors();
                  }
                  
                  this.disableSorting = true;
                  this.getSchedulesByBus(val);

                },
                success() {
                    if (this.success) {
                        this.actionAlert();
                        this.reset();
                        this.resetErrors();
                        this.setSuccess({ status: false });
                        this.actionStatus = 'Added';
                        this.alertType = 'success';
                        this.showAlert = true; 
                    }
                }
            },      
            async mounted() {
                this.loading = true;
                await this.getRoutes();
                await this.getBuses();
                await this.getSchedules();
                await this.getAvailableCities();
                this.loading = false;

                this.enableScroll();
                this.objectToEmptyString();                    
            },  
            computed: {
                ...mapState([
                    'errors',
                    'success'
                ]),
                ...mapGetters([
                    'get',
                    'has',  
                    'any'                      
                ]),
              
                ...mapState('bus', [
                    'availableBusList',
                    'schedulesByBus'
                ]),

                ...mapState('schedule', [
                  'availableScheduleList',
                ]),

                ...mapState('route', [
                  'routeCityList'
                ]),
                ...mapGetters('route', [
                    'getRouteBy',
                    //'routeCityList'
                ]),

              ...mapGetters('city', [
                  'getCityById',
              ]),

              showError() {
                if (this.has('bus_id')) return this.show = true;
                return this.show = false;
              },
              schedulesAvailable() {
                  if (this.schedulesByBus.length > 0) {
                   return true;
                 }
                     return false;
              },

              numberPlate() {
                if (this.isEmpty(this.bus)) return;
                return this.bus.bus.number_plate;                    
              },

              routeName() {                    
                if (this.isEmpty(this.bus)) return;

                let route = this.getRouteBy(this.bus.bus.route_id);

                return `${route.first_city}  <i class="fas fa-exchange-alt"></i> ${route.second_city}`;
              },

              totalSeats() {
                if (this.isEmpty(this.bus)) return;
                
                 return this.bus.total_seats;
              },

              isValid() {
                    return this.bus.id != '' && 
                            this.departureCity != '' &&
                            this.schedules.length > 0
                 }
            },
            methods: {  
                ...mapActions([
                    'setSuccess',
                    'resetErrors'
                ]),
                ...mapActions('bus', [
                  'getBuses',
                  'getSchedulesByBus',
                  'addSchedulesByBus',
                  'removeScheduleByBus',
                  'emptySchedulesByBus',
                  'sortBusSchedulesByCity',
                  'sortBusSchedulesByTime'
                ]),
                ...mapActions('schedule', [
                  'getSchedules',
                ]),
              ...mapActions('route', [
                'getRoutes',
                'getCitiesFromRoutesBy',
                'getRouteCityList'
              ]),

              ...mapActions('city', {
                getAvailableCities: 'getBusAvailableToCities',
              }),

              actionAlert() {
                  swal({           
                    title: 'Schedules for the BUS',
                    text: 'Added successfully!',
                    icon: "success",
                    timer: 2000,
                    closeOnClickOutside: false,
                  });
              },
              isEmpty(obj) {
                return Object.keys(obj).length === 0;
              },
              objectToEmptyString() {
                // To display ('Please select one') first disabled option in SELECT box
                this.bus = '';
                this.departureCity = '';
              },                                    
              save() {
                this.loading = true;

                let data = {
                  bus_id: this.bus.bus.id,
                  schedules: this.schedules,
                  departure_city_id: this.departureCity,
                };
                this.addSchedulesByBus({
                    data: data,              
                    id: this.bus.bus.id,
                });
                this.loading = false;
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
              
              remove(schedule) { 
                  var vm = this;
                  swal({
                    title: "Are you sure?",
                    text: "This Schedule will be Removed!",
                    icon: "error",                 
                    dangerMode: true,
                    buttons: {
                        cancel: "Cancel",
                        confirm: {
                          text: "Remove It!",
                          value: true,
                        },                                
                    },
                  })
                  .then((value) => {
                    if (value) {

                      vm.loading = true;
                      vm.showAlert = false;

                      vm.removeScheduleByBus({
                        schedule: schedule.id, 
                        bus: vm.bus.bus.id
                      });

                      vm.loading = false;
                      vm.actionStatus = 'Removed';
                      vm.alertType = 'danger';
                      vm.showAlert= true;
                    }                   
                  }); 
              },
              
              reset(all) { 
                if(all) {
                  this.bus = '';
                  this.departureCity = '';
                  this.schedules = [];
                  this.show = false;
                  this.emptySchedulesByBus();
                  return; 
                }
                this.departureCity = '';
                this.schedules = [];
                this.show = false;
              },
              swAlert(text, icon) {
                swal({
                  text: text, 
                  icon: icon,
                });
              },
              sortBusSchedulesBy(value) {
                if (value == 'city' ) {
                  this.sortBusSchedulesByCity();
                  this.disableSorting = false;
                  return;
                }

                this.sortBusSchedulesByTime();
                this.disableSorting = true;
              },
    }
}
</script>
<style lang="scss" scoped>  
  .heading {
    font-size: 1rem;
    margin-bottom: 0.75rem;
    color: white;
  }
  .fa-stack { font-size: 4.5em; }
  i { vertical-align: middle; }
</style>