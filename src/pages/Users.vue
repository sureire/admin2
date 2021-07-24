<template>
 <q-page class="q-pa-md">
    <q-option-group
      v-model="usertype"
      :options="options"
      color="primary"
      inline
      @input="onloadUsers"
    />   
    <q-table
      :title=showUserType
      :data="services"
      :columns="columns"
      :filter="filter"      
      row-key="id"
     :pagination="initialPagination"
     :loading="loading"
    >
        <template v-slot:top-right>
            <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                <template v-slot:append>
                    <q-icon name="search" />
                </template>
            </q-input>
            <q-btn class="q-ml-lg" no-caps icon="add" :label="`New ${usertype}`"  color="primary" @click="onAdd" />            
        </template>    
        <template v-slot:body-cell-action="props">
            <q-td :props="props">
            <div>
                <!-- <q-badge color="purple" :label="props.value"></q-badge> -->
                <q-btn round icon="delete" color="red" @click.stop="onDelete(props.row)" dense flat/>
            </div>
            </q-td>
        </template>
    </q-table>
    <q-dialog v-model="showregister" persistent>
        <register-user :usertype="usertype" @closeRegisterDialog="onRefresh"/>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
    components :{
        'register-user' : require('components/Register.vue').default,
    },
    computed: {
        showUserType(){
            return this.usertype + 's'
        }
    },
  data() {
    return {
        loading:false,
        usertype: null,
        filter: '',        
        showregister: false,
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
        { name: 'address', label: 'Address', align: 'left',field: 'address' },
        { name: 'email', label: 'Email', align: 'left',field: 'email' },
        { name: 'action', label: 'Action',align: 'right', field: 'action' },
      ],
      services:[],
        options: [
          {
            label: 'Users',
            value: 'User'
          },
          {
            label: 'Dealers',
            value: 'Dealer'
          }]      
    }
  },
  methods:{
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

      },
      onDelete(row){
          this.$q.dialog({
          title: 'Alert',
          message: 'Are you sure want to delete ' + row.name + ' ?',
            cancel: true,
            persistent: true          
            }).onOk(() => {
                this.$http.delete(`${this.$store.state.hostname}/users/${row.mobile}`)
                .then(response => {
                    this.$q.notify('Deleted ' + row.name)
                    let ci = this.services.findIndex(a => a.mobile === row.mobile)
                    this.services.splice(ci,1)
                })
            })
      },
      onAdd(){
            this.showregister = true
      },
      async onRefresh(){
        this.showregister = false
        console.log('calling onload')
        this.onloadUsers()
      },
      async onloadUsers(){
          this.loading=true
        try{
            if (this.usertype == 'User') {
                let res = await this.$http.get(this.$store.state.hostname + '/users')
                this.services = res.data
            }
            else if (this.usertype == 'Dealer') {
                let res = await this.$http.get(this.$store.state.hostname + '/dealerlist')
                this.services = res.data
            }
        }catch(err){
            console.error(err)
            //throw err
        }
        this.loading=false
      }
  },
    mounted() {
        console.log(' route is ' + this.$route.path)
        if (this.$route.path == '/dealers')
            this.usertype='Dealer'
        else if (this.$route.path == '/users')
            this.usertype='User'
        this.onloadUsers()
    }
}
</script>

<style>

</style>