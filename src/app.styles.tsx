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
  }
}, ['target', 'appearance'])