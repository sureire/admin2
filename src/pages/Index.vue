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
          <q-input dense type="password" v-model="pwd"  />
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
        failedlogin:false
    }
  },
  methods :{
    onLogon(){
      if (this.pwd === "123456") {
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
    }
  }
}
</script>

<style>
  .danger {
    color: red;
  }

</style>