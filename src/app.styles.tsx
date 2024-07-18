import {Styler} from "./lib/Styler.ts";

const APP_STYLES = {
  width: '100%',
  display: 'block',
  height: '100%',
  flex: 1,
}

Styler.Singleton.add('app', APP_STYLES, {});

Styler.Singleton.addMany({
  app: {
    light: {
      backgroundColor: 'white',
      colorScheme: 'light'
    },
    dark: {
      backgroundColor: 'black',
      colorScheme: 'dark'
    }
  },

}, ['target', 'appearance']);

Styler.Singleton.addMany({
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

Styler.Singleton.addMany({
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