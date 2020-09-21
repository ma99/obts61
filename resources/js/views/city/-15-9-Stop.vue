<template>
  <div>    
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0 text-dark">Bus Stops</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item">
                <router-link to="/dashboard">
                  <i class="fa fa-tachometer nav-icon"></i> Dashboard
                </router-link>
              </li>
              <li class="breadcrumb-item active">Bus Stops</li>
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
        <div class="p-3 bg-lightyellow flex-fill">
          <form>
            <divisions v-model="selectedDivision" /> 

            <div class="form-group">
                <label for="city">City</label>
                  <select v-model="selectedCity" class="form-control custom-select"> 
                      <option value="" disabled>Please select one</option>
                      <option v-for="city in citiesByDivisionList" v-bind:value="{ id: city.id, name: city.name }">
                              {{ city.name }}
                       </option>                       
                  </select>
            </div>

            <div class="form-group">
              <label for="routeDistance">Stop Name</label>
              <input v-model="stopName" type="text" class="form-control" name="route_distance" id="routeDistance" placeholder="Stop Name" :disabled="!selectedCity.id">
            </div>

            <div class="mt-3 mb-2" v-show="stopList.length > 0">
            <!-- stops list -->            
              <div class="card shadow bg-white">
              <!-- <div class="card-header">Stops to be added</div> -->
              <div class="card-body p-0">
                <div class="scrollbar-small">
                  <table class="table table-striped table-hover table-sm">
                    <thead>
                      <tr>
                        <th>Sl. No.</th>
                        <th>Name
                             
                        </th>
                        <th>City Name
                          <span type="button" @click="isSortingAvailableBy('cityName')" >
                                <i class="fas fa-sort-alpha-down" aria-hidden="true"></i>
                            </span>
                        </th>                        
                        <th>Action</th>                                                         
                        <!-- <th>&nbsp;</th> -->
                      </tr>
                    </thead>
                    <tbody>
                      <tr  v-for="(stop, index) in stopList" >                              
                        <td>{{ index+1 }}</td>                              
                        <td>{{ stop.name }}</td>                              
                        <td>{{ getCityById(stop.city_id).name }}</td>                              
                        <!-- <td>{{ city.division }}</td> -->
                        <td> 
                            <button v-on:click.prevent="removeStopFromStopLis(index)" type="button" class="btn btn-danger">
                              <i class="fas fa-times fa-fw"></i>
                            </button>  
                        </td>                        
                      </tr>                            
                    </tbody>
                  </table>      
                </div>
              </div>                     
              </div>
            </div>   <!-- stops list end -->

            <!-- errors  -->
            <div v-show="show" class="alert alert-warning" role="alert">
                <h4 class="alert-heading">
                  <i class="fas fa-exclamation-triangle text-red"></i>
                  <button type="button" class="close" aria-label="Close">
                    <span aria-hidden="true" v-on:click.prevent="show = false">&times;</span>
                  </button>
                </h4>                
                <span v-show="false"> {{ showError }}</span>
                <ul>
                  <li v-for="(error, index) in errors">
                    {{ getIndex(index) }} - {{ error[0] }}
                  </li>
                </ul>
              <!-- {{ get('bus_id') }} -->
            </div>
            <!-- errors end  -->


            <div class="form-group mt-4">
                <button v-on:click.prevent="addToStopList()" class="btn btn-info" :disabled="!stopName">
                  <i class="fas fa-plus" aria-hidden="true"></i>
                </button>                   
              
                <button v-on:click.prevent="save()"  type="button" class="btn btn-primary" :disabled="!isValid">Save</button>
                <button v-on:click.prevent="reset()"  type="button" class="btn btn-warning">Cancel</button>
              
            </div>               
          </form>
        </div>
        <div class="p-3 bg-mediumyellow flex-fill">
            
            <div v-if="!isStopsAvailable" class="text-center mt-2">
              <span class="fa-stack">
                <i class="fas fa-circle fa-stack-2x" style="color: #FFC107"></i>
                <i class="fas fa-bezier-curve fa-stack-1x" style="color: #FFE066"></i>
              </span>         
              <div v-show="selectedCity.id">
                
                <h3 class="text-muted mt-3"> <i class="fas fa-info-circle mr-2"></i>Stop not available!</h3>
              </div>
            </div>                

            <!-- <div class="text-muted text-center h4 mt-3" v-if="has('schedules')">
            <i class="fas fa-info-circle"></i>
              {{ get('schedules') }}
            </div>               -->

            <div v-show="isStopsAvailable" class="card mt-1 w-100">
            <!-- <div class="card mt-1 w-100"> -->
              <div class="card-header">
                Available Stops for {{ selectedCity.name }} is <span> {{ stopsByCity.length }} </span>
              </div>
              <div class="card-body p-0">
                <div class="scrollbar">
                  <table class="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>Sl. No.</th>
                        <th>Name </th>
                        <th>Action</th>                                                         
                        <!-- <th>&nbsp;</th> -->
                      </tr>
                    </thead>
                    <tbody>
                      <tr  v-for="(stop, index) in stopsByCity" >                              
                        <td>{{ index+1 }}</td>                              
                        <td>{{ stop.name }}</td>                              
                        <!-- <td>{{ city.division }}</td> -->
                        <td> 
                            <button v-on:click.prevent="removeStop(stop, index)" class="btn btn-danger">
                              <i class="fa fa-trash fa-fw"></i>Remove
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
import Divisions from '../../components/city/Divisions'; 
import { mapState, mapGetters, mapActions } from 'vuex';
export default {
    components: {
            Divisions,
    },
    data() {
      return {
        actionStatus: '',
        alertType: '',
        //availableStopList: [],
        //cityList: [],
        cityName: '',            
        deletedStopName: '',
        //divisionList: [],
        disableSorting: true,
        error: '',
        loading: false,
        response: '',            
        selectedCity: {
          id: '',
          name: ''
        },            
        selectedDivision: '',
        show: false,
        showAlert: false,
        citiesByDivisionList: [],
        stopList: [],
        stopsByCity: [],
        stopName: '',
        scrollbarInstanceOne: '',
        scrollbarInstanceTwo: ''
      }
    },
    async mounted() {           
       //this.fetchDivisions();   
      this.loading = true;
      this.selectedCity = '';
      await this.getAvailableCities();              
      await this.getStops();

      this.loading = false;           
       this.enableScroll();
    },
    // beforeDestroy() {
    //   this.scrollbarInstanceOne.destroy();
    //   this.scrollbarInstanceTwo.destroy();    
    // },
    watch: {
      selectedDivision(value, oldValue) {
        if (value == '' || value == null) return;
        this.stopsByCity = [];
        this.selectedCity = '';
        this.citiesByDivisionList = this.citiesByDivision(value);
      },
      'selectedCity.id'(value, oldValue) {
        // if (value !== '' || value !== null)
          if (value == '' || value == null) return;
          this.stopsByCity = this.availableStopsBy(value);
      },
      success() {
          if (this.success) {
              this.actionAlert();
              this.stopsByCity = this.availableStopsBy(this.selectedCity.id);
              this.reset();
              this.resetErrors();
              this.setSuccess({ status: false });
              this.actionStatus = 'Added';
              this.alertType = 'success';
              this.showAlert = true; 
          }
      }
        
    },
    computed: {
      ...mapState([
          'errors',
          'success'
      ]),
      // ...mapGetters([
      //     'get',
      //     'has',
      //     'any'
      // ]),
      ...mapGetters('stop', [
        'availableStopsBy',
        // 'stopsByCityCount'
      ]),
      ...mapGetters('city', [
        'citiesByDivision',
        'getCityById'
      ]),
      
      showError() {
        //if (this.any() == true) 
        // console.log('err', this.errors)
        if (Object.keys(this.errors).length > 0)
          return this.show = true;
        return this.show = false;
      },
      isValid() {
        // return this.stopName != '' &&
        return  Object.keys(this.stopList).length != 0;  
      },
      isStopsAvailable() {
         if (this.stopsByCity.length > 0) {
           return true;
         }
         return false;
      },
    },
    methods: {
      ...mapActions([
          'setSuccess',
          'resetErrors'
      ]),
      ...mapActions('stop', [
        'getStops',
        'addStop',
      ]),
      ...mapActions('city', {
            getAvailableCities: 'getBusAvailableToCities',
      }),
      actionAlert() {
          swal({           
            title: 'Stops By City',
            text: 'Added successfully!',
            icon: "success",
            timer: 2000,
            closeOnClickOutside: false,
          });
      },
      getIndex(index) {
        let str = `${index}`;
        return parseInt(str.replace(/\D/g, ""), 10) + 1;
        parseInt("010", 10)
      },
      addToStopList() {
        //var vm = this;
        this.stopList.push({
          city_id: this.selectedCity.id,
          name: this.stopName
        });
        this.stopName = '';           
      },
      enableScroll() {
      //initializes the plugin with empty options
      //var instances = $('.scrollbar').overlayScrollbars({ /* your options */ 
      this.scrollbarInstanceOne = $('.scrollbar').overlayScrollbars({ /* your options */ 
        sizeAutoCapable: true,
        overflowBehavior : {
          x : "scroll",
          y : "scroll"
        },
        scrollbars: {
          autoHide: "never",
          clickScrolling: true
        }
      }).overlayScrollbars(); 

      this.scrollbarInstanceTwo = $('.scrollbar-small').overlayScrollbars({ /* your options */ 
        sizeAutoCapable: true,
        overflowBehavior : {
          x : "scroll",
          y : "scroll"
        },
        scrollbars: {
          autoHide: "never",
          clickScrolling: true
        }
      }).overlayScrollbars(); 

      //console.log(instances);

      //var instances = $("div").overlayScrollbars({ }).overlayScrollbars(); 
      //instances.destroy();

    },
      
      //       $('#scroll-stops',).slimScroll({
      //         color: '#00f',
      //         size: '8px',
      //         height: '200px',
      //         //height: auto,
      //         wheelStep: 10                  
      //       });
      // },
      
      isSortingAvailableBy(val) {
        if (val== 'cityName') {
            this.sortByCityName(this.stopList);
            this.disableSorting = true;
            return;
        }
        this.SortByCityCodeAvailableStopList(this.availableStopList);
        this.disableSorting = false;
      },

      removeStop(stop, index) {  // role id of user/staff in roles table
        var vm = this;
        this.deletedStopName = stop.name; 
        swal({
          title: "Are you sure?",
          text: "This STOP will be Removed!",
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

            vm.remove(stop, index);

            vm.loading = true;
            vm.response = '';
            vm.showAlert = false;
            axios.post('/delete/stop', {                            
                stop_id: stop.id, 
            })          
            .then(function (response) {                           
                response.data.error ? vm.error = response.data.error : vm.response = response.data;

                if (vm.response) {                                
                    vm.removeStopFromAvailableStopList(index); // update the array after removing                                
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
     async remove(stop, index) {
        this.loading = true;
        await this.deleteStop({
            id: stop.id,
            index: index
        });
        this.removeFromAvailableStopsByCity(index);
        this.loading = false;
     },
      removeFromAvailableStopsByCity(index) {      
        this.availableStopsBy.splice(index, 1);            
        //return;
      },
      
      removeStopFromStopLis(index) {
        this.stopList.splice(index, 1);
      },

      async save() {

        this.loading = true;
        //const stops = {stop_list: this.stopList};

        //console.log('sD=', stops)
        //this.stops =  stops.stop_list;
        await this.addStop({stop_list: this.stopList});        
       this.loading = false;
        // this.stopList = [];        
        // //this.reset();
        // //this.loading = true;            
        // axios.post('/stops', {
        //     city_id: this.selectedCity.id,                
        //     stop_list: this.stopList
        // })          
        // .then(function (response) {                
        //     response.data.error ? vm.error = response.data.error : vm.response = response.data;
        //     if (vm.response) {                   
        //        vm.fetchAvailableStopList();
        //        vm.SortByStopNameAvailableStopList(vm.availableStopList);
        //        vm.stopList = [],
        //        vm.loading = false;
        //        vm.disableSaveButton = true;
        //        vm.cityAddedAlert(vm.selectedCity.name);
        //        vm.reset();
        //        return;                   
        //     }
        //     vm.loading = false;
        //     vm.disableSaveButton = true;
        // });
      },
      // addStopsTo(stopsByCity, stops) {
      //   stops.forEach(stop => {
      //     stopsByCity.push(stop)
      //   });
      // },
      reset(all) {
        if(all){          
          this.selectedCity = '';
          this.selectedDivision = '';
          this.stopName = '';        
          this.stopList = [];
          return;
        }
        this.stopList = [];
        this.stopName = '';
      },
      sortByCityName(arr) {
        arr.sort((a, b) => {
              return a.city_id - b.city_id;
        });
      },
      SortByCityCodeAvailableStopList(arr) {
        arr.sort(function(a, b) {
              return a.city_id - b.city_id;
            });
      },
      cityAddedAlert(cityName) {
          swal({
            //title: "Sorry! Not Available",
            title: 'Bus Stops for '+cityName+' ',
            text: "Added successfully!",
            //text: '<span style="color:#F8BB86"> <strong>'+val+'</strong></span> Not Available.',
            //html: true,
            //type: "info",
            icon: "success",
            timer: 2000,
            closeOnClickOutside: true,
          });
      }
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
  .scrollbar-small {
    height: 13rem;
  }
</style>