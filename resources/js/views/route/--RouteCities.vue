<template>
  <div>    
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0 text-dark">Route Cities</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item">
                <router-link to="/dashboard">
                  <i class="fa fa-tachometer nav-icon"></i> Dashboard
                </router-link>
              </li>
              <li class="breadcrumb-item active">Route Cities</li>
            </ol>
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div><!-- /.container-fluid -->
    </div>

    <section class="content">      
      <div class="container-fluid">          
          <form> 
                <border color="eastern-blue" pattern="dashed" width="1"                
                >
                  
               <!--    <div class="form-row justify-content-center"> -->
                      <div class="form-group row">
                        <label for="route" class="col-sm-2 offset-sm-1 col-form-label text-right">Route</label>
                        <div class="col-sm-6">
                          <select v-model="route" class="form-control custom-select" id="route">
                              <option value="" disabled="true">Please select one</option>
                              <option v-for="route in availableRouteList" v-bind:value="{
                                  id: route.id,
                                  departure_city: route.departure_city,
                                  arrival_city: route.arrival_city,
                                }
                              ">
                                {{ route.id }}  {{ route.departure_city }} --> {{ route.arrival_city }} 
                              </option>                           

                          </select>                      
                        </div>
                      </div>

                    <div class="form-group row">
                        <label for="city" class="col-sm-2 offset-sm-1 col-form-label text-right">City</label>
                        <div class="col-sm-6">
                          <select v-model="cities" class="form-control custom-select" multiple> 
                              <option v-for="city in availableCityList" v-bind:value="city.id">
                                  {{ city.name }}
                              </option>                                             
                          </select>                      
                        </div>
                    </div>    

                    <div class="form-group row">
                      <div class="col-sm-6 offset-sm-4">
                        <button v-on:click.prevent="save()"  type="button" class="btn btn-primary" v-show="!editMode">Save</button>
                        <button v-on:click.prevent="update()"     type="button" class="btn btn-success" v-show="editMode">Update</button>

                        <button v-on:click.prevent="reset()"  type="button" class="btn btn-warning">Cancel</button>
                      </div>
                    </div>               
                  <!-- </div> -->
                </border>            
          </form>            
          <show-alert :show.sync="showAlert" :type="alertType">               
              <strong> City </strong> has been <strong>{{ actionStatus }} </strong>
          </show-alert>        
        <loader :show="loading"></loader>
        <div class="row info-table">
          <div class="card w-100">
            <div class="card-body">
                <div id="scrollbar">
                  <table class="table table-striped table-hover">
                      <thead>
                        <tr>
                          <th>SL.# </th>
                          <th>CITY</th>
                          <th>DISTANCE (km)</th>
                          <th>Action</th>                
                          <!-- <th>&nbsp;</th> -->
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(city, index) in citiesByRoute" >                              
                          <td>{{ index+1 }}</td>                      
                          <td>{{ city.name }}</td>
                          <td>{{ city.pivot.distance }}</td>
                          <td>                              
                              <button v-on:click.prevent="remove(city)" class="btn btn-outline-danger">
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
                    //availableCityList: [],                    
                    availableFareList: [],
                    disableShowButton: false,
                    //disableSaveButton: true,
                    disableSorting: true,
                    editMode: false,
                    error: '',        
                    formControl: {
                      backgroundColor: '#fff',
                    },                                    
                    response: '',                         
                    isDisabled: false,                    
                    loading: false,                                        
                    showAlert: false,
                    show: false,                    
                    modal: false,               
                    types: [],                    
                    fare: {},
                    fareToedit: {
                      id: '',
                      index: ''
                    },
                    // availableRouteList: [],
                    // citiesByRoute: [],
                    cities: [],
                    city: {
                      id: '',
                      name: '',
                      distance: ''
                    },
                    route: '',
                    // route: {
                    //   id: '',
                    //   departure_city: '',
                    //   arrival_city: '',
                    //   //distance: ''
                    // },                                        
                }
                },
                watch: {
                    'route.id'(val, oldVal) {
                      if (this.route.id) {
                        this.fetchCitiesByDivisionOfDepartureArrival(this.route);                        
                        //this.fetchCitiesBy(this.route.id);                        
                      }
                    },
                },      
                mounted() {                    
                    //this.fetchBusTypes();
                    this.fetchCities();
                    this.fetchRoutes();                    
                    //this.fetchAvailableFares();
                    this.enableScroll();
                },  
                computed: {
                  ...mapState('route', [
                      'availableRouteList',
                      'citiesByRoute'
                  ]),

                  ...mapState('city', [
                      'availableCityList'
                  ]),

                  // ...mapGetters('route', [
                      
                  // ]),

                  ...mapGetters('city', [
                      'getCityBy',
                      // 'citiesByDivisionOfDepartureArrival'
                  ]),

                },
                methods: {  
                  ...mapActions('route', [
                    'getRoutes',
                    'getCitiesFromRoutesBy'
                  ]),

                  ...mapActions('city', {
                    getAvailableCities: 'getBusAvailableToCities',
                    getCitiesByDivisionOf: 'getCitiesByDivisionOfDepartureArrival'
                  }),                                    
                  isCombined(type) {
                    // if (type.key.includes('|')) {
                    //   let types = type.key.split('|');
                    //   let t1, t2;
                    //   t1= types[0];
                    //   t2= types[1];
                    //   this.combineType[type.key] = {                       
                    //     [t1]: types[0],
                    //     [t2]: types[1],
                    //   };                      
                    //   return true; 
                    // }
                    return type.key.includes('|') ? true : false;
                  },                  
                  cityBy(id) {
                    let city = this.availableCityList.find(city => city.id == id);
                    if(city) {                      
                      return `${city.name}`;
                    }                                  
                  },
                  routeBy(id) {
                    let route = this.availableRouteList.find(route => route.id == id);
                    if(route) {                      
                      return `${route.departure_city} to ${route.arrival_city}`;
                    }                                  
                  },
                  typeBy(id) {
                    let type = this.types.find(type => type.id == id);
                    if(type) {                      
                      return type.name;
                    }
                    // this.ucwords(type.name);                   
                  },
                  ucwords (str) {
                      return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
                          return $1.toUpperCase();
                      });                  
                  },                                      
                  save() {
                      var vm = this;
                      axios.post('/fares', {                          
                          city_id: this.city.id,
                          route_id: this.route.id,
                          details: this.fare
                      })          
                      .then(function (response) {
                          //console.log(response.data);
                          response.data.error ? vm.error = response.data.error : vm.response = response.data;
                          vm.availableFareList.push({
                            city_id: vm.city.id,
                            route_id: vm.route.id,
                            details: vm.fare
                          });
                          vm.loading = false;
                          vm.actionStatus = 'Added';
                          vm.reset();
                          vm.alertType = 'success';
                          vm.showAlert = true;
                      });
                  },
                  edit(fare) {
                    this.fareToedit.id = fare.id;
                    let fareToedit = this.availableFareList.find(element => element.id == fare.id);
                    this.fareToedit.index = this.availableFareList.indexOf(fareToedit);                    
                    this.fare = fareToedit.details;
                    this.city.id = fareToedit.city_id;
                    this.route.id =  fareToedit.route_id;
                    this.editMode = true;
                    this.show = true;                    
                    this.formControl.backgroundColor = 'lightyellow';
                    //console.log(busToedit);
                    //this.type.name = this.typeBy(this.bus.typeId);
                  },
                  update() {
                    var vm = this;
                      axios.patch('/fares/'+ this.fareToedit.id, {                          
                          city_id: this.city.id,
                          route_id: this.route.id,
                          details: this.fare
                      })          
                      .then(function (response) {
                          //console.log(response.data);
                          response.data.error ? vm.error = response.data.error : vm.response = response.data;
                          vm.updateAvailableFareList();
                          vm.loading = false;
                          vm.actionStatus = 'Updated';
                          vm.reset();
                          vm.alertType = 'success';
                          vm.showAlert = true;
                          //console.log(response.status);                            
                      });
                  },
                  updateAvailableFareList() {
                    let index = this.fareToedit.index;

                    this.availableFareList[index] = {                      
                      city_id: this.city.id,
                      route_id: this.route.id,
                      details: this.fare
                    };
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
                  fetchAvailableFares() {
                      this.loading = true;
                      this.availableFareList= [];            
                      var vm = this;                
                      axios.get('/api/fares')
                          .then(function (response) {                  
                             response.data.error ? vm.error = response.data.error : vm.availableFareList = response.data;
                             //vm.sortByRouteId(vm.availableFareList);                       
                             vm.loading = false;
                      });
                  },                 
                  fetchBusTypes() {
                    this.loading = true;
                    this.types= [];            
                    var vm = this;                
                    axios.get('/api/types')  
                        .then(function (response) {                  
                           response.data.error ? vm.error = response.data.error : vm.types = response.data;
                           //vm.sortBySeatPlanId(vm.availableSeatPlanList);      
                           //vm.createFareFor(vm.types);                 
                           vm.loading = false;
                    });
                  },
                  fetchCities() {
                    this.loading = true;
                    this.getAvailableCities();
                    this.loading = false;
                  },
                  fetchRoutes() {
                    this.loading = true;
                    this.getRoutes();                    
                    this.loading = false;
                  },
                  fetchCitiesByDivisionOfDepartureArrival(route) {
                    this.loading = true;
                    //let depCity = route.departure_city;
                    let departureCity = this.getCityBy(route.departure_city);
                    let arrivalCity = this.getCityBy(route.arrival_city);
                    
                    this.getCitiesByDivisionOf({
                      departureCityDivId: departureCity.division_id ,
                      arrivalCityDivId: arrivalCity.division_id 
                    });                    
                    
                    // this.availableCityList = this.getCitiesByDivisionOfDepartureArrival(route);
                    this.fetchCitiesBy(route.id)
                    this.loading = false;
                  },                                    
                  fetchCitiesBy(routeId) {
                    this.getCitiesFromRoutesBy(routeId);
                    // this.loading = true;
                    // this.citiesByRoute= [];     
                    // var vm = this;
                    // axios.get('/api/'+routeId+'/cities')  
                    //     .then(function (response) {
                    //        response.data.error ? vm.error = response.data.error : vm.citiesByRoute = response.data;
                    //        vm.sortByDistance(vm.citiesByRoute);                 
                    //        vm.loading = false;
                    // });
                  },                  
                  sortByDistance(arr) {
                    arr.sort((a, b) => {
                            return a.pivot.distance - b.pivot.distance;
                    });
                  },
                  isRegNumberAvailableInBusList(arr, val){
                       return arr.some(function(bus) {
                          return val === bus.bus.reg_no;
                      });
                  },
                  sortByIdOf(val) {
                      if (val== 'bus') { 
                          this.sortByBusId(this.availableBusList);
                          this.disableSorting = true;
                          return ;
                      }
                      this.sortByRegNumber(this.availableBusList);
                      this.disableSorting = false;
                  },

                  sortByRouteId(arr) {
                      arr.sort(function(a, b) {
                            return a.bus.id - b.bus.id;
                      });
                  },

                  sortByRegNumber(arr) {
                      arr.sort(function(a, b) {
                          var nameA = a.bus.reg_no; 
                          var nameB = b.bus.reg_no; 
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
                  sortBySeatPlanId(arr) {
                      arr.sort(function(a, b) {
                            return a.id - b.id;
                      });
                  },                    

                  remove(fare) { 
                      var vm = this;
                      swal({
                        title: "Are you sure?",
                        text: "This fare will be Removed!",
                        icon: "error",                 
                        dangerMode: true,
                        buttons: {
                            cancel: "cancel",
                            confirm: {
                              text: "Remove It!",
                              value: true,
                            },                                
                        },
                      })
                      .then((value) => {
                        if (value) {

                          vm.loading = true;
                          vm.response = '';
                          vm.showAlert = false;

                          axios.delete('/fares/'+fare.id)
                          .then(function (response) {               
                              response.data.error ? vm.error = response.data.error : vm.response = response.data;
                              if (vm.response) {               
                                  vm.removeFareFromAvailableFareList(fare.id); // update the array after removing
                                  vm.loading = false;
                                  vm.actionStatus = 'Removed';
                                  vm.alertType = 'danger';
                                  vm.showAlert= true;
                                  return;                      
                              }                            
                              vm.loading = false;
                          });                     
                        }                   
                      }); 
                  },
                  removeFareFromAvailableFareList(fareId) {
                      var indx = this.availableFareList.findIndex(function(fare){                 
                           return fare.id == fareId;
                      });        
                      this.availableFareList.splice(indx, 1);
                      //return;
                  },
                  reset() {                       
                      this.editMode = false;
                      this.fare = '';
                      this.city.id = '';
                      this.route.id = '';
                      this.formControl.backgroundColor = '#fff';
                  },
                  swAlert(text, icon) {
                    swal({
                      text: text, 
                      icon: icon,
                    });
                  },
        }
    }
</script>
<style lang="scss" scoped>  
  ol.fare {
    margin-left: -1.7rem;  
  }
  div.info-table .card .card-body {
    padding: 0;
  }    
</style>