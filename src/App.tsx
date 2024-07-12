import {useState} from 'react'
import './app.styles';
import viteLogo from '/vite.svg'
import './App.css'
import {LightOrDark} from "./components/context/lightOrDark.tsx";
import Button from "./components/buttons/Button.tsx";
import {Styler} from "./lib/Styler.ts";

function App() {
  const [count, setCount] = useState(0)
  const [appearance, setApp] = useState('light');
  return (
    <LightOrDark.Provider value={appearance}>
      <div style={Styler.Singleton.for('app', {appearance})}>
        <div>
          <a href="https://vitejs.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo"/>
          </a>
          <section>
            <label htmlFor='darkModeCheckbox'>
              <input id='darkModeCheckbox' type='checkbox' checked={appearance === 'dark'}
                     onChange={(e) => setApp(e.target.checked ? 'dark' : 'light')}/>Dark Mode
            </label>: mode: {appearance}
          </section>
        </div>
        <h1 style={Styler.Singleton.for('h', {size: '1', appearance})}>Vite + React</h1>
        <div className="card">
          <Button variant='primary' onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </Button>
          <Button variant='secondary'>Secondary Button </Button>
        </div>
        <h2 style={Styler.Singleton.for('h', {size: '2', appearance})}>Click for more</h2>
        <p className="read-the-docs">
          Click on the Vite logos to learn more
        </p>
      </div>
    </LightOrDark.Provider>
  )
}

export default App
