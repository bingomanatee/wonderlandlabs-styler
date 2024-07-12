import {Styler} from "../../lib/Styler.ts";

const styles = {
  button: {
    light: {
      default: {
        backgroundColor: '#818181',
        color: 'white'
      },
      secondary: {
        backgroundColor: '#96c8e7',
        color: 'white'
      },
      primary: {
        backgroundColor: '#3399FF',
        color: 'white'
      }
    },
    dark: {
      default: {
        backgroundColor: '#818181',
        color: 'black'
      },
      secondary: {
        backgroundColor: '#415560',
        color: 'black'
      },
      primary: {
        backgroundColor: '#174472',
        color: 'black'
      }
    }
  }
};

Styler.Singleton.many(styles, ['target', 'appearance', 'variant']);
console.log('>>>> imported styles: ', Styler.Singleton.targetStyles);