<template>    
    <div class="form-group">
        <label for="upazilaName">Upazila</label>
        <select 
            v-bind:value="value"
            v-on:input="$emit('input', $event.target.value)"
            class="form-control" id="upazilaName"
        >
          <option value="" :disabled="disable">Please select one</option>                          
          <option v-for="upazila in upazilaListByDistrict" v-bind:value="upazila.name">
            {{ upazila.name }}
          </option> 
        </select>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex';
    
    export default {
        props: [
            'value',
            'district'
        ],        
        data() {
            return {
                disable: false 
            }
        },
        mounted() {
            //console.log('Component mounted.')
            this.fetchUpazilas();
            this.disable = true;
        },
        watch: {
            district() {                
                this.getUpazilasByDistrict(this.district);
            }
        },
        computed: {                   
            ...mapState('city', [
              'upazilaListByDistrict',
            ]),
            // ...mapGetters('city', [
            //     'districtsByDivision'
            // ])            
        },

        methods: { 
            ...mapActions('city', [
                'getUpazilas',
                'getUpazilasByDistrict'
            ]),

            fetchUpazilas() {
                //this.loading = true;
                //this.divisionList= [];            
                //var vm = this;                                  
                this.getUpazilas();           
            },

            // fetchDistrictsByDivision(id) {
            //     this.getDistrictsByDivision(id);
            // },
        },
    }
</script>
