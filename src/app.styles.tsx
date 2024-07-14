import {Styler} from "./lib/Styler.ts";

const APP_STYLES = {
  width: '100%',
  display: 'block',
  height: '100%',
  flex: 1,
}

Styler.Singleton.many({
  app: {
    light: {
      ...APP_STYLES,
      backgroundColor: 'white',
      colorScheme: 'light'
    },
    dark: {
      ...APP_STYLES,
      backgroundColor: 'black',
      colorScheme: 'dark'
    }
  },

}, ['target', 'appearance']);

Styler.Singleton.many({
  h: {
    1: {
      fontSize: '2rem',
      fontWeight: 800,
      textTransform: 'uppercase'
    },
    2: {
      fontSize: '1.5rem',
      fontWeight: 600,
    }
  }
}, ['target', 'size'])

Styler.Singleton.many({
  h: {
    1: {
      light: {
        color: 'black'
      },
      dark: {
        color: 'white'
      }
    },
    2: {
      light: {
        color: '#666666'
      },
      dark: {
        color: '#999999'
      }
    }
  }
}, ['target', 'size', 'appearance'])

console.log('=========== styles are:', Styler.Singleton.targetStyles)