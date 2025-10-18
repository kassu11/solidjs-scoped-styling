import { createSignal } from 'solid-js'
import './App.scoped.css'

function App() {
  const [count, setCount] = createSignal(0)

  return (
    <>
      <h1>Style this</h1>
      <p>Lorem ipsum dolor sit amet.</p>
      <p>Lorem ipsum dolor sit amet.</p>
      <p>Lorem ipsum dolor sit amet.</p>
      <p>Lorem ipsum dolor sit amet.</p>
      <p data-special>Lorem ipsum dolor sit amet.</p>
      <a href="#link with a space">Purple link bold link</a>
      <a href="#check [this] out">Orange link</a>
      <p>Lorem ipsum dolor sit amet.</p>
      <p>Lorem ipsum dolor sit amet.</p>
      <p>Lorem ipsum dolor sit amet.</p>
      <p>Lorem ipsum dolor sit amet.</p>
      <p>Lorem ipsum dolor sit amet.</p>
      <p>Lorem ipsum dolor sit amet.</p>
      <p>Lorem ipsum dolor sit amet.</p>
      <p>Lorem ipsum dolor sit amet.</p>
      <p>Lorem ipsum dolor sit amet.</p>
    </>
  )
}

export default App
