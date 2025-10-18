/* @refresh reload */
import { render } from 'solid-js/web'
import App from './App.scoped.jsx'

const root = document.getElementById('root')

render(() => (
  <>
    <h1>Don't style this red</h1>
    <App />
  </>
), root);
