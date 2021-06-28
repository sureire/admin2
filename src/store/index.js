import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

// import example from './module-example'
Vue.prototype.$http = axios

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default new Vuex.Store({
  state: {
    //hostname: 'http://localhost:3000',
    hostname: 'https://nodejs-express-mysql.uc.r.appspot.com',
    settings: [],
    service_amt: null
  },
  mutations :{
    setUserType(state, type) {
      state.usertype = type
    },
    setSettings(state, settings){
      state.settings = settings
      let a = state.settings.filter(a => a.key1 === 'service_amount ₹')
      state.service_amt = a[0].value
      console.log(state.service_amt)
    }
  }

})