<template>
     <q-page padding>
        <field-item
            v-for="set in settings"
            :key="set.id"
            :task="set"
            @activate="onUpdate(set)"
        />
    </q-page> 
</template>

<script>
export default {
    components: {
        'field-item': require('../components/Item.vue').default
    },
    data() {
        return {
            settings:[]
        }
    },
    methods:{
        async onUpdate(stask){
            try {
                let res = await this.$http.put(this.$store.state.hostname + '/setting/' + stask.id, {id: stask.id, value: stask.value})
                this.$q.notify('Updated ' + stask.key1 + ' with value ' + stask.value)
            }catch(e){
                console.error(e)
                throw e
            }
        }
    },
    async mounted(){
      try {
        let res = await this.$http.get(this.$store.state.hostname + '/settings')
        this.settings = res.data
      }catch(err){
        console.error(err)
      }        
    }
}
</script>

<style>

</style>