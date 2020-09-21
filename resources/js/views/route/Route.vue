<template>
  <div>
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0 text-dark">Route</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item">
                <router-link to="/dashboard">
                  <i class="fa fa-tachometer nav-icon"></i> Dashboard
                </router-link>
              </li>
              <li class="breadcrumb-item active">Route</li>
            </ol>
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div><!-- /.container-fluid -->
    </div>    

    <section class="content">
      <div class="container-fluid">
        <add-section :show.sync="show">
          <template v-slot:heading>Add Route</template>
          <form>     
            <div class="row">
              <div class="col">
                <border color="navy-blue" pattern="dashed" width="1" 
                  heading-background="#FBDB7B" heading-width="180" heading-show="true"
                >
                  <template v-slot:heading>First City Info</template>
                  <div class="form-row justify-content-center">
                    <div class="col-sm-5">
                      <divisions id="firstCityDiv" v-model="selectedDivisionForFirstCity" />
                    </div>
                    <div class="col-sm-5">
                      <districts id="firstCityDistrict" v-model="selectedDistrictForFirstCity" :division="selectedDivisionForFirstCity" list="serviceAvailableCities" />
                    </div>
                  </div>
                </border>
              </div>

              <div class="col">
                <border color="eastern-blue" pattern="dashed" width="1" 
                  heading-background="lightgreen" heading-width="180" heading-show="true"
                >
                  <template v-slot:heading>Second City Info</template> 
                  <div class="form-row justify-content-center">
                    <div class="col-sm-5">
                      <divisions id="secondCityDiv" v-model="selectedDivisionForSecondCity" />
                    </div>
                    <!-- City-->
                    <div class="col-sm-5">
                      <districts id="secondCityDistrict" v-model="selectedDistrictForSecondCity" :division="selectedDivisionForSecondCity" list="serviceAvailableCities" />
                    </div>
                  </div>
                </border>
              </div>
            </div>
            <div class="form-row">
              <div class="col-sm-4 offset-sm-3">
                <div class="form-group">
                  <label for="routeDistance">Route Distance</label>
                  <input v-model="routeDistance" type="number" class="form-control" v-bind:class="{ 'is-invalid': has('distance') }" name="route_distance" id="routeDistance" placeholder="Distance">
                  <span class="invalid-feedback" v-if="has('distance')" v-text="get('distance')"></span>
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
          <template v-slot:footer>
          </template>
        </add-section>

        <loader :show="loading"></loader>

        <div class="row justify-content-center">
          <div class="card card-info w-100">
            <div class="card-header">Route Info <span> {{ availableRouteList.length }} </span></div>
            <div class="card-body">
                <div id="scrollbar">
                  <table class="table table-striped table-hover">
                      <thead>
                        <tr>
                          <th>Sl. No.</th>
                          <th>From
                                <span type="button" @click="isSortingAvailableBy('name')" :disabled="disableSorting">
                                  <i class="fa fa-sort-amount-asc" aria-hidden="true"></i>
                                </span>
                          </th>
                          <th>To                      
                          </th>
                          <th>Distance
                            <span type="button" @click="isSortingAvailableBy('distance')" :disabled="!disableSorting">
                                  <i class="fa fa-sort-amount-asc" aria-hidden="true"></i>
                                </span>
                          </th>
                          <th>
                            Route ID
                          </th>
                          <!-- <th>&nbsp;</th> -->
                        </tr>
                      </thead>
                      <tbody>
                        <tr  v-for="(route, index) in availableRouteList">                              
                          <td>{{ index+1 }}</td>                              
                          <td>{{ route.first_city }}</td>
                          <td>{{ route.second_city }}</td>                              
                          <td>{{ route.distance }}</td>                          
                          <td><strong>{{ route.id }}</strong></td>
                          <td>
                              <button v-on:click.prevent="remove(route)" class="btn btn-danger">
                                <i class="fa fa-trash fa-fw"></i>Remove
                              </button> 
                          </td>                        
                        </tr>                            
                      </tbody>
                  </table>      
                </div>
            </div>
            <!-- {{-- card-footer --}} -->
            <div class="card-footer">                    
              <show-alert :show.sync="showAlert" :type="alertType">               
                <strong>{{ routeName }} </strong> has been 
                <strong> {{ actionStatus }} </strong> successfully!
              </show-alert>
            </div>
          </div>
        </div>
      </div>            
    </section>        
  </div>      
</template>
<script>    
    import Divisions from '../../components/city/Divisions'; 
    import Districts from '../../components/city/Districts'; 

   import { mapState, mapGetters, mapActions } from 'vuex';

    export default {
        components: {
            Divisions,
            Districts,
        },
        data() {
          return {
            actionStatus: '',
            alertType: '',
            disableSorting: true,
            loading: false,
            routeDistance: '',
            routeId: '',
            routeName: '',
            selectedDistrictForSecondCity: '',
            selectedDistrictForFirstCity: '',
            selectedDivisionForSecondCity: '',
            selectedDivisionForFirstCity: '',
            show: false,
            showAlert: false,  
          }
        },
        async mounted() {           
           //this.fetchAvailableRoutes();
           this.loading = true;
           await this.getRoutes();
           this.loading = false;          
           this.enableScroll();           
        },
        watch: {
            success() {
                if (this.success) {
                    this.actionAlert(this.routeName);
                    this.reset();
                    this.resetErrors();
                    this.setSuccess({ status: false });
                }
            }     
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
            ...mapGetters('city', [
                'cityBy'
            ]),
          ...mapState('route', [
                      'availableRouteList',
            ]),

          isValid() {
            return this.selectedDistrictForFirstCity != '' &&
              this.selectedDistrictForSecondCity != '' 
              // &&
              // this.routeDistance != ''
          }
        },
        methods: {
            ...mapActions([
                'setSuccess',
                'resetErrors'
            ]),
            ...mapActions('route', [
                    'addRoute',
                    'deleteRoute',
                    'getRoutes',
                    'sortRoutesByCityName',
                    'sortRoutesByDistance'  
            ]),

          actionAlert(routeName) {
              swal({           
                title: routeName,
                text: 'Added successfully!',
                icon: "success",
                timer: 2000,
                closeOnClickOutside: false,
              });
          },

          setCity() {
            let firstCity = this.cityBy(this.selectedDistrictForFirstCity);
            let secondCity = this.cityBy(this.selectedDistrictForSecondCity);
             
            return {
                firstCity: firstCity.name,
                secondCity: secondCity.name,
                routeName: `${firstCity.name} - ${secondCity.name}` 
            }            
          },          
          save() {
            this.loading = true;
            let city = this.setCity();
            this.routeName = city.routeName;
            
            let data = {
                first_city: city.firstCity,
                second_city: city.secondCity,
                distance: this.routeDistance,
            }

            this.addRoute({data});
             
            this.loading = false;
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
          
          // fetchAvailableRoutes() {
          //   this.loading = true;
          //   this.getRoutes();
          //   this.loading = false;          
          // },          
          isSortingAvailableBy(val) {
            if (val== 'name') {
                this.sortRoutesByCityName();
                this.disableSorting = true;
                return;
            }
            this.sortRoutesByDistance();
            this.disableSorting = false;
          },
          remove(route) {  // role id of user/staff in roles table
            var vm = this;            
            this.routeName = `${route.first_city}  to  ${route.second_city}`;

            swal({
              title: "Are you sure?",
              text: `This ${this.routeName} ROUTE will be Removed!`,
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
                
                this.deleteRoute(route.id);

                vm.loading = false;
                vm.actionStatus = 'Removed';
                vm.alertType = 'danger';
                vm.showAlert= true;
              } 
            }); 
          },         
          reset() {
            this.selectedDistrictForSecondCity = '',
            this.selectedDistrictForFirstCity = '',
            this.selectedDivisionForSecondCity = '';
            this.selectedDivisionForFirstCity = '';
            this.routeDistance = '';
          },          
        }
    }
</script>
<style lang="scss" scoped>
</style>