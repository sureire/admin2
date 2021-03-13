<template>
  <q-page padding>
    <div class="row">
      <div class="col q-pa-sm" style="max-width: 200px">
        <q-input outlined v-model="fromdate" mask="##-##-####" label="From Date" @click="$refs.qDateProxyf.show()" clearable>
          <template v-slot:append>
            <q-icon name="event" color="primary" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxyf" transition-show="scale" transition-hide="scale" >
                <q-date v-model="fromdate"  mask="DD-MM-YYYY" @input="$refs.qDateProxyf.hide()">
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

      <!-- <q-datetime-picker outlined clearable class="col q-pa-sm" style="max-width: 200px" target="self" mode="date" label="From Date" v-model="fromdate" auto-update-value >
      </q-datetime-picker> -->
      <!-- <q-datetime-picker outlined clearable class="col q-pa-sm" style="max-width: 200px" target="self" mode="date" label="To Date" v-model="todate" auto-update-value >
      </q-datetime-picker> -->
      <div class="col q-pa-sm" style="max-width: 200px">
        <q-input outlined v-model="todate"  label= "To Date" mask="##-##-####" @click="$refs.qDateProxy.show()" clearable>
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer" color="primary">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="todate" mask="DD-MM-YYYY"  @input="$refs.qDateProxy.hide()">
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
       <q-select class="col q-ml-sm" dense outlined clearable   v-model="city" :options="cities" label="City" />
       <q-select class="col q-ml-sm" dense outlined clearable   v-model="dealer" :options="dealers" label="Dealer" />
       <q-select class="col q-ml-sm" dense outlined clearable   v-model="status" :options="statuses" label="Status" />      
    </div>
    <div class="row justify-end">
      <q-btn class="q-mr-md" no-caps color="primary"  label = "Show Report" icon="notes" @click="onShow" />
      <q-btn
            color="primary"
            icon-right="archive"
            label="Export to csv"
            no-caps
            @click="exportTable"
      />    
    </div>
    <q-table class="q-ma-sm"
      title="Service Requests"
      :data="services"
      :columns="columns"
      :filter="filter" 
      :pagination="initialPagination"
      :loading="loading"
    >
        <template v-slot:top-right>
            <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                <template v-slot:append>
                    <q-icon name="search" />
                </template>
            </q-input>
        </template>
    </q-table>

  </q-page>
</template>

<script>
import { date } from 'quasar'
import { exportFile } from 'quasar'
function wrapCsvValue (val, formatFn) {
  let formatted = formatFn !== void 0
    ? formatFn(val)
    : val

  formatted = formatted === void 0 || formatted === null
    ? ''
    : String(formatted)

  formatted = formatted.split('"').join('""')
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`
}

export default {

  data() {
    return {
        loading:false,
        fromdate: null,
        todate: null,
        filter: '',
        initialPagination: {
            rowsPerPage: 10
            // rowsNumber: xx if getting data from a server
        },
        city:null,
        dealer:null,
        status:null,
        cities: [],
        dealers: [],
        statuses: [
                  'completed',
                  'in progress',
                  'pending',
                  'cancelled'
                  ],
      columns: [
        {
          name: 'id',
          field: 'id',
          required: false,
          visible: false
        },
        { name: 'Dealer', align: 'left', label: 'Dealer', field: 'Dealer',sortable:true },
        { name: 'User', align: 'left', label: 'User', field: 'User',sortable:true },
        { name: 'location', label: 'City', field: 'location',sortable:true},
        { name: 'category', align: 'left', label: 'Service Type', field: 'category',sortable:true},        
        { name: 'requestdate', align: 'left', label: 'RequestDate', field: 'requestdate' },
        { name: 'status', label: 'Status', field: 'status' ,sortable:true },
        { name: 'statusdate', label: 'Status Date', field: 'statusdate' },
        { name: 'Engineer', label: 'Engineer Name', field: 'Engineer',sortable:true },
        // { name: 'color', label: 'color', field: 'color', required:false }
      ],
      services:[]
    }
  },
  methods: {
      async onShow(){
              if (!this.fromdate || !this.todate)
              {
                this.$q.dialog({
                          title: 'Alert',
                          message: "Please select the from and to dates to show the report",
                          persistent: true          
                        })
                 return       
              }
            try {
              this.loading = true
                let d = date.extractDate(this.fromdate,'DD-MM-YYYY')
                let tfd = date.formatDate(d, 'YYYY-MM-DD')
                d = date.extractDate(this.todate,'DD-MM-YYYY')
                let ttd = date.formatDate(d, 'YYYY-MM-DD')
               let url = this.$store.state.hostname + '/servicereport'
               url += `/${tfd}/${ttd}`
               url += `/${this.status?this.status:'null'}`
               url += `/${this.city?this.city:'null'}`
               url += `/${this.dealer?this.dealer:'null'}`
               console.log(url)
               let res = await this.$http.get(url)
                this.services = res.data
              }catch(err) {
                console.error(err)
                throw(err)
              }
              this.loading=false

      },
      exportTable () {
        // naive encoding to csv format
        const content = [ this.columns.map(col => wrapCsvValue(col.label)) ].concat(
          this.services.map(row => this.columns.map(col => wrapCsvValue(
            typeof col.field === 'function'
              ? col.field(row)
              : row[col.field === void 0 ? col.name : col.field],
            col.format
          )).join(','))
        ).join('\r\n')

        const status = exportFile(
          'table-export.csv',
          content,
          'text/csv'
        )

        if (status !== true) {
          this.$q.notify({
            message: 'Browser denied file download...',
            color: 'negative',
            icon: 'warning'
          })
        }
      }
  },
  async mounted() {
    try {
        let res = await this.$http.get(this.$store.state.hostname + '/dealerlist')
        this.dealers = []
        res.data.forEach(e => this.dealers.push(e.name))
    }catch(err) {
      console.error(err)
      throw(err)
    }
    try {
      let res = await this.$http.get(this.$store.state.hostname + '/cities')
      this.cities = []
      res.data.forEach(e => this.cities.push(e.name))
    }catch(err) {
        console.error(err)
        throw(err)
    }
  }
}
</script>

<style>

</style>