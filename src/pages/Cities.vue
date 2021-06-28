<template>
    <q-page padding>
        <field-add-task tasktype="cities" @add="onAdd"/>
        <task
            v-for="city in cities"
            :key="city.name"
            :task="city"
            @delete="onDelete(city.name)"
        />
    </q-page>
</template>

<script>
export default {
    components: {
        'field-add-task': require('../components/AddTask.vue').default,
        'task': require('../components/Task.vue').default
       
    },
    data(){
        return{
            cities:[],
            showalert : false
        }
    },
    methods: {
        onAdd(e){
            if (this.cities.some(a => a.name === e)) {
                console.log('filter is true')
                this.showalert = true
                return
            }
            else
            {
                console.log('adding city')
                let newcity = {
                    city: e,
                    area: ''
                }
                this.$http.post(this.$store.state.hostname + '/location',newcity)
                .then(response => {
                    console.log(response.data)
                    this.cities.push({name:e})
                })
            }
        },
        onDelete(city){
            console.log('onDelete city is ' + city)
            this.$http.delete(this.$store.state.hostname + '/location/' + city)
            .then(response => {
                this.cities = this.cities.filter(task => task.name !== city)
            })
        }
    },
    mounted() {
        console.log(this.$store.state.hostname + '/cities')
        this.$q.loading.show()
      this.$http.get(this.$store.state.hostname + '/cities')
        .then(response => {
            console.log(response.data)
          this.cities = response.data
          this.$q.loading.hide()
        }).catch (err => {
            this.$q.loading.hide()
          throw err
        })
    }
}
</script>

<style>

</style>