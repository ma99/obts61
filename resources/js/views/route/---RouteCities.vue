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
      <show-alert :show.sync="showAlert" :type="alertType">               
       <strong> City </strong> has been <strong>{{ actionStatus }} </strong>
      </show-alert>        
      <loader :show="loading"></loader>
      
      <div class="d-md-flex">
        <div class="p-3 bg-lightpurple flex-fill">
          <form>
            <div class="form-group">
              <label for="route">Route</label>
              
                <select v-model="route" class="form-control custom-select" id="route">
                    <option value="" disabled>Please select one</option>
                    <option v-for="route in availableRouteList" v-bind:value="{
                        id: route.id,
                        first_city: route.first_city,
                        second_city: route.second_city,
                      }
                    ">
                      {{ route.id }}  {{ route.first_city }} --> {{ route.second_city }} 
                    </option>                           
                </select>                      
            </div>

            <div class="form-group">
                <label for="city">First City</label>
                  <select v-model="firstCity" class="form-control custom-select"> 
                      <option value="" disabled>Please select one</option>
                      <option v-for="city in availableCityList"
                           v-bind:value="{
                                id: city.id,
                                name: city.name
                            }"
                        >
                          {{ city.name }}
                      </option>                                             
                  </select>
            </div>

            <div class="form-group">
                <label for="city">Second City</label>
                  <select v-model="secondCity" class="form-control custom-select"> 
                      <option value="" disabled>Please select one</option>
                      <option v-for="city in availableCityList"
                           v-bind:value="{
                                id: city.id,
                                name: city.name
                            }"
                        >
                          {{ city.name }}
                      </option>                                             
                  </select>
            </div>    

            <div class="form-group">
              <label for="cityDistance">Distance: </label>              
              <small v-show="secondCity.name" class="text-muted font-italic"> {{ firstCity.name }} to {{ secondCity.name }}
              </small> 

              <input v-model="distance" type="number" class="form-control" v-bind:class="{ 'is-invalid': has('distance') }" name="city_distance" id="cityDistance" placeholder="Enter distance in Km here">
              <span class="invalid-feedback" v-if="has('distance')" v-text="get('distance')">
              </span>              
            </div>

            <div class="form-group mt-4">
              
                <button v-on:click.prevent="save()"  type="button" class="btn btn-primary" :disabled="!isValid">Add City</button>
                <button v-on:click.prevent="reset('all')"  type="button" class="btn btn-warning">Cancel</button>
              
            </div>               
          </form>
          
        </div>
        <div class="p-3 bg-app-purple flex-fill">
            <span v-show="route" class="heading"> Available Cities for {{ route.first_city }} <i class="fas fa-exchange-alt"></i> {{ route.second_city }} </span>
            <div class="card mt-1">
            <div class="card-body">
                <div id="scrollbar">
                  <table class="table table-striped table-hover">
                      <thead>
                        <tr>
                          <th>SL.# </th>
                          <th>CITY</th>
                          <th></th>
                          <th>CITY</th>
                          <th>DISTANCE (km)</th>
                          <th>Action</th>                
                          <!-- <th>&nbsp;</th> -->
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(city, index) in citiesByRoute" >                              
                          <td>{{ index+1 }}</td>                      
                          <td>{{ getCityById(city.pivot.first_city_id).name }}</td>
                          <td> <i class="fas fa-exchange-alt"></i> </td>
                          <td>{{ getCityById(city.pivot.second_city_id).name }}</td>
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
                    loading: false,                   
                    showAlert: false,
                    show: false,                    
                    modal: false,               
                    firstCity: {
                      id: '',
                      name: '',
                    },
                    secondCity: {
                      id: '',
                      name: '',
                    },
                    distance: '',
                    route: {
                      id: '',
                      first_city: '',
                      second_city: '',
                    },
                    citiesToBeAdded: {
                        first_city: '',
                        second_city: '',
                    },                                        
                }
                },
                watch: {
                    'route.id'(val, oldVal) {
                      if (this.route.id) {
                        this.firstCity = '';
                        this.secondCity = '';
                        this.fetchCitiesByDivisionOfFirstAndSecondCity(this.route);
                      }
                    },
                    'firstCity.name'(val, oldVal) {
                      this.distance = '';
                    },
                    success() {
                        if (this.success) {
                            //this.actionAlert(this.routeName);
                            this.actionAlert(this.citiesToBeAdded);
                            this.reset();
                            this.resetErrors();
                            this.setSuccess({ status: false });
                            this.actionStatus = 'Added';
                            this.alertType = 'success';
                            this.showAlert = true; 
                        }
                    }
                },      
                mounted() {                    
                    this.fetchCities();
                    this.fetchRoutes();                    
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
                    ]),
                  ...mapState('route', [
                      'availableRouteList',
                      'citiesByRoute'
                  ]),

                  ...mapState('city', [
                      'availableCityList'
                  ]),

                  ...mapGetters('city', [
                      'getCityBy',
                      'getCityById',
                      'availableCitiesCount'  
                  ]),

                  isValid() {
                        return this.firstCity.id != '' && 
                                this.firstCity.name != '' &&
                                this.secondCity.id != '' &&
                                this.secondCity.name != '' &&
                                this.distance != '' 
                     }
                },
                methods: {  
                    ...mapActions([
                        'setSuccess',
                        'resetErrors'
                    ]),
                  ...mapActions('route', [
                    'getRoutes',
                    'getCitiesFromRoutesBy',
                    'addRouteCity',
                    'deleteCityFromRoute',
                    'emptyCitiesByRoute'
                  ]),

                  ...mapActions('city', {
                    getAvailableCities: 'getBusAvailableToCities',
                    getCitiesByDivisionOf: 'getCitiesByDivisionOfFirstAndSecondCity'
                  }),

                  actionAlert(city) {
                      swal({           
                        title: `${city.first_city} <> ${city.second_city}`,
                        text: 'Added successfully!',
                        icon: "success",
                        timer: 2000,
                        closeOnClickOutside: false,
                      });
                  },

                  objectToEmptyString() {
                    // To display ('Please select one') first disabled option in SELECT box
                    this.firstCity = '';
                    this.secondCity = '';
                    this.route = '';
                  },                                    
                  save() {
                    this.loading = true;
                    this.citiesToBeAdded = {
                        first_city: this.firstCity.name, 
                        second_city: this.secondCity.name, 
                    };
                    let data = {
                      first_city_id: this.firstCity.id,
                      second_city_id: this.secondCity.id,
                      distance: this.distance,
                    };
                    this.addRouteCity({
                        data: data,                        
                        id: this.route.id
                    });
                    this.loading = false;
                    // this.actionStatus = 'Added';
                    // this.alertType = 'success';
                    // this.showAlert = true; 
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
                  fetchCitiesByDivisionOfFirstAndSecondCity(route) {
                    this.loading = true;
                    let firstCity = this.getCityBy(route.first_city);
                    let secondCity = this.getCityBy(route.second_city);
                    
                    this.getCitiesByDivisionOf({
                      firstCityDivId: firstCity.division_id ,
                      secondCityDivId: secondCity.division_id 
                    });                    
                    
                    this.fetchCitiesBy(route.id)
                    this.loading = false;
                  },

                  fetchCitiesBy(routeId) {
                    this.getCitiesFromRoutesBy(routeId);
                  },                  
                  remove(city) { 
                      var vm = this;
                      swal({
                        title: "Are you sure?",
                        text: "This city will be Removed!",
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
                          vm.showAlert = false;

                          vm.deleteCityFromRoute({
                            city: city.id, 
                            route: vm.route.id
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
                      this.firstCity = '';
                      this.secondCity = '';
                      this.route = '';
                      this.emptyCitiesByRoute();
                      return;
                    }                 
                    this.firstCity = '';
                    this.secondCity = '';     
                    this.distance = '';
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
  .heading {
    font-size: 1rem;
    margin-bottom: 0.75rem;
    color: black;
  }
</style>