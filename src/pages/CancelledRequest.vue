<template>
      <q-page class="q-pa-md">
    <q-table
      title="Cancelled Services"
      :data="services"
      :columns="columns"
      row-key="id"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width
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
          <q-td auto-width
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.value }}
          </q-td>
          <q-td auto-width>
            <q-btn size="sm" color="accent" round dense @click="onSelect(props.row)" icon="check" />
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
      columns: [
        {
          name: 'id',
          required: true,
          label: 'Id',
          align: 'left',
          field: 'id',
          sortable: true
        },
        { name: 'category', align: 'left', label: 'ServiceType', field: 'category', sortable: true },
        { name: 'location', label: 'Location', field: 'location', sortable: true },
        { name: 'Engineer', label: 'Engineer Name', field: 'Engineer' },
        { name: 'CustomerName', label: 'Customer Name', field: 'CustomerName' },
        { name: 'CancelReason', label: 'Reason', field: 'CancelReason' }
      ],
      services:[]
    }
  },
  methods:{
      onSelect(row){
          let cstatus = {
              id: row.id, 
              serviceprovider: row.engineerid,
              status:'cancelled'
          }
          console.log(cstatus)
          this.$http.put(`${this.$store.state.hostname}/srequest/${row.id}`,cstatus)
          .then(response => {
              this.$q.notify('Status changed to cancelled successfully..')
                let newamount = +row.walletbalance + 100
                this.$http.put(this.$store.state.hostname + '/provider', {id: row.engineerid, amount: newamount})
                .then(res => {
                    this.$q.notify('Refunded the amount back to Engineer wallet')
                })
          })

          console.log(row.walletbalance)

      }
  },
    mounted() {
    this.$http.get(this.$store.state.hostname + '/cancelledreq')
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