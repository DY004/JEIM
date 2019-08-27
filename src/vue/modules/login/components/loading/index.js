import vue from 'vue'
import loading from './loading.vue'
const LoadingConstructor = vue.extend(loading)
function showLoading(show) {
  const LoadingDom = new LoadingConstructor({
    el: document.createElement('div'),
    data() {
      return {
        show
      }
    }
  })
  document.body.appendChild(LoadingDom.$el)
}

export default showLoading
