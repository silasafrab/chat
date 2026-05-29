import iconSet from "../../../assets/icons.json";
import IcoMoonModule from "react-icomoon";
import type { ComponentType } from "react";
import type { IcoMoonProps } from "react-icomoon";

// react-icomoon é CJS: o default do Vite pode vir como { default: Component }
const IcoMoon = (
  typeof IcoMoonModule === "function"
    ? IcoMoonModule
    : (IcoMoonModule as { default: ComponentType<IcoMoonProps> }).default
) as ComponentType<IcoMoonProps>;

interface IconProps {
  icon: string;
  size?: number;
  className?: string;
  color?: string;
  [key: string]: any;
}

const isValidIcon = (iconName: string): boolean => {
  return (iconSet.icons as Array<any>).some((icon: any) =>
    icon.properties.name === iconName
  );
};

const Icon = (props: IconProps) => {
  if (!isValidIcon(props.icon)) {
    console.warn(`Ícone "${props.icon}" não encontrado no conjunto de ícones.`);
    return null;
  }

  return (
    <IcoMoon {...props} disableFill iconSet={iconSet} size={props.size ?? 24} />
  );
};

export default Icon;
