import React from 'react'
import './index.css'
import './index.scss'
import './index.less'
import src from './assets/images/picture1.png'
import { hot, setConfig } from 'react-hot-loader'

const App = () => {
  console.log(process.env.PORT)
  return (
    <div>
      <h1>Hello Green</h1>
      <h2>Hello Red</h2>
      <h3>Hello Blue</h3>
      <h4>no no</h4>
      <img height={500} src={src} />
    </div>
  )
}

setConfig({
  ignoreSFC: !!ReactDOM.setHotElementComparator,
  pureSFC: true,
  pureRender: true,
  reloadHooks: false
})

export default hot(App)
