<template>
  <div>         
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0 text-dark">City</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item">
                <router-link to="/dashboard">
                  <i class="fa fa-tachometer nav-icon"></i> Dashboard
                </router-link>
              </li>
              <li class="breadcrumb-item active">City</li>
            </ol>
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div><!-- /.container-fluid -->
    </div>

    <section class="content">
      <div class="container-fluid">       
        <add-section :show.sync="show">
          <template v-slot:heading>
            Add City
          </template>

          <form> 
            <div class="form-row justify-content-center">
              <div class="col-sm-3">               
                <divisions v-model="selectedDivision" /> 
                
              </div>
              <div class="col-sm-3">
                  <districts v-model="selectedDistrict" :division="selectedDivision" list="all" />
              </div>
              <div class="col-sm-3">
                <upazilas v-model="selectedUpazila" :district="selectedDistrict" />
              </div>              
            </div>
            <div class="form-row">
              <div class="col-sm-4 offset-sm-3">
                <div class="form-group">
                  <label for="cityName">City Name</label>
                  <input v-model="selectedCity.name" type="text" class="form-control" name="city_name" id="cityName" placeholder="City Name" disabled>
                </div>
              </div>
              <div class="col-sm-5"></div>
              <div class="col-sm-4 offset-sm-3">
                <div class="button-group">
                  <button v-on:click.prevent="save()" class="btn btn-primary" :disabled="!isValid">Save</button>
                  <button v-on:click.prevent="reset()" class="btn btn-warning" :disabled="!isValid">Cancel</button>
                </div>
              </div>
            </div>
          </form>            
          <!-- <template v-slot:footer>
            <show-alert :show.sync="showAlert" :type="alertType"> 
              altert type can be success/info/warning/danger/dark
              <strong> City </strong> has been <strong>{{ actionStatus }} </strong>
            </show-alert>
          </template> -->
        </add-section>
        <loader :show="loading"></loader>
      
        <div class="row justify-content-center">
          <div class="card card-info w-100">
            <div class="card-header">Service Available City Info<span> {{ cityList.length }} </span></div>
            <div class="card-body">
                <div id="scrollbar">
                  <table class="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>Sl. No.</th>
                        <th>District ID
                          <span type="button" @click="isSortingAvailableBy('district')" :disabled="!disableSorting">
                            <i class="fa fa-sort-amount-asc" aria-hidden="true"></i>
                          </span>
                        </th>
                        <th>City ID</th>
                        <th>City
                             <span type="button" @click="isSortingAvailableBy('name')" :disabled="disableSorting">
                                <i class="fa fa-sort-amount-asc" aria-hidden="true"></i>
                            </span>
                        </th>                        
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr  v-for="(city, index) in cityList">
                        <td>{{ index+1 }}</td>                              
                        <td>
                          <span data-toggle="tooltip" data-placement="top" :title="district.name" @mouseover="getNameOf(city)">
                            <high-light color="#4eb3f3" value="5"> {{ city.district_id }} </high-light>
                          </span>
                        </td>                              
                        <td>{{ city.id }}</td>                              
                        <td>{{ city.name }}</td>                              
                        <td> 
                            <button v-on:click.prevent="remove(city)" class="btn btn-danger">
                              <i class="fa fa-trash fa-fw"></i>Remove
                            </button>  
                        </td>                  
                      </tr>                            
                    </tbody>
                </table>                        
                </div>
            </div>
            <div class="card-footer">                                
              <show-alert :show.sync="showAlert" :type="alertType">
                <strong>{{ cityName }} </strong> has been 
                <strong> {{ actionStatus }} </strong> successfully!
              </show-alert>
            </div>
          </div>
        </div>           
      </div> <!-- container fluid -->     
    </section>        
  </div>      
</template>
<script>
    import Divisions from '../../components/city/Divisions'; 
    import Districts from '../../components/city/Districts'; 
    import Upazilas from '../../components/city/Upazilas'; 

    import { mapState, mapGetters, mapActions } from 'vuex';

    export default {
        components: {
            Divisions,
            Districts,
            Upazilas
        },
        data() {
          return {
            actionStatus: '',
            alertType: '',
            //districtListByDivision: [],
            //upazilaListByDistrict: [],
            cityName: '',
            district: '',
            //cityList: [], //bus service availble to the cities
            //divisionList: [],
            //districtList: [],
            //upazilaList: [],            
            disableSorting: true,
            error: '',
            loading: false,
            response: '',
            //selectedCityId: '',
            selectedCity: {
              divisionId: '',
              districtId: '',
              name: ''
            },            
            selectedDivision: '',
            selectedDistrict: '',
            selectedUpazila: '',
            show: false,
            showAlert: false,  
          }
        },
        async mounted() {           
           //this.fetchDivisions();
           //this.fetchDistricts();
           //this.fetchUpazilas();
           //this.fetchBusAvailableToCities();
           this.loading = true;
           await this.getBusAvailableToCities();
           this.loading = false;          
           this.enableScroll();
           
        },
        
        watch: {
            selectedDivision() {
                this.selectedDistrict = '';
                this.selectedCity.name ='';
            },
            selectedDistrict() {
               // this.fetchCitiesByDistrict(this.selectedDistrict);
                this.selectedUpazila = '';
                this.cityToBeAdded();
            },
            selectedUpazila() {
              this.cityToBeAdded();
            }
        },
        computed: {
            ...mapState('city', [
                'cityList'
            ]),

            ...mapGetters('city', [
                'cityBy',
            ]),

          isValid() {
            return this.selectedCity != '' &&
              this.selectedDistrict != '' &&
              this.selectedDivision != ''
          },
        },
        methods: {
            ...mapActions('city', [
                'addCity',
                'deleteCity',
                'getBusAvailableToCities',
                'sortCitiesByName',
                'sortCitiesByDistrict'
            ]),

          cityToBeAdded() {
            this.selectedCity.divisionId = this.selectedDivision;
            this.selectedCity.districtId = this.selectedDistrict;
            if (this.selectedUpazila != '') {
              this.selectedCity.name = this.selectedUpazila;
              return;
            }

            if (this.selectedDistrict != '') {

            let district = this.cityBy(this.selectedDistrict);            
            this.selectedCity.name = district.name; 
            }
          },
          enableScroll() {
            $('#scrollbar').overlayScrollbars({ /* your options */ 
              sizeAutoCapable: true,
              scrollbars: {
                autoHide: "never",
                clickScrolling: true
              }
            });                 
          },                    
          // fetchCitiesByDivision(divisionId) {
          //   this.loading = true;
          //   this.districtListByDivision= [];     
          //   this.districtListByDivision =  this.districtList.filter(district => district.division_id == divisionId);
          //   this.loading = false;
          // },
          // fetchCitiesByDistrict(districtId) {
          //   this.loading = true;
          //   this.upazilaListByDistrict= [];     
          //   this.upazilaListByDistrict =  this.upazilaList.filter(upazila => upazila.district_id == districtId);
          //   this.loading = false;
          // },
          // fetchDistricts() {
          //   this.loading = true;
          //   this.districtList= [];            
          //   var vm = this;                      
          //   axios.get('/api/districts')  
          //       .then(function (response) {                  
          //          response.data.error ? vm.error = response.data.error : vm.districtList = response.data;
          //          vm.loading = false;                  
          //   });
          // },
          // fetchUpazilas() {
          //   this.loading = true;
          //   this.upazilaList= [];            
          //   var vm = this;                      
          //   axios.get('/api/upazilas')  
          //       .then(function (response) {                  
          //          response.data.error ? vm.error = response.data.error : vm.upazilaList = response.data;
          //          vm.loading = false;                  
          //   });
          // },
          // fetchDivisions() {
          //   this.loading = true;
          //   this.divisionList= [];            
          //   var vm = this;                                  
          //   axios.get('/api/divisions')  
          //       .then(function (response) {                  
          //          response.data.error ? vm.error = response.data.error : vm.divisionList = response.data;
          //          vm.loading = false;                  
          //   });
          // },
          // fetchBusAvailableToCities() {
          //   this.loading = true;
          //   this.getBusAvailableToCities();
          //   // this.cityList= [];            
          //   // var vm = this;                
          //   // axios.get('/api/cities')  
          //   //     .then(function (response) {                  
          //   //        response.data.error ? vm.error = response.data.error : vm.cityList = response.data;
          //   //        vm.loading = false;
          //   //        vm.sortByCityNamecityList(vm.cityList);
          //   // });
          //   this.loading = false;
          // },
          getNameOf(city) {
            this.district = this.cityBy(city.district_id);            
          },
          isSortingAvailableBy(val) {
            if (val== 'name') {
                this.sortCitiesByName();
                this.disableSorting = true;
                return;
            }
            //this.sortByDistrictcityList(this.cityList);
            this.sortCitiesByDistrict();
            this.disableSorting = false;
          },
          remove(city) {  
            var vm = this;
            this.cityName = city.name; 
            swal({
              title: "Are you sure?",
              text: "This CITY will be Removed!",
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
                vm.response = '';
                vm.showAlert = false;
                vm.deleteCity(city.id);
                // axios.delete('/cities/'+city.id)          
                // .then(function (response) { 
                //     response.data.error ? vm.error = response.data.error : vm.response = response.data;

                //     if (vm.response) {               
                //         vm.removeCityFromcityList(city.id); // update the array after removing
                //         vm.loading = false;
                //         vm.actionStatus = 'Removed';
                //         vm.alertType = 'danger';
                //         vm.showAlert= true;
                //         return;                    
                //     }                            
                //     vm.loading = false;
                // });                       
                vm.loading = false;
                vm.actionStatus = 'Removed';
                vm.alertType = 'danger';
                vm.showAlert= true;
              }               
            }); 
          },         
          // removeCityFromcityList(cityid) {
          //   var indx = this.cityList.findIndex(function(city){ 
          //       // here 'city' is array object 
          //        return city.id == cityid;
          //   });        
          //   this.cityList.splice(indx, 1);
          //   //return;
          // },
          save() {
            const city = {
                division_id: this.selectedCity.divisionId,
                district_id: this.selectedCity.districtId,
                name: this.selectedCity.name
            }

            this.loading = true;
            //this.addCity(this.selectedCity);
            this.addCity({ city });
            
            // var vm = this;
            // //this.loading = true;            
            // axios.post('/cities', {
            //     district_id: this.selectedCity.districtId,
            //     name: this.selectedCity.name,                
            // })          
            // .then(function (response) {
            //     //console.log(response.data);
            //     response.data.error ? vm.error = response.data.error : vm.response = response.data;
            //     if (vm.response) {
            //        //console.log(vm.response);
            //        //vm.fetchBusAvailableToCities();
            //        vm.cityList.push(vm.response);
            //        vm.sortByCityNamecityList(vm.cityList);
            //        vm.loading = false;
            //        vm.actionAlert(vm.selectedCity.name);
            //        vm.reset();
            //        return;                   
            //     }                
            // });
            this.loading = false;                
            this.actionAlert(this.selectedCity.name);
            this.reset();
          },
          reset() {
            this.selectedCity = {
              divisionId: '',
              districtId: '',
              name:  ''
            };
            this.selectedDistrict = '';
            this.selectedUpazila = '';
            this.selectedDivision = '';
          },
          sortByCityNamecityList(arr) {
            // sort by name            
                arr.sort(function(a, b) {
                  var nameA = a.name.toUpperCase(); // ignore upper and lowercase
                  var nameB = b.name.toUpperCase(); // ignore upper and lowercase
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
          sortByDistrictcityList(arr) {
            arr.sort((a, b) => {
              return a.district_id - b.district_id;
            });                            
          },
          actionAlert(cityName) {
              swal({           
                title: cityName,
                text: 'Added successfully!',
                icon: "success",
                timer: 2000,
                closeOnClickOutside: false,
              });
          }
        }
    }
</script>
<style lang="scss" scoped>  
</style>