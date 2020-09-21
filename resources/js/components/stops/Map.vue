<template>     
  <div class="map">
              <gmap-map
                :center="mapCenter"
                :zoom="setZoom"
                map-type-id="terrain"
                style="width: 100%; height: 440px"
                @click="handleMapClick"
              >
                <gmap-marker
                  v-for="(stop, index) in stops"
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
</template>
<script>
export default {
  props:['stops', 'mcenter'],
    data() {
        return {
          show: false,       
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
    // mounted() {               
    // },

    // watch: {          
    // },
    computed: {            
      isStopsAvailable() {
         if (this.stops.length > 0) {
           return true;
         }
         return false;
      },
      mapCenter() {
        if (this.isStopsAvailable) {
          return {
            lat: parseFloat(this.stops[0].latitude),
            lng: parseFloat(this.stops[0].longitude)
          }
        }
        
        if ( this.mcenter.hasOwnProperty('latitude') &&
            this.mcenter.hasOwnProperty('longitude')) {

          return {
            lat: parseFloat(this.mcenter.latitude),
            lng: parseFloat(this.mcenter.longitude)
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
      },
      handleMapClick(e) {
        this.$emit('add-stop', e);
        //console.log('ec=', e);
      }
    }         
}
</script>
