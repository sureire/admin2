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
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>    
        <template v-slot:body="props">
            <q-tr :props="props">
                <q-td key="id" :props="props">
                    {{ props.row.id }}
                </q-td>  
                <q-td key="name" :props="props">
                    {{ props.row.name }}
                </q-td>        
                <q-td key="mobile" :props="props">
                    {{ props.row.mobile }}
                </q-td>        
                <q-td key="category" :props="props">
                    {{ props.row.category }}
                </q-td>        
                <q-td key="location" :props="props">
                    {{ props.row.location }}
                </q-td>        
                <q-td key="requestdate" :props="props">
                    {{ props.row.requestdate }}
                </q-td>        
                <q-td key="status" :props="props">
                    <q-badge :color="props.row.color">
                    {{ props.row.status }}
                    </q-badge>
                </q-td>
                <q-td v-if="props.row.status ==='cancelled'">
                    <q-btn size="sm" color="accent" label = "Reset" dense @click="onReset(props.row.id)" >              </q-btn>
                </q-td>
                <q-td  v-else>
                    <q-btn size="sm" flat disable label = "Reset" dense >
                    </q-btn>
                </q-td>
                <q-td key="Engineer" :props="props">
                    {{ props.row.Engineer }}
                </q-td>        
            </q-tr>
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
        { name: 'reset', label: 'Reset', field: 'reset' },
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