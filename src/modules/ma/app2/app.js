import './style.scss'

// 加上这句支持热更新
// webpack-dev-server --hot会把module.hot设为true而且只有在开发模式才支援
// 在production模式下module.hot会是false
if (module.hot) {
  // console.log('支持热更新吗')
  module.hot.accept()
}
// console.log('支持热更新吗?', module.hot)

const root = document.querySelector('#root')
root.innerHTML = `<p>Hello webpack 2 abcdtest</p>`
