<template>
  <q-page padding>
    <q-table
      title="Service Requests"
      :data="services"
      :columns="columns"
      :filter="filter"
      row-key="id"
      :pagination="initialPagination"
    >
        <template v-slot:top-right>
            <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                <template v-slot:append>
                    <q-icon name="search" />
                </template>
            </q-input>
        </template>
        <template v-slot:body-cell-status="props">
            <q-td :props="props">
            <div class="row">
                <q-badge :color="props.row.color" :label="props.value"></q-badge>
              <div v-if="props.value == 'cancelled'">
                    <q-btn round icon="restart_alt" color="purple" @click.stop="onReset(props.row)" dense flat/>
              </div>
            </div>
            </q-td>
        </template>        
    </q-table>

  </q-page>
</template>

<script>
export default {
  data() {
    return {
        filter: '',
        initialPagination: {
            rowsPerPage: 10
            // rowsNumber: xx if getting data from a server
        },
      columns: [
        {
          name: 'id',
          field: 'id'
        },
        { name: 'name', align: 'left', label: 'Customer', field: 'name', sortable: true },
        { name: 'mobile', align: 'left', label: 'Mobile', field: 'mobile', sortable: true },
        { name: 'category', align: 'left', label: 'Service Type', field: 'category', sortable: true },        
        { name: 'location', label: 'Location', field: 'location', sortable: true },
        { name: 'requestdate', align: 'left', label: 'RequestDate', field: 'requestdate' },
        { name: 'status', label: 'Status', field: 'status' , sortable: true },
        // { name: 'reset', label: 'Reset', field: 'reset' },
        { name: 'Engineer', label: 'Engineer Name', field: 'Engineer' },
        // { name: 'color', label: 'color', field: 'color', required:false }
      ],
      services:[]
    }
  },
  methods: {
      onReset(id){
        this.$q.dialog({
          title: 'Alert',
          message: 'Do you want to change the status to pending?',
            cancel: true,
            persistent: true          
        }).onOk(() => {
            let cstatus = {
                id: id, 
                serviceprovider: null,
                status:'pending:reset by admin'
            }
            console.log(cstatus)
            this.$http.put(`${this.$store.state.hostname}/srequest/${id}`,cstatus)
            .then(res => {
                let ci = this.services.findIndex(a => a.id === id)
                this.services[ci].status = 'pending'
                this.services[ci].color = 'blue'
                this.services[ci].Engineer = ''
            })

        })
        .onCancel(()=> {})
      }
  },
  mounted() {
    this.$http.get(this.$store.state.hostname + '/admin/servicelist')
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