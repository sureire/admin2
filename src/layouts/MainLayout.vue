<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          VplusU Admin
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"

    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Essential Links
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'

// const linksData = [
//   {
//     title: 'Cities',
//     icon: 'location_city',
//     link: $router.push('/cities')
//   },
//   {
//     title: 'Service Category',
//     icon: 'category',
//     link: $router.push('/category')
//   },
//   {
//     title: 'New Service Engineers',
//     icon: 'face',
//     link: '/newengineers'
//   },
//   // {
  //   title: 'Forum',
  //   caption: 'forum.quasar.dev',
  //   icon: 'record_voice_over',
  //   link: 'https://forum.quasar.dev'
  // },
  // {
  //   title: 'Twitter',
  //   caption: '@quasarframework',
  //   icon: 'rss_feed',
  //   link: 'https://twitter.quasar.dev'
  // },
  // {
  //   title: 'Facebook',
  //   caption: '@QuasarFramework',
  //   icon: 'public',
  //   link: 'https://facebook.quasar.dev'
  // },
  // {
  //   title: 'Quasar Awesome',
  //   caption: 'Community Quasar projects',
  //   icon: 'favorite',
  //   link: 'https://awesome.quasar.dev'
  // }
//];

export default {
  name: 'MainLayout',
  components: { EssentialLink },
  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: 
      [
        {
          title: 'Cities',
          icon: 'location_city',
          link: '/#/cities'
        },
        {
          title: 'Service Category',
          icon: 'category',
          link: '/#/category'
        },
        {
          title: 'New Service Engineers',
          icon: 'face',
          link: '/#/newengineers'
        },
        {
          title: 'Services',
          icon: 'construction',
          link: '/#/services'
        },
        {
          title: 'Services Requests',
          icon: 'construction',
          link: '/#/servicereqs'
        },
        {
          title: 'Cancelled Services',
          icon: 'clear',
          link: '/#/cancelledreq'
        }
        ]
    }
  },
  mounted() {
      this.$q.notify.setDefaults({
        position: 'top',
        timeout: 5000,
        textColor: 'white',
        icon: 'announcement',
        progress: true,
        actions: [{ icon: 'close', color: 'white' }]
      })    
  }
}
</script>
