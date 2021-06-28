import axios from 'axios'
import Vue from 'vue'

Vue.mixin({
    data : {
        url: 'https://2factor.in/API/V1/d70aa98a-780a-11eb-a9bc-0200cd936042/ADDON_SERVICES/SEND/TSMS'
    },
    methods: {
        async sendCancelMsg(name,mobile,serviceid,reason) {
            this.$q.loading.show()
            let payload = {
                From: 'GREENU',
                To: mobile.toString(),
                TemplateName: 'GPSCancelling',
                VAR1:name.slice(0,30),
                VAR2:serviceid.toString(),
                VAR3:reason.slice(0,30)
            }
            try {
                let res = await axios.post('https://2factor.in/API/V1/d70aa98a-780a-11eb-a9bc-0200cd936042/ADDON_SERVICES/SEND/TSMS',payload)
                console.log(res.data)
                this.$q.loading.hide()
            }catch(err){
                console.error(err)
                this.$q.loading.hide()
                throw err
            }
          }             
   

    }
})