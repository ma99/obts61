<template>
    <div class="form-group">
      <label :for="id">Division</label>      
      <select 
        class="form-control custom-select" :id="id"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      >
          <option value="" :disabled="disable">Please select one</option>         
          <option v-for="division in divisionListByName" v-bind:value="division.id">
            {{ division.name }}
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
            this.fetchDivisions();
            this.disable = true;
        },        
        computed: {                   
            ...mapState('city', [
              'divisionList',              
            ]),
            ...mapGetters('city', [
              'divisionListByName'
            ]),
        },

        methods: { 
            ...mapActions('city', [
                'getDivisions',
            ]),

            fetchDivisions() {
                this.getDivisions();           
            },
        },
    }
</script>
