<template>
  <q-page class="q-pa-md">
    <q-table
      title="Services"
      :data="services"
      :columns="columns"
      row-key="servicename"
      :pagination="initialPagination"
    />
  </q-page>
</template>

<script>
export default {
  data() {
    return {
        initialPagination: {
            rowsPerPage: 10
            // rowsNumber: xx if getting data from a server
        },      
      columns: [
        {
          name: 'servicename',
          required: true,
          label: 'ServiceName',
          align: 'left',
          field: 'servicename',
          sortable: true
        },
        { name: 'category', align: 'center', label: 'ServiceType', field: 'category', sortable: true },
        { name: 'location', label: 'Location', field: 'location', sortable: true },
        { name: 'name', label: 'Engineer', field: 'name' },
        { name: 'mobile', label: 'Mobile', field: 'mobile' }
      ],
      services:[]
    }
  },
    mounted() {
        this.$http.get(this.$store.state.hostname + '/allservices')
        .then(response => {
          console.log(response.data)
          this.services = response.data
        }).catch (err => {
          throw err
        })
    }
}
</script>

<style>

</style>