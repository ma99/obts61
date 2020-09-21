<template>    
    <div class="form-group">
        <label :for="id">Upazila</label>
        <select 
            v-bind:value="value"
            v-on:input="$emit('input', $event.target.value)"
            class="form-control custom-select" :id="id"
        >
          <option value="" :disabled="disable">Please select one</option>                          
          <option v-for="upazila in upazilasByDistrict(district)" v-bind:value="upazila.name">
            {{ upazila.name }}
          </option> 
        </select>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    
    export default {
        props: [
            'value',
            'district',
            'id'
        ],        
        data() {
            return {
                disable: false 
            }
        },
        mounted() {
            this.fetchUpazilas();
            this.disable = true;
        },
        computed: {                   
            ...mapGetters('city', [
                'upazilasByDistrict'
            ])            
        },
        methods: { 
            ...mapActions('city', [
                'getUpazilas',
            ]),

            fetchUpazilas() {
                this.getUpazilas();           
            },
        },
    }
</script>
