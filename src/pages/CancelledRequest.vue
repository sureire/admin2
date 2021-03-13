<template>
      <q-page class="q-pa-md">
    <q-table
      title="Cancelled Services"
      :data="services"
      :columns="columns"
      row-key="id"
     :pagination="initialPagination"
     :loading="loading"      
    >
        <template v-slot:body-cell-refund="props">
            <q-td :props="props">
            <div>
                <q-checkbox v-model="props.row.refund" true-value='1' false-value='0'  @input="onChecked(props.row)"></q-checkbox>
            </div>
            </q-td>
        </template>    
        <template v-slot:body-cell-CancelReason="props">
            <q-td :props="props">
            <div>
                <q-badge :label="props.value" />
                <q-btn size="sm" color="accent" round dense @click="onSelect(props.row)" icon="check" />
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
              loading:true,
        initialPagination: {
            rowsPerPage: 10
            // rowsNumber: xx if getting data from a server
        },       
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
        { name: 'refund', label: 'Refund', field: 'refund' },
        { name: 'CancelReason', label: 'Reason', field: 'CancelReason' }
      ],
      services:[]
    }
  },
  methods:{
      onSelect(row){
          this.loading=true
          let cstatus = {
              id: row.id, 
              serviceprovider: row.engineerid,
              status:'cancelled'
          }
          sendCancelMsgtoCustomer(row)
          console.log(cstatus)
          this.$http.put(`${this.$store.state.hostname}/srequest/${row.id}`,cstatus)
          .then(response => {
              this.$q.notify('Status changed to cancelled successfully..')
              console.log('refund = ' + row.refund)
              if (row.refund == '1'){
                let newamount = +row.walletbalance + parseInt(this.$store.state.service_amt)
                console.log('newamount = ' + newamount)
                this.$http.put(this.$store.state.hostname + '/provider', {id: row.engineerid, amount: newamount})
                .then(res => {
                      this.$q.notify('Refunded the amount back to Engineer wallet')
                      let value = {
                          providerid: row.engineerid, 
                          amount: newamount,
                          transtype: 'refund'
                      }
                      this.$http.post(`${this.$store.state.hostname}/wallet`,value)
                      .then(res => {
                          console.log("wallet transaction added...")
                          console.log(row.walletbalance)
                          this.onloadServices()                          
                      })                     
                })
              }
              else
                this.loading=false

          })


      },
      onChecked(row){
        console.log(JSON.stringify(row))
      },
      onloadServices(){
        this.loading=true
        this.$http.get(this.$store.state.hostname + '/cancelledreq')
        .then(response => {
            console.log(response.data)
            this.services = response.data
            this.loading=false
        }).catch (err => {
            throw err
        })
      },
      async sendCancelMsgtoCustomer(row){

         try {
          let res = await this.$http.get(this.$store.state.hostname + '/srequest_byid/' + row.id)
          
            this.sendCancelMsg(row.CustomerName,res.data.mobile,row.id,row.CancelReason)

         }catch(e){
           console.error(e)
           throw e
         }
      }
  },
    mounted() {
        this.onloadServices()
}    
}
</script>

<style>

</style>