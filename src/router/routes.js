
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/cities', component: () => import('pages/Cities.vue') },
      { path: '/category', component: () => import('pages/ServiceCategory.vue') },
      { path: '/newengineers', component: () => import('pages/NewEngineers.vue') },
      { path: '/services', component: () => import('pages/Services.vue') },
      { path: '/cancelledreq', component: () => import('pages/CancelledRequest.vue') },
      // { path: '/cancelledreq', component: () => import('pages/samplegrouptable.vue') },
      { path: '/servicereqs', component: () => import('pages/SRequests.vue') },
      { path: '/servicereport', component: () => import('pages/SRequest2.vue') },
      { path: '/users', component: () => import('pages/Users.vue') },
      { path: '/dealers', component: () => import('pages/Users.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
