<template>
    <q-page padding>
        <field-add-task tasktype="Service Category" @add="onAdd"/>
        <task
            v-for="category in Categories"
            :key="category.name"
            :task="category"
            @delete="onDelete(category.name)"
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
            Categories:[],
            showalert: false
        }
    },
    methods: {
        onAdd(e){
            console.log('newtask is ' + e)
            if (this.Categories.some(a => a.name === e)) {
                this.showalert = true
                return
            }
            else {
                let newcategory = {
                    category: e,
                    subcategory: ''
                }
                this.$http.post(this.$store.state.hostname + '/category',newcategory)
                .then(response => {
                    this.Categories.push({name:e})
                })
            }
        },
        onDelete(category){
            console.log('onDelete category is ' + category)
            this.$http.delete(this.$store.state.hostname + '/servicecategory/' + category)
            .then(response => {
                this.Categories = this.Categories.filter(task => task.name !== category)
            })
        }
    },
    mounted() {
        console.log(this.$store.state.hostname + '/categories')
      this.$http.get(this.$store.state.hostname + '/categories')
        .then(response => {
          this.Categories = response.data
        }).catch (err => {
          throw err
        })
    }
}
</script>

<style>

</style>