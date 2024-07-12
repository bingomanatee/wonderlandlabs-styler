import {PropsWithChildren, useContext} from "react";
import {Styler} from "../../lib/Styler.ts";
import './styles';
import {LightOrDark} from "../context/lightOrDark.tsx";

type Props = {onClick?: () => void}  & Record<string, string>
export default function Button({children, onClick: handleClick, ...rest} : PropsWithChildren<Props>) {
  const appearance = useContext(LightOrDark);
  const style = Styler.Singleton.for('button', {...rest, appearance});
  console.log('style for button:', rest, 'is', style)

  return <button onClick={handleClick} style={style}>{children}</button>
}