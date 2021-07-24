<template>
      <q-page class="q-pa-md">
    <q-table
      title="Service Engineers"
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

            <q-th key="active" :props="props">
                Status
            </q-th>  
            <q-th key="name" :props="props">
                Name
            </q-th>  
            <q-th key="mobile" :props="props">
                Mobile
            </q-th>  
            <q-th key="email" :props="props">
                Email
            </q-th>  
            <q-th key="address" :props="props">
                Address
            </q-th>  
            <q-th key="walletbalance" :props="props">
                Wallet Balance
            </q-th>  
        </q-tr>
      </template>
      <template v-slot:body="props">

        <q-tr :props="props">
            <q-td auto-width>
                <q-toggle v-model="props.row.active === 1?true:false"  @input="onSelect(props.row)"  />
            </q-td>            
            <q-td key="name" :props="props">
                {{ props.row.name }}
            </q-td>  
            <q-td key="mobile" :props="props">
                {{ props.row.mobile }}
            </q-td>  
            <q-td key="email" :props="props">
                {{ props.row.email }}
            </q-td>  
            <q-td key="address" :props="props">
                {{ props.row.address }}
            </q-td>  
            <q-td class="cursor-pointer" key="walletbalance" :props="props">
                ${{ props.row.walletbalance }}
                <q-popup-edit v-model="props.row.walletbalance" @save="(val, initialValue) => onEdit(initialValue, props.row)" buttons>
                          <q-input
                            autofocus
                            dense
                            v-model="props.row.walletbalance"
                            hint="Edit Wallet balance"
                            type="number"
                          />
                </q-popup-edit>                
            </q-td>  
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script>
export default {
  data: () => {
    return {
        filter: '',        
        isActive: true,
        initialPagination: {
            rowsPerPage: 10
            // rowsNumber: xx if getting data from a server
        },        
      columns: [
        { name: 'active', field: 'active', required: false, visible:false },
        {
          name: 'id',
          required: false,
          align: 'left',
          field: 'id',
          visible: false,
          style: 'width: 0px'
        },
        { name: 'name', label: 'Name', align: 'left', field: 'name', sortable: true },
        { name: 'mobile', label: 'Mobile', align: 'left',field: 'mobile' },
        { name: 'email', label: 'Email', align: 'left',field: 'email' },
        { name: 'address', label: 'Address', align: 'left',field: 'address' },
        { name: 'walletbalance', label: 'Balance',align: 'right', field: 'walletbalance' },
      ],
      services:[]
    }
  },
  methods:{
      onEdit(oldamt, row){
          console.log('Rowid: ' + JSON.stringify(row))
          console.log('Old amount is ' + oldamt)
          const newamt = parseInt(row.walletbalance) - oldamt
          console.log('New Amount is ' + newamt)
            let value = {
                providerid: row.id, 
                amount: newamt,
                transtype: 'admin-add'
            }
            this.$http.post(`${this.$store.state.hostname}/wallet`,value)
            .then(res => {
                console.log("wallet transaction added...")
            })
            this.$http.put(this.$store.state.hostname + '/provider', {id: row.id, amount: parseInt(row.walletbalance)})
            .then(res=>{
                this.$q.notify('Wallet updated for Engineer ' + row.name + ' with amount $' + parseInt(row.walletbalance))
            })

      },
      onSelect(row){
          console.log('Rowid: ' + JSON.stringify(row))
          let msg ='Do you want to Activate ' + row.name + ' ?' 
          if (row.active === 1)
                msg ='Do you want to De-Activate ' + row.name + ' ?' 
          this.$q.dialog({
          title: 'Alert',
          message: msg,
            cancel: true,
            persistent: true          
        }).onOk(() => {
          this.$http.put(`${this.$store.state.hostname}/provider_activate`,{id: row.id, active:  row.active === 1? 0:1})
          .then(response => {
              if (row.active === 1)
                this.$q.notify('De Activated ' + row.name)
              else  
                this.$q.notify('Activated ' + row.name)
              let ci = this.services.findIndex(a => a.id === row.id)
              this.services[ci].active = row.active === 1? 0:1
          })
        })

      }
  },
    mounted() {
    this.$http.get(this.$store.state.hostname + '/providers')
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