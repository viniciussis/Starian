import './assets/main.css'

import { h, createApp } from 'vue'
import singleSpaVue from 'single-spa-vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const vueLifecycles = singleSpaVue({
  createApp,
  appOptions: {
    render() {
      return h(App, {})
    },
  },
  handleInstance(app) {
    app.use(createPinia())
    app.use(router)
  },
})

export const bootstrap = vueLifecycles.bootstrap
export const mount = vueLifecycles.mount
export const unmount = vueLifecycles.unmount

if (!(window as any).singleSpaNavigate) {
  const app = createApp(App)
  app.use(createPinia())
  app.use(router)
  app.mount('#app')
}
