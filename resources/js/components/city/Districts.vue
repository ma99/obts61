<template>
    <div class="form-group">
        <label for="districtName">District</label>                       
        <select 
            v-bind:value="value"
            v-on:input="$emit('input', $event.target.value)"
            class="form-control" id="districtName"
        >
            <!-- <option disabled value="">Please select one</option>                           -->
            <option value="" :disabled="disable">Please select one</option>                          
            <option v-for="district in districtListByDivision" v-bind:value="
            district.id">
            {{ district.name }}
            </option> 
        </select>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex';
    
    export default {
        props: [
            'value',
            'division'
        ],        
        data() {
            return {
                disable: false 
            }
        },
        mounted() {
            //console.log('Component mounted.')
            this.fetchDistricts();
            this.disable = true;
        },
        watch: {
            division() {                
                this.getDistrictsByDivision(this.division); //
            }
        },
        computed: {                   
            ...mapState('city', [
              'districtListByDivision',
            ]),
            // ...mapGetters('city', [
            //     'districtsByDivision'
            // ])            
        },

        methods: { 
            ...mapActions('city', [
                'getDistricts',
                'getDistrictsByDivision'
            ]),

            fetchDistricts() {
                //this.loading = true;
                //this.divisionList= [];            
                //var vm = this;                                  
                this.getDistricts();           
            },

            // fetchDistrictsByDivision(id) {
            //     this.getDistrictsByDivision(id);
            // },
        },
    }
</script>
