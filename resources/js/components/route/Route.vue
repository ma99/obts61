<template>
     <div class="form-group">
      <label :for="id">Route</label>              
        <select
            :id="id" 
            class="form-control custom-select" 
            v-bind:value="value"
            v-on:input="$emit('input', $event.target.value)"
        >
            <option value="" :disabled="disable">Please select one</option>         
            <option v-for="route in availableRouteList" v-bind:value="
                route.id"             
            >
              {{ route.id }}  {{ route.first_city }} 
              <-> {{ route.second_city }} 
            </option>                           
        </select>                      
    </div>
</template>

<script>
    import { mapState, mapGetters, mapActions } from 'vuex';
    
    export default {
        props: ['value', 'id'],                
        data() {
            return {
                disable: false 
            }
        },
        mounted() {
            this.fetchRoutes();
            this.disable = true;
        },        
        computed: {                   
            ...mapState('route', [
              'availableRouteList',              
            ]),
        },

        methods: { 
            ...mapActions('route', [
                'getRoutes',
            ]),

            fetchRoutes() {
                this.getRoutes();           
            },
        },
    }
</script>
