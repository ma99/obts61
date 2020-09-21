<template>
<!-- Content Wrapper. Contains page content -->
  <div>
    <!-- Content Header (Page header) -->    
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0 text-dark">Schedule</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item">
                <router-link to="/dashboard">
                  <i class="fa fa-tachometer nav-icon"></i> Dashboard
                </router-link>
              </li>
              <li class="breadcrumb-item active">Schedule</li>
            </ol>
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div><!-- /.container-fluid -->
    </div>

    <!-- Main content -->
    <section class="content">
      <div class="container-fluid">
        <add-section :show.sync="show">
          <template v-slot:heading>Add Schedule</template>
          <div class="d-md-flex justify-content-center">
            <div class="p-3 bg-lightlemonyellow flex-fill">
              <form>
                <div class="form-row mt-2">
                  <div class="col-sm"> 
                    <div class="form-group">
                       <label for="departure-time">Departure time: </label>
                       <input v-model="departureTime"id="departure-time" type="time" name="departure-time" class="form-control" v-bind:class="{ 'is-invalid': has('departure_time') }" min="00:00" max="23:59" required>
                       <span class="invalid-feedback" v-if="has('departure_time')" v-text="get('departure_time')"></span>
                    </div>
                  </div>

                  <div class="col-sm"> 
                    <div class="form-group">
                      <label for="arrival-time">Arrival time: </label>
                      <input v-model="arrivalTime"id="arrival-time" type="time" name="arrival-time" class="form-control" v-bind:class="{ 'is-invalid': has('arrival_time') }" min="00:00" max="23:59" required>
                      <span class="invalid-feedback" v-if="has('arrival_time')" v-text="get('arrival_time')"></span>
                    </div>
                  </div>
              </div>
              <div class="col-sm-6 mt-2">
                  <div class="button-group">
                    <button v-on:click.prevent="save()" class="btn btn-primary" :disabled="!isValid">Add</button>
                    <button v-on:click.prevent="reset()" class="btn btn-warning">Reset</button>
                  </div>
                </div>
            </form>
            </div>
            <div class="p-3 bg-mediumyellow">
              <div class="d-sm-flex h-100 justify-content-center align-items-center">
                <div>
                  <span class="fa-stack">
                    <i class="fas fa-square fa-stack-2x text-warning"></i>
                    <i class="fas fa-clock fa-stack-1x" style="color: #ffe066"></i>
                  </span>         
                </div>                
              </div>
            </div>            
          </div>
          <!-- <div class="col-md-6">          
            <form>
            <div class="form-row">
              <div class="col-sm-2"> 
                  <div class="form-group">
                     <label for="departure-time">Departure time: </label>
                     <input v-model="departureTime"id="departure-time" type="time" name="departure-time" class="form-control" min="00:00" max="23:59" required>
                  </div>
              </div>

              <div class="col-sm-2"> 
              <div class="form-group">
                 <label for="arrival-time">Arrival time: </label>
                 <input v-model="arrivalTime"id="arrival-time" type="time" name="arrival-time" class="form-control" min="00:00" max="23:59" required>
              </div>
              </div>

              <div class="col-sm-4">
              <div class="button-group">
                <button v-on:click.prevent="save()" class="btn btn-primary" :disabled="!isValid">Add</button>
                <button v-on:click.prevent="reset()" class="btn btn-warning">Reset</button>
              </div>
              </div>
            </div>
            </form>
          </div>
          <div class="col-md-6">hello world</div> -->
        </add-section>
        
        <loader :show="loading"></loader>

        <div class="row justify-content-center">
          <div class="card card-info w-100">
          <div class="card-header">Schedule Info <span> {{ availableScheduleList.length }} </span></div>
          <div class="card-body p-0">
            <div id="scrollbar">
              <table class="table table-striped table-hover table-sm">
                <thead>                 
                  <tr>
                    <th>Sl. No.</th>
                    <th>Schedulel #</th>
                    <th>Departure Time</th>      
                    <th>Arrival Time</th>     
                    <th>Action</th>             
                  </tr>
                </thead>
                
                <tbody>
                  <tr  v-for="(schedule, index) in availableScheduleList">

                    <td>{{ index+1 }}</td>                             
                        <td>{{ schedule.id }}</td>
                        <td>{{ schedule.departure_time }}</td>
                        <td>{{ schedule.arrival_time }}</td>
                        <td>
                            <button v-on:click.prevent="remove(schedule)" class="btn btn-outline-danger">
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

      </div> <!-- container fluid        -->
    </section>
  </div>      
</template>

<script>
    import { mapState, mapGetters, mapActions } from 'vuex';

    export default {
        data() {
            return {
                arrivalTime: '',
                departureTime: '',
                loading: false,
                schedule: '',
                //schedule: {},
                show: false,
            }
        },        

        mounted() {            
            this.fetchAvailableSchedules();
            this.enableScroll();
        },

        watch: {
          success() {
              if (this.success) {
                  this.actionAlert(this.schedule, 'Added successfully!', 'success');
                  this.reset();
                  this.resetErrors();
                  this.setSuccess({ status: false });
              }
          }
        },

        computed: {
            ...mapState(['success']),
            ...mapGetters([
                'get',
                'has',
            ]),

            ...mapState('schedule', [
                'availableScheduleList'
            ]),

            isValid() {
                return this.departureTime != '' &&
                        this.arrivalTime != '' 
            }
        },

        methods: {
            ...mapActions([
                'setSuccess',
                'resetErrors'
            ]),
            ...mapActions('schedule', {
              fetchAvailableSchedules: 'getSchedules',
              add: 'add',
              delete: 'remove',
            }),

            actionAlert(schedule, text, icon) {
              swal({           
                title: schedule,
                //text: 'Added successfully!',
                text: text ,
                //icon: "success",
                icon: icon,
                timer: 2000,
                closeOnClickOutside: false,
              });
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

            edit(schedule) {

            },

            save() {
              this.loading = true;

              this.setSchedule();

              this.add({
                departure_time: this.departureTime,
                arrival_time: this.arrivalTime
              });

              this.loading = false;
            },

            setSchedule() {
              this.schedule = `Schedule: 
                ${this.departureTime} - 
                ${this.arrivalTime}`
            },

            update(schedule) {

            },

            updateScheduleAtAvailableScheduleList(scheduleId, schedule) {                
                 var indx = this.availableScheduleList.findIndex(function(schedule){                                        
                        return schedule.id == scheduleId;
                 });                                     
                 this.availableScheduleList[indx] = schedule;                 
            },

            remove(schedule) {
              var vm = this;
                      swal({
                        title: "Are you sure?",
                        text: "This SCHEDULE will be Removed!",
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
                          //vm.showAlert = false;
                          vm.delete(schedule.id);

                          vm.loading = false;
                          vm.actionAlert(vm.schedule, ' Removed successfully!', 'info');
                          // vm.actionStatus = 'Removed';
                          // vm.alertType = 'danger';
                          //vm.showAlert= true;                    
                        }                   
                      }); 
            },

            reset() {
              this.departureTime = '';
              this.arrivalTime = '';
            },
        }
    }
</script>
<style lang="scss" scoped>  
.fa-stack { font-size: 2.5em; }
  i { vertical-align: middle; }
</style>