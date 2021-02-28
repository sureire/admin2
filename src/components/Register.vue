<template>
<q-card style="width: 300px">
  <q-form 
    @submit.prevent="onSubmit"
    @reset="onReset"
    class="q-pa-md"
    >
        <q-chip square size="18px" color="teal-2" icon="login">
            {{usertype}} Registration
        </q-chip>
        <q-input
            outlined
            v-model="provider.name"
            ref = "name"
            label="Your Name"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type your name']"
        />
        <q-input
            outlined
            ref = "email"
            v-model="provider.email"
            label="Email"
            lazy-rules
            :rules="[ val => val && val.length > 0 && validEmail(this.provider.email)|| 'Please type your email']"
        />
        <q-input
            outlined
            ref = "mobile"
            v-model="provider.mobile"
            label="Mobile No."
            lazy-rules
            :rules="[ val => val && val.length > 0  && validMobile(this.provider.mobile)|| 'Please enter a valid Mobile no.']"
        />
        <div>
            <q-input
            outlined
            v-model="provider.address"
            label="Address"
            autogrow
            />
        </div>        
        <div class="row q-mt-md">
            <q-btn color=primary label="Cancel" v-close-popup />
            <q-space/>
            <q-btn  color="primary" type="submit" label="Register" />
        </div>
    </q-form>
</q-card>
</template>

<script>
export default {
    props: ['usertype'],
    data() {
        return {
            enableotp:false,
            showtc:false,
            chktc:false,            
            provider: {
                name:'',
                email:'',
                mobile:'',
                usertype:'',
                address:''
            }

        }
    },
    methods : {
                onSubmit(){
                    if (this.$refs.name.hasError || this.$refs.email.hasError || this.$refs.mobile.hasError) {
                        this.showNotifyError('Missing data, please complete all the fields')
                        return
                    }
                    this.onOtpSuccess()
                },
                onOtpSuccess() {
                    this.enableotp = false
                    this.onRegister()
                },
                onRegister(){
                    if (this.usertype === 'Engineer'){
                        console.log(`${this.$store.state.hostname}/providers/${this.provider.mobile}`)
                        this.$http.get(`${this.$store.state.hostname}/providers/${this.provider.mobile}`)
                        .then(response => {
                            console.log(response.data)
                            if (response.data){
                                // this.$q.dialog({
                                // title: 'Alert',
                                // message: 'Mobile already registered! Check with the Admin'
                                // })
                                this.showNotifyError('Mobile already registered! Check with the Admin')
                            }
                        })
                        .catch(err => {
                                this.$http.post(`${this.$store.state.hostname}/provider`, this.provider)
                                .then(Response => {
                                    this.showNotify()
                                    this.$q.dialog({
                                        title: 'Alert',
                                        message: 'Account Registered !!. Check with VplusU Admin to activate the account'
                                        })
                                     this.$store.commit('setSelectedProvider',Response.data)
                                     this.$router.push('/providerservices')
                                     this.$store.commit('setLoginStatus',true)
                                    })
                                    .catch(err => {
                                        this.showNotifyError('Mobile already registered! Check with the Admin')
                                    })
                        })
                    }
                    else {
                        console.log(`${this.$store.state.hostname}/users/${this.provider.mobile}`)
                        this.$http.get(`${this.$store.state.hostname}/users/${this.provider.mobile}`)
                        .then(response => {
                            console.log(response.data)
                            if (response.data){
                                // this.$q.dialog({
                                // title: 'Alert',
                                // message: 'Mobile already registered! Check with the Admin'
                                // })
                                this.showNotifyError('Mobile already registered! ')
                            }
                            else {
                            }
                        })
                        .catch(err => {
                                this.usertype === 'User' ? this.provider.usertype = 1 : this.provider.usertype = 2
                                this.$http.post(`${this.$store.state.hostname}/user`, this.provider)
                                .then(Response => {
                                    console.log('Result from post call ' + JSON.stringify(Response.data))
                                    this.showNotify()
                                    this.$emit("closeRegisterDialog")
                                })
                                .catch(err => {
                                    this.showNotifyError('Error in registering ' + this.usertype)
                                    throw(err)
                                })
                        })
                    }

                },

                validEmail(email) {
                    let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return re.test(email);
                    },
                validMobile(mobile) {
                    return (/^\d{10}$/).test(mobile);
                },
                showNotify(){
                        this.$q.notify({
                            progress: true,
                            position: 'top',
                            message: this.provider.name + ' successfully registered in VplusU',
                            icon: 'announcement',
                            timeout: 5000
                        })
                },
                showNotifyError(msg){
                        this.$q.notify({
                            position: 'top',
                            color: 'negative',
                            message: msg,
                            icon: 'report_problem',
                            timeout: 5000
                        })            
                },
                onReset(){

                }
    }

}
</script>

<style>

</style>