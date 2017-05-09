import './style.scss'

const root = document.querySelector('#root')
root.innerHTML = `<p>Hello webpack 2s</p>`

var test = '测试my-loader替换内容'
root.innerHTML = test
