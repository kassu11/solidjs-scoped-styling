/* @refresh reload */
import { render } from 'solid-js/web'
import './index.css'
import App from './App.jsx'

const root = document.getElementById('root')

render(() => (
  <>
    <h1>Don't style this red</h1>
    <App />
  </>
), root);
