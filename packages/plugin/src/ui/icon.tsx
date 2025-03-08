import { concat, filter, map, split, uniq } from "lodash";

/**
 * Combine class names
 *
 * @param classNames
 */
export function cn(...classNames: (string | undefined | null)[]): string {
   const names = concat(...map(classNames, x => split(x, /\s+/)));
   return filter(uniq(names), y => !!y && /-?[_a-zA-Z]+[_a-zA-Z0-9-]*/g.test(y)).join(' ');
}


const IconSetMap = {
   solid: 'fas',
   regular: 'fa-regular',
   light: 'fa-light',
   thin: 'fa-thin',
   brands: 'fa-brands',
   duotone: 'fa-duotone',
   flag: 'flag-icon'
}

export type IconSet = keyof typeof IconSetMap;

const IconSizeMap = {
   xxs: "fa-2xs", // 2xs
   xs: "fa-xs",
   sm: "fa-sm",
   lg: "fa-lg",
   xl: "fa-xl",
   xxl: "fa-2xl", // 2xl
   x1: "fa-1x",
   x2: "fa-2x",
   x3: "fa-3x",
   x4: "fa-4x",
   x5: "fa-5x",
   x6: "fa-6x",
   x7: "fa-7x",
   x8: "fa-8x",
   x9: "fa-9x",
   x10: "fa-10x",
   regular: "",
}

export type IconSize = keyof typeof IconSizeMap;

type IconName = string;

export interface IconProps {
   name: IconName;
   set?: IconSet;
   size?: IconSize;
   fixed?: boolean;
   class?: string;
   style?: string;
   title?: string;
}

/**
 * Render icon
 *
 * @param props
 * @constructor
 */
export function Icon(props: IconProps) {
   const set = () => IconSetMap[props?.set ?? 'solid'];
   const size = () => IconSizeMap[props?.size ?? 'regular'];
   const fixedWidth = props?.fixed === true ? 'fa-fw' : '';
   const iconName = () => props?.set != 'flag' ? `fa-${props.name}` : `flag-icon-${props.name.toLowerCase()}`;

   return <i class={cn(set(), iconName(), size(), fixedWidth, props.class ?? '')} style={props.style}></i>
}

export default Icon;
