<template>
    <div class="form-group">
      <label for="divisionName">Division</label>      
      <select 
        class="form-control" id="divisionName"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      >
          <option value="" :disabled="disable">Please select one</option>         
          <option v-for="division in divisionList" v-bind:value="division.id">
            {{ division.name }}
          </option>                             
      </select>
    </div>
</template>

<script>
    import { mapState, mapGetters, mapActions } from 'vuex';
    
    export default {
        props: ['value'],        
        // props: {
        //      value: {
        //       type: String,
        //       default: 'Please Select'
        //     },
        // },
        data() {
            return {
                disable: false 
            }
        },
        mounted() {
            //console.log('Component mounted.')
            this.fetchDivisions();
            this.disable = true;
        },
        watch: {
            // value() {
            //     let div = this.value;
            //     console.log('dd=', div.name);
            // }
        },
        computed: {                   
            ...mapState('city', [
              'divisionList',              
            ]),
        },

        methods: { 
            ...mapActions('city', [
                'getDivisions',
            ]),

            fetchDivisions() {
                //this.loading = true;
                //this.divisionList= [];            
                //var vm = this;                                  
                this.getDivisions();           
            },
        },
    }
</script>
