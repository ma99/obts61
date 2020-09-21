<template>
  <div id="mapid">    
  </div>
</template>

<script>
  //import 'leaflet-rotatedmarker';
  export default {
    //props: ['user'],
    data () {
      return { 
        mapCenter: [24.183969, 89.945963],
        myMap: {},
        myIcon: {},
        marker: {},
        stops: [],
        position: [],        
      }
    },
    async mounted() {
      this.eventListenThroughBroadCastChannel();
      //await this.getStops();      
      //this.setPosition();
      //this.setMapCenter();
      this.mapInit();
    },
    // computed: {
    // },
    methods: {
      eventListenThroughBroadCastChannel() {      
          Echo.private(`channel.${this.user.id}`)          
          .listen('VehicleStatus', this.updateVehiclePosition);
          console.log('ET');
      },   
      async updateVehiclePosition(e) {
        const position = [e.latitude, e.longitude];        
        this.setMapCenter(e.latitude, e.longitude);
        
        await this.makeMarker(position);

        await this.drawLine(position, this.position, this.myMap);

        this.storePresent(position);
      },

      storePresent(position) {
        this.position = position;
      },      
      mapInit() {
        this.setDefaultIconPath();
        this.setIcon();
        
        const mymap = L.map('mapid').setView(this.mapCenter, 10);        

        const attribution = '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors';       
        const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        
        const tiles = L.tileLayer(tileUrl, { attribution });
        
        tiles.addTo(mymap);

        this.myMap = mymap;
        mymap.on('click', function (e) {
            let coords= e.latlng.lat + ", " + e.latlng.lng;
            console.log('map=', coords);
        });
          
        // this.stops.forEach(stop => {
        //   this. (stop);
        // });
      },
      setIcon() {
        // 1        
        // const myicon = L.icon({
        //     iconUrl: '/images/vendor/leaflet/dist/marker-icon.png',
        //     iconSize: [25, 41],
        //     iconAnchor: [10, 40],
        //     popupAnchor: [-3, -76],
        // });

        // 2
        // const myicon = L.divIcon({
        //       html: '<i class="fas fa-car"></i>',
        //       iconSize: [20, 20],
        //       className: 'myDivIcon'
        // });

        //3  svg
        const iconSettings = {
            mapIconUrl: '<svg version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 149 178"><path fill="{mapIconColor}" stroke="white" stroke-width=".10" fill-opacity="1" stroke-miterlimit="10" d="M17.402,0H5.643C2.526,0,0,3.467,0,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644 V6.584C23.044,3.467,20.518,0,17.402,0z M22.057,14.188v11.665l-2.729,0.351v-4.806L22.057,14.188z M20.625,10.773 c-1.016,3.9-2.219,8.51-2.219,8.51H4.638l-2.222-8.51C2.417,10.773,11.3,7.755,20.625,10.773z M3.748,21.713v4.492l-2.73-0.349 V14.502L3.748,21.713z M1.018,37.938V27.579l2.73,0.343v8.196L1.018,37.938z M2.575,40.882l2.218-3.336h13.771l2.219,3.336H2.575z M19.328,35.805v-7.872l2.729-0.355v10.048L19.328,35.805z"/></svg>',
            mapIconColor: 'brown',      
        };

        // icon normal state
        const myicon = L.divIcon({
            className: "leaflet-data-marker",
          html: L.Util.template(iconSettings.mapIconUrl, iconSettings), //.replace('#','%23'),
          iconAnchor  : [12, 32],
          iconSize    : [100, 30],
          popupAnchor : [0, -28]
        });
        
        this.myIcon = myicon;      
      },
      setMapCenter(lat, lng) {
          if (lat && lng) {            
              this.mapCenter = [lat, lng];
              return;
          }
          this.mapCenter = [24.183969, 89.945963];          
      },
      setDefaultIconPath() {
        delete L.Icon.Default.prototype._getIconUrl;

        L.Icon.Default.mergeOptions({
          iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
          iconUrl: require('leaflet/dist/images/marker-icon.png'),
          shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
        });
      },
      setPosition(lat, lng) {
        // if (! this.isStopsAvailable) return;
        // this.position = [this.stops[0].latitude, this.stops[0].longitude]
        this.position = [lat,lng];
      },
      //makeMarker(latitude, longitudel) {
      makeMarker(position) {        
        


        var course = 270;

        if ( position[0] >= 23.991050 ) course = 180;


        console.log('course=', course)

        if (Object.keys(this.marker).length == 0) {            
            const marker = L.marker(position, {
                draggable:'true',
                icon: this.myIcon, 
                rotationAngle: course //180
                }                
            ).addTo(this.myMap);
            marker.bindPopup(`
                ${position[0]}, 
                ${ position[1]} 
            `);
            this.marker = marker;
        } else {
            //console.log('mm=', this.marker);
            try {
                this.marker.setRotationAngle(course);
                this.marker.setLatLng(position).bindPopup(`
                    ${position[0]}, 
                    ${position[1]} 
                `);
            } catch(e) { 
              console.error(e);
              return 'error';
            }
        }
        
        //this.drawLine(position, this.position, this.myMap);
        return 'done';
      },
      // removeMarker() {
      //    if (this.marker != undefined) {
      //         this.myMap.removeLayer(this.marker);
      //   };
      // },
      
      drawLine(presentPosition, prevPosition, map) {
        if (prevPosition.length < 1 ) {
          //this.position = presentPosition;
          this.storePresent(presentPosition);
          return 'done';
        }
        console.log('pp=', prevPosition)
        console.log('cp=', presentPosition)
        const latlngs = [
            // [45.51, -122.68],
            // [37.77, -122.43],
            // [34.04, -118.2]
            prevPosition,
            presentPosition
        ];
        
        console.log('latlng=',  latlngs);
        const polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
        map.fitBounds(polyline.getBounds());
        // this.position = presentPosition;
      },
    },
  }
</script>
<style lang="scss" scoped>    
  #mapid { height: 440px; }
</style>