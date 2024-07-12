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

const HeadingStyles = [{}, {
  fontSize: '2rem',
  fontWeight: 800,
},
  {
    fontSize: '1.5rem',
    fontWeight: 600,
  }
]

Styler.Singleton.many({
  h: {
    1: {
      light: {
        ...HeadingStyles[1],
        color: 'black'
      },
      dark: {
        ...HeadingStyles[1],
        color: 'white'
      }
    },
    2: {
      light: {
        ...HeadingStyles[2],
        color: '#666666'
      },
      dark: {
        ...HeadingStyles[2],
        color: '#999999'
      }
    }
  }
}, ['target', 'size', 'appearance'])