import './assets/css/satoshi.css'
import './assets/css/style.css'
import Toast, { POSITION, type PluginOptions } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import 'vue-skeletor/dist/vue-skeletor.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createAuth0 } from '@auth0/auth0-vue'
import { Skeletor } from 'vue-skeletor'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(
  createAuth0({
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    authorizationParams: {
      redirect_uri: import.meta.env.VITE_OAUTH_REDIRECT_URI,
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      scope: 'openid profile email manage:users'
    }
  })
)

const options: PluginOptions = {
  position: POSITION.BOTTOM_LEFT
}
app.use(Toast, options)

app.component(Skeletor.name, Skeletor)

app.mount('#app')
