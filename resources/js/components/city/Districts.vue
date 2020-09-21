<template>
    <div class="form-group">
        <label :for="id">District</label>                       
        <select 
            v-bind:value="value"
            v-on:input="$emit('input', $event.target.value)"
            class="form-control custom-select" :id="id"
        >
            <!-- <option disabled value="">Please select one</option>                           -->
            <option value="" :disabled="disable">Please select one</option>                          
            <option v-for="district in districtsByDivision(division, list)" v-bind:value="
            district.id">
            {{ district.name }}
            </option> 
        </select>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    
    export default {
        props: [
            'value',
            'division',
            'id',
            'list'  // 'all' will show districts( frombdistrictList[]) by division. any other text will show cities( from cityList[]) by division
        ],        
        
        data() {
            return {
                disable: false 
            }
        },

        mounted() {
            this.fetchDistricts();
            this.fetchCities();
            this.disable = true;
        },

        computed: {                   
            ...mapGetters('city', [
                'districtsByDivision'
            ])            
        },

        methods: { 
            ...mapActions('city', [
                'getDistricts',
                'getBusAvailableToCities'
            ]),

            fetchDistricts() {                  
                this.getDistricts();           
            },
            fetchCities() {
                this.getBusAvailableToCities();
            },
        },
    }
</script>
