<template>
  <q-page class="constrain-more">
    <q-dialog v-model="enabledialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Username</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input dense v-model="username" autofocus />
        </q-card-section>

        <q-card-section>
          <div class="text-h6">Password</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input dense type="password" v-model="pwd" @keyup.enter="onLogon" />
        </q-card-section>

        <q-card-actions align="center" >
          <q-btn label="Login" color="primary" @click="onLogon" />
        </q-card-actions>
        <q-card-section v-if="failedlogin">
          <div class="danger">Incorrect username or password, Try again !!</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',
  data(){
    return {
        username: null,
        pwd:null,
        enabledialog:true,
        failedlogin:false,
        services:null
    }
  },
  methods :{
    onLogon(){
      console.log(this.services.value)
      this.failedlogin=false
      if (this.pwd === this.services.value) {
          this.enabledialog = false
          this.failedlogin = false
          this.$router.push('/services')
      }
        
      else{
        // this.$q.dialog({
        //   title: 'Alert',
        //   message: 'Incorrect password, try again!!'
        // })
        this.failedlogin = true
      }
    },
      async onloadSettings(){
          this.loading=true
        try{
                let res = await this.$http.get(this.$store.state.hostname + '/settings')
                this.$store.commit('setSettings',res.data)
                this.services = res.data[0]
        }catch(err){
            console.error(err)
            //throw err
        }
        this.loading=false
      }
  },
  async mounted() {
      console.log(' route is ' + this.$route.path)
      this.onloadSettings()
  }  
}
</script>

<style>
  .danger {
    color: red;
  }

</style>