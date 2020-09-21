<template>
     <div class="map">
        <h3>Bus Stops</h3>      
        <loader :show="loading"></loader>
        <div class="d-flex mb-3">
          <div class="p-2 bg-lightyellow">
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
          </form>
          </div>
          <div class="p-2 flex-fill bg-info">
            <my-map 
              :stops="stopsByCity" 
              @add-stop="addToStops" 
            />           
          </div>
        </div>
    </div>
</template>

<script>
import MyMap from '../../components/stops/Map'; 
import Divisions from '../../components/city/Divisions'; 
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
    components: {
            Divisions,
            MyMap
    },
    data() {
        return {
          loading: false,
          selectedCity: {
            id: '',
            name: ''
          },            
          selectedDivision: '',
          show: false,
          showAlert: false,
          citiesByDivisionList: [],              
          stopsByCity: [],         
          // stop: {
          //   latitude: '',
          //   longitude: '',
          //   name: '',
          //   address: ''
          // }
          // infoWindowOptions: {
          //   pixelOffset: {
          //     width: 0,
          //     height: -35
          //   }
          // },          
          // activeStop: {},
          // infoWindowOpened: false
        }
    },        
    async mounted() {           
      this.loading = true;
      this.selectedCity = '';
      await this.getAvailableCities();              
      await this.getStops();

      this.loading = false;           
    },

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
    },
    computed: {      
      ...mapGetters('stop', [
        'availableStopsBy',
        // 'stopsByCityCount'
      ]),
      ...mapGetters('city', [
        'citiesByDivision',
        'getCityById'
      ]),     
    },
    methods: {      
      ...mapActions('stop', [
        'getStops',
      ]),
      ...mapActions('city', {
            getAvailableCities: 'getBusAvailableToCities',
      }),
      addToStops(e) {
        this.stopsByCity.push({
          name: 'Name',
          address: 'Address',
          phone: 88888,
          latitude: parseFloat(e.latLng.lat()),
          longitude: parseFloat(e.latLng.lng())
        });
      },      
    }         
}
</script>
