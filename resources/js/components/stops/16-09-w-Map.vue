<template>
     <div class="map">
        <h1> Hello Map</h1>      
        <loader :show="loading"></loader>
        <div class="d-flex mb-3">
          <div class="p-2 bg-warning">Flex item 1
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
          <div class="p-2 flex-fill">Flex item 2
            <div class="map">
              <gmap-map
                :center="mapCenter"
                :zoom="setZoom"
                map-type-id="terrain"
                style="width: 100%; height: 440px"
              >
                <gmap-marker
                  v-for="(stop, index) in stopsByCity"
                  :key="stop.id"
                  :position="getPosition(stop)"
                  :clickable="true"
                  :draggable="false" 
                  @click="handleMarkerClicked(stop)"
                />
                <gmap-info-window
                  :optiions="infoWindowOptions"
                  :position="infoWindowPosition"
                  :opened="infoWindowOpened"
                  @closeclick="handleInfoWindowClose"
                >
                  <div class="info-window">
                    <h4 v-text="activeStop.name" />
                    <hr>                  
                    <h6 v-text="activeStop.address" />
                    <p> 
                      <i class="fas fa-mobile-alt" aria-hidden="true"></i>
                       {{ activeStop.phone }} 
                    </p>
                  </div>
                  
                </gmap-info-window> 
              </gmap-map>
            </div>            
          </div>
        </div>
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
          infoWindowOptions: {
            pixelOffset: {
              width: 0,
              height: -35
            }
          },          
          activeStop: {},
          infoWindowOpened: false
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
      
      isStopsAvailable() {
         if (this.stopsByCity.length > 0) {
           return true;
         }
         return false;
      },
      mapCenter() {
        if (this.isStopsAvailable) {
          return {
            lat: parseFloat(this.stopsByCity[0].latitude),
            lng: parseFloat(this.stopsByCity[0].longitude)
          }
        }
        return {
          lat: 24.183969,
          lng: 89.945963
        }
      },
      infoWindowPosition() {
        return {
            lat: parseFloat(this.activeStop.latitude),
            lng: parseFloat(this.activeStop.longitude)
          }
      },

      setZoom() {
       return (this.isStopsAvailable) ?
          10 : 7;
      }
    },
    methods: {      
      ...mapActions('stop', [
        'getStops',
      ]),
      ...mapActions('city', {
            getAvailableCities: 'getBusAvailableToCities',
      }),
      getPosition(stop) {        
        return {
          lat: parseFloat(stop.latitude),
          lng: parseFloat(stop.longitude)
        }         
      },
      handleMarkerClicked(stop) {
        this.activeStop = stop;
        this.infoWindowOpened = true;
      },
      handleInfoWindowClose() {
        this.activeStop = {};
        this.infoWindowOpened = false;
      }
    }         
}
</script>
