<template>
  <div>    
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0 text-dark">Bus</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item">
                <router-link to="/dashboard">
                  <i class="fa fa-tachometer nav-icon"></i> Dashboard
                </router-link>
              </li>
              <li class="breadcrumb-item active">Bus</li>
            </ol>
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div><!-- /.container-fluid -->
    </div>

    <section class="content">      
      <div class="container-fluid">
        <add-section :show.sync="show" :show-footer="true">
          <template v-slot:heading>Add Bus</template>
          <form>
                <border color="navy-blue" pattern="dashed" width="1" 
                  heading-background="#e3f2fd" heading-width="150" heading-show="true"
                >
                    <template v-slot:heading>Route Info</template> 
                    <div class="form-row justify-content-center">     
                        <div class="col-sm-5">
                            <route-list id="route" v-model="bus.routeId" />
                        </div>
                    </div>

                </border> 
                <border color="navy-blue" pattern="dashed" width="1" 
                  heading-background="#F2B705" heading-width="150" heading-show="true"
                >
                  <template v-slot:heading>Seat Plan Info</template> 
                  <div class="form-row justify-content-center">     
                    <div class="col-sm-4">
                      <div class="form-group">
                        <label for="seatPlan">Seat Plan#</label>
                          <select v-model="bus.seatPlanId" class="form-control custom-select" id="seatPlan" :disabled="editMode">
                              <option disabled value="">Please select one</option>
                              <option v-for="seat in availableSeatPlanList" v-bind:value="seat.id">
                                  {{ seat.id }}
                              </option>                                              
                          </select>                      
                      </div>
                    </div>

                    <div class="col-sm-2">
                      <div class="form-group">
                        <label for="numberOfSeat">Total Seat #</label>
                        <input v-model="numberOfSeat" type="number" min="1" max="50" value="36" class="form-control" id="numberOfSeat" placeholder="Number of Seat" disabled>
                      </div>
                    </div>

                    <div class="col-sm-4">
                      <div class="view-button">
                        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modalComponent" v-on:click.prevent="modal=true" :disabled="bus.seatPlanId == ''">    
                          <i class="fa fa-eye fa-fw"></i>View
                        </button>
                      </div>                     
                    </div>
                  </div>  
                </border>

                <border color="eastern-blue" pattern="dashed" width="1" 
                  heading-background="lightgreen" heading-width="200" heading-show="true"
                >
                  <template v-slot:heading>Bus Registraion Info</template> 
                  <div class="form-row justify-content-center">  
                    <div class="col-sm-4">
                      <div class="form-group">
                        <label for="regNumber">Registration #</label>
                        <input v-model.lazy="bus.regNumber" type="text" class="form-control" id="regNumber" placeholder="Registration Number" v-bind:style="formControl">
                      </div>
                    </div>

                    <div class="col-sm-3">
                      <div class="form-group">
                        <label for="numberPlate">Number Plate #</label>
                        <input v-model="bus.numberPlate" v-bind:style="formControl" type="text" class="form-control" id="numberPlate" placeholder="Number Plate" :disabled="isDisabled">
                      </div>
                    </div>
                    
                    <div class="col-sm-3">
                      <div class="form-group">
                        <label for="busType">Bus Type #</label>
                          <select v-model="bus.typeId" v-bind:style="formControl" class="form-control custom-select" id="busType">
                              <option disabled value="">Please select one</option>
                              <option v-for="type in types" v-bind:value="type.id">
                                  {{ type.name }}
                              </option>                                             
                          </select>                      
                      </div>
                    </div>

                    <div class="col-sm-10">
                      <div class="form-group">
                        <label for="busDescription">Description</label>
                        <textarea v-model="bus.description" v-bind:style="formControl" type="text" min="1" max="50" value="36" class="form-control" id="busDescription" placeholder="Description" :disabled="isDisabled"></textarea>
                      </div>
                    </div>

                    <div class="col-sm-4">
                      <div class="button-group">
                        <button v-on:click.prevent="save()"  type="button" class="btn btn-primary" :disabled="!isValid" v-show="!editMode">Save</button>
                        <button v-on:click.prevent="update()"  type="button" class="btn btn-info" :disabled="!isValid" v-show="editMode">Update</button>
                        <button v-on:click.prevent="reset()"  type="button" class="btn btn-warning">Cancel</button>
                      </div>
                    </div>
                  </div>
                </border>            
          </form>            

          <template v-slot:footer>
            <show-alert :show.sync="showAlert" :type="alertType"> 
              <!-- altert type can be success/info/warning/danger/dark -->
              <strong> Bus </strong> has been <strong>{{ actionStatus }} </strong>
            </show-alert>
          </template>
        </add-section>
        <loader :show="loading"></loader>
      
        <div class="row justify-content-center">
          <div class="card card-info w-100">
            <div class="card-header">Bus Info <span> {{ availableBusList.length }} </span></div>
            <div class="card-body p-0">
                <div id="scrollbar">
                  <table class="table table-striped table-hover table-sm">
                      <thead>
                        <tr>
                          <th>Sl. No.</th>
                          <th>Bus ID
                              <span type="button" @click="sortByIdOf('bus')" :disabled="disableSorting">
                                  <i class="fas fa-sort-amount-asc" aria-hidden="true"></i>
                              </span>
                          </th>
                          <th>
                              Route
                          </th>                           
                          <th>Number
                              <span type="button" @click="sortByIdOf('registration')" :disabled="!disableSorting">
                                  <i class="fas fa-sort-amount-asc" aria-hidden="true"></i>
                              </span>
                          </th>
                          <!-- <th>Number Plate</th> -->
                          <th>Type</th>                                
                          <th>Total Seats</th>     
                          <th>Seat Plan ID</th>     
                          <th>Descriptin</th> 
                          <th>Action</th>    
                          <!-- <th>&nbsp;</th> -->
                        </tr>
                      </thead>
                      <tbody>
                        <tr  v-for="(bus, index) in availableBusList" >                              
                          <td>{{ index+1 }}</td>                              
                          <td>{{ bus.bus.id }}</td>
                          <td> {{ getRouteBy(bus.bus.route_id).first_city}} <br />
                            <i class="fas fa-exchange-alt"></i> <br />
                            {{ getRouteBy(bus.bus.route_id).second_city}} 
                          </td>
                          
                          <td>
                            <div class="border-bottom border-info pb-1 mb-1">Registration #:  <br />
                            {{ bus.bus.reg_no }}
                            </div>
                            <!-- <hr /> -->
                            Number Plate: <br />
                            {{ bus.bus.number_plate }}
                          </td>
                          
                          <td>{{ typeBy(bus.bus.type_id) }}</td>                         
                          <td><strong>{{ bus.total_seats }}</strong></td>
                          <td><strong>{{ bus.bus.seat_plan_id }}</strong></td>
                          <td>{{ bus.bus.description }}</td>
                          <td> 
                            <div class="mb-2">                                
                              <button v-on:click.prevent="edit(bus)" class="btn btn-outline-info">
                                <i class="fa fa-edit fa-fw"></i>Edit
                              </button>  
                            </div>
                            <div>                                
                              <button v-on:click.prevent="remove(bus.bus)" class="btn btn-outline-danger">
                                <i class="fa fa-trash fa-fw"></i>Remove
                              </button> 
                            </div>
                          </td>                        
                        </tr>                            
                      </tbody>
                  </table>      
                </div>
            </div>
            <!-- {{-- card-footer --}} -->
            <div class="card-footer">                                
              <show-alert :show.sync="showAlert" :type="alertType">             
               Bus
                <strong> {{ actionStatus }} </strong> successfully!
              </show-alert>
            </div>
          </div>
        </div>           
      </div>

      <modal :show.sync="modal">
        <seat-layout :seatList="selectedSeatPlan.seat_list"></seat-layout>
      </modal>                          

    </section>        
  </div>      
</template>
<script>
    import Route from '../../components/route/Route'; 
    import { mapState, mapGetters, mapActions } from 'vuex';

    export default {        
        components: {
            'route-list': Route,
        },
        data() {
                return {                    
                    actionStatus: '',
                    alertType: '',
                    busToEdit: {
                      id: '',
                      index: '',
                    },
                    disableShowButton: false,
                    disableSorting: true,
                    editMode: false,
                    error: '',        
                    formControl: {
                      backgroundColor: '#fff',
                    },                                    
                    response: '',                         
                    isDisabled: false,                    
                    loading: false,
                    //bus
                    bus: {
                      routeId: '',  
                      regNumber: '',
                      numberPlate: '',
                      description: '',
                      seatPlanId: '',
                      typeId: '',
                    },
                    numberOfSeat: '',
                    selectedSeatPlan: '',                    
                    showAlert: false,
                    show: false,                    
                    modal: false,
                }
                },
                watch: {
                    'bus.regNumber'(val, oldVal) {
                        var aa = this.isRegNumberAvailable(this.bus.regNumber);
                        if (aa) {
                            if(this.editMode) {
                              this.swAlert('Edit Mode Started..', 'warning');                              
                              return;
                            }
                            this.swAlert('Registration Number is already exist!', 'info');
                        }
                    },
                    'bus.seatPlanId'(val, oldVal) {
                      if(this.bus.seatPlanId) {
                        this.selectedSeatPlan = this.getSeatPlanBy(this.bus.seatPlanId);
                        
                        this.numberOfSeat = this.selectedSeatPlan.total_seats;
                        return;
                      }
                      this.numberOfSeat= '';
                    },
                },      
                async mounted() {                    
                    // this.fetchBusTypes();
                    // this.fetchAvailableBuses();
                    // this.fetchAvailableSeatPlans();
                    
                    this.loading = true;
                    
                    await this.getBusTypes();
                    await this.getBuses();
                    await this.getSeatPlans();

                    this.loading = false;

                    this.enableScroll();                
                },
                computed: {                   
                    ...mapState('bus', [
                      'availableBusList',   
                      'types'
                    ]),

                    ...mapState('seatplan', [
                      'availableSeatPlanList',
                    ]),
                    ...mapGetters('seatplan', [
                        'getSeatPlanBy'
                    ]),

                    ...mapGetters('bus', [
                      'typeBy',
                      'busBy',
                      'getIndexOf',
                      'isRegNumberAvailable'
                    ]),

                    ...mapGetters('route', [
                        'getRouteBy'
                    ]),

                    isValid() {
                        return this.bus.regNumber != '' && 
                                this.bus.numberPlate != '' &&
                                this.bus.typeId != '' &&
                                this.bus.description != '' && 
                                this.bus.routeId != '' 
                     }
                }, 
                methods: {
                  ...mapActions('bus', [
                    'addBus',
                    'updateBus',
                    'deleteBus',
                    'getBusTypes', 
                    'getBuses',
                    'sortByBusId',
                    'sortByRegNumber',                    
                  ]),

                  ...mapActions('seatplan', [
                    'getSeatPlans'
                  ]),  
                  actionAlert(name) {
                      swal({           
                        title: name,
                        text: 'Added successfully!',
                        icon: "success",
                        timer: 2000,
                        closeOnClickOutside: false,
                      });
                  },
                  
                  ucwords (str) {
                      return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
                          return $1.toUpperCase();
                      });
                  },                    
                  save() {
                      //var vm = this;
                      this.addBus({
                        bus: this.bus, 
                        numberOfSeat: this.numberOfSeat
                      });
                      this.loading = false;
                      this.actionAlert('Bus');
                      this.actionStatus = 'Added';
                      this.reset();
                      this.alertType = 'success';
                      this.showAlert = true;
                  },
                  edit(bus) {
                    this.busToEdit.id = bus.bus.id;

                    let busToEdit = this.busBy(bus.bus.id);
                     this.busToEdit.index = this.getIndexOf(busToEdit);
                    this.bus.routeId = busToEdit.bus.route_id;
                    this.bus.seatPlanId = busToEdit.bus.seat_plan_id;
                    this.bus.regNumber = busToEdit.bus.reg_no;
                    this.bus.numberPlate = busToEdit.bus.number_plate;
                    this.bus.typeId = busToEdit.bus.type_id;
                    this.bus.description = busToEdit.bus.description;
                    //this.bus = busToEdit.bus;
                    this.editMode = true;
                    this.show = true;
                    this.formControl.backgroundColor = 'lightyellow';
                    //console.log(busToEdit);
                    //this.type.name = this.typeBy(this.bus.typeId);
                  },
                  update() {
                    this.updateBus({
                      bus: this.bus,
                      busToEdit: this.busToEdit
                    });
                      this.loading = false;
                      this.actionStatus = 'Updated';
                      this.reset();
                      this.alertType = 'success';
                      this.showAlert = true;
                  },

                  enableScroll() {
                    //initializes the plugin with empty options
                    $('#scrollbar').overlayScrollbars({ /* your options */ 
                      sizeAutoCapable: true,
                      scrollbars: {
                        autoHide: "never",
                        clickScrolling: true
                      }
                    }); 
                  },       

                  // fetchAvailableBuses() {
                  //     this.loading = true;
                  //     this.getBuses();
                  //     this.loading = false;
                  // },

                  // fetchAvailableSeatPlans() {
                  //   this.loading = true;
                  //   this.getSeatPlans();
                  //   this.loading = false;
                  // },
                  // fetchBusTypes() {
                  //   this.loading = true;
                  //   this.getBusTypes(); 
                  //   this.loading = false;
                  // },
                  
                  sortByIdOf(val) {
                      if (val== 'bus') { 
                          //this.sortByBusId(this.availableBusList);
                          this.sortByBusId();
                          this.disableSorting = true;
                          return ;
                      }
                      //this.sortByRegNumber(this.availableBusList);
                      this.sortByRegNumber();
                      this.disableSorting = false;
                  },
                  
                  remove(bus) { 
                      var vm = this;
                      swal({
                        title: "Are you sure?",
                        text: "This BUS will be Removed!",
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
                          vm.deleteBus(bus.id);

                          // axios.delete('/buses/'+bus.id)
                          // .then(function (response) {               
                          //     response.data.error ? vm.error = response.data.error : vm.response = response.data;
                          //     if (vm.response) {               
                          //         vm.removeBusFromAvailableBusList(bus.id); // update the array after removing
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
                  // removeBusFromAvailableBusList(busId) {
                  //     var indx = this.availableBusList.findIndex(function(bus){                 
                  //          return bus.bus.id == busId;
                  //     });        
                  //     this.availableBusList.splice(indx, 1);
                  //     //return;
                  // },
                  reset() {                       
                      this.isDisabled = false;
                      this.editMode = false;                                              
                      this.bus = {
                        routeId:  '' , 
                        regNumber:  '' , 
                        numberPlate:  '',
                        seatPlanId: '',
                        typeId:  '',
                        description:  '',
                      }
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
  .view-button button {
    margin: 1.9rem auto; 
  }  
</style>