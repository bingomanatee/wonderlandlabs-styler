import {useState} from 'react'
import './app.styles';
import viteLogo from '/vite.svg'
import './App.css'
import {LightOrDark} from "./components/context/lightOrDark.tsx";
import Button from "./components/buttons/Button.tsx";
import {Styler} from "./lib/Styler.ts";
import {StyleAttrs} from "./types.ts";

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
/*
const TARGET: StyleAttrs = {
  "size": "1",
  "appearance": "light"
};
console.log('styler: styles in ', Styler.Singleton.targetStyles.get('h').map(s => s.style));
console.log('styler: attrs in ', Styler.Singleton.targetStyles.get('h').map(s => s.attrs));

console.log('styler: lessSpecificStyles ', TARGET, '=', Styler.Singleton.lessSpecificStyles('h', TARGET)
  .filter(s => s.style));

console.log('styler: includes for ',TARGET, '=', Styler.Singleton.targetStyles.get('h')
  .filter((style) => style.includes(TARGET)).map((s) => s.style));

console.log('styler: matches for ', TARGET, '=',Styler.Singleton.targetStyles.get('h')
  .filter((style) => style.matches(TARGET)).map((s) => s.style));

console.log('style for ', TARGET, 'is', Styler.Singleton.for('h', TARGET));*/
export default App
