<template>
  <q-card style="width: 500px">
    <q-chip size="18px" icon="bookmark" color="teal-2">
        New Service Request 
    </q-chip>
    <div class="q-pa-lg">
          <q-select  outlined bottom-slots v-model="newRequest.location" label="Location" :options="cities" @input="onCitySelect" >
            <template v-slot:prepend>
              <q-icon name="place" />
            </template>
          </q-select>
          <q-select  outlined bottom-slots v-model="newRequest.category" :options="scategories" label="Services">
            <template v-slot:prepend>
              <q-icon name="construction" />
            </template>
          </q-select>        
            <q-input  v-model="username" label="Name" />
            <q-input  v-model="mobile" label="Mobile" 
                lazy-rules :rules="[ val => val && val.length > 0 || 'Please enter a valid Mobile no.']"
                    />
                <q-input
                v-model="address"
                label="Address"
                autogrow
                />
        <q-input  v-model="newRequest.requestdate" label="Requested Date" @click="$refs.qDateProxy.show()" clearable>
        <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="newRequest.requestdate"  mask="DD-MM-YYYY" :options="optionsFn" @input="$refs.qDateProxy.hide()">
                </q-date>
            </q-popup-proxy>
            </q-icon>
        </template>
        </q-input>
        <q-input v-model="newRequest.description" label="Service Description" />
        <q-select class="q-pt-md" v-model="newRequest.preferedtimeslot" :options="timeslot" label="Pick a TimeSlot" />
        <q-toggle class="q-pt-md" v-model="newRequest.emergency" color="red" label="Emergency" />
        <div class="row q-pt-xs">
            <q-btn icon="cancel" label="Cancel" color="primary" @click="$router.push('/servicereqs')"/>
            <q-space/>
            <q-btn icon="add_alert" label="Create" color="primary" @click="onCreate"/>
        </div>
    </div>
  </q-card>
</template>

<script>
import { date } from 'quasar'

export default {
  
    data() {
        return {
            cities: [],
            scategories: [],
            userid: null,
            username: null,
            mobile: null,
            address: null,            
            newRequest :{
                userid: null,
                category: null,
                location: null,
                requestdate: null,
                status: 'pending',
                preferedtimeslot: '',
                emergency: false,
                description: '',
                createdby: null
            },
            timeslot :['Morning', 'Afternoon', 'Evening' ] 
        }
    },

    methods: {
        onOtpSuccess(){
            this.enableotp= false
            if (!this.userid) {
                this.$http.get(`${process.env.HOSTNAME}/users/${this.mobile}`)
                .then(response => {
                    console.log(response.data)
                    if (response.data){
                        this.CreateRequest()
                    }
                })
                .catch(err => {
                        this.CreateNewUserandAddRequest()
                })

            }
        },
        onCreate(){
            if(this.newRequest.requestdate &&
                this.newRequest.category && 
                this.newRequest.location && 
                this.username &&
                this.mobile){
             
             this.CreateNewUserandAddRequest()
            }
            else {
                    this.$q.dialog({
                        title: 'Alert',
                        message: 'Missing details please fill all the required fields'
                    }).onDismiss(()=>{
                        return
                    })                
            }
             
        },
        CreateRequest(){
            //duplicate check for service request
            console.log(`${this.$store.state.hostname}/srequestdupcheck/${this.newRequest.userid}/${this.newRequest.location}/${this.newRequest.category}`)
            this.$http.get(`${this.$store.state.hostname}/srequestdupcheck/${this.newRequest.userid}/${this.newRequest.location}/${this.newRequest.category}`)
            .then(response => {
                console.log('response is ' + JSON.stringify(response.data))
                if (response.data.cnt > 0){
                    this.$q.dialog({
                        title: 'Alert',
                        message: 'Service Request already added for this user please verify!!'
                    }).onDismiss(()=>{
                        return
                    })
                }
                else {
                    //add a service request
                    let d = date.extractDate(this.newRequest.requestdate,'DD-MM-YYYY')
                    this.newRequest.requestdate = date.formatDate(d, 'YYYY-MM-DD')      
                                  
                    this.$http.post(this.$store.state.hostname + '/srequest', this.newRequest)
                    .then(Response => {
                        this.showNotify()
                         //this.$emit('closeServiceRequest')
                         this.$router.push('/servicereqs')
                    })
                    .catch(err => {
                        throw(err)
                    })
                }
            })
            .catch(err => {
                console.error(err)
            })
        },
        CreateNewUserandAddRequest(){
            let newuser = {
                name: this.username,
                email:'',
                mobile:this.mobile,
                usertype:1,
                address: this.address
            }
            //first check if the customer aleady exists
            this.$http.get(`${this.$store.state.hostname}/users/${this.mobile}`)
                .then(response => {  
                    this.newRequest.userid = response.data.id
                    this.CreateRequest()
                 })
                 .catch(err => {
                    this.$http.post(`${this.$store.state.hostname}/user`, newuser)
                    .then(Response => {
                        this.newRequest.userid = Response.data.id
                        this.CreateRequest()
                    })
                 })
        },
        showNotify(){
                this.$q.notify({
                    caption: 'Service Created',
                    message: 'A new Service Request was created for ' + this.username,
                    icon: 'announcement',
                    timeout: 5000
                })
        },
        optionsFn (d) {
            var rightNow = new Date();
            var res = date.formatDate(rightNow,'YYYY/MM/DD')
            return d >= res
            },   
        async onCitySelect(){
            console.log("from city change")
            try {
                let res = await this.$http.get(this.$store.state.hostname + '/serlocation/' + this.newRequest.location)
                this.scategories = []
                this.newRequest.category = null
                res.data.forEach(e => this.scategories.push(e.category))
            }catch(e){
                console.error(e)
            }
        }         
        
    },
    async mounted() {
        try{
               let res = await this.$http.get(this.$store.state.hostname + '/cities') 
               
                res.data.forEach(e => this.cities.push(e.name))
        }catch(e){
            console.error(e)
            throw(e)
        }

        // try {
        //     let res = await this.$http.get(this.$store.state.hostname + '/categories')
        //     //this.scategories = res.data
        //     res.data.forEach(e => this.scategories.push(e.name))
        // }catch(e){
        //     console.error(e)
        //     throw(e)
        // }
    }

}
</script>

<style>

</style>