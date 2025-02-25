import _ from "lodash";

export type RgbaColor = `rgba(${number},${number},${number},${number})`;
export type PanString = 'center' | `${number}%L` | `${number}%R`;
export type VolumeString = '-inf dB' | `${number} dB`;

/**
 * @function
 * */
export function toVolumeString(volume: string): VolumeString {
   let result = parseFloat(volume);

   if (result < 0.00000002980232)
      return '-inf dB';

   result = Math.log(result) * 8.68588963806;

   return (result.toFixed(2) + ' dB') as VolumeString;
}

/**
 * Convert number to pan string
 * @function
 * */
export function toPanString(pan: number): PanString {
   if (Math.abs(pan) < 0.001)
      return 'center';

   return ((pan * 100 * (pan > 0 ? 1 : -1)).toFixed(0) + `%${pan > 0 ? 'R' : 'L'}`) as PanString;
}

/**
 * @function
 * */
export function unescapeString(value: any): string {
   return String(value)
      .replace(/\\t/g, "\t")
      .replace(/\\n/g, "\n")
      .replace(/\\\\/g, "\\");
}

/**
 * Parse color in Reaper format and return color in rgba() format
 * @function
 */
export function parseColor(value: string): RgbaColor {
   if (!value || value == '0')
      return 'rgba(0,0,0,0)';

   let number = parseInt(value);
   let b = number & 0xFF;
   let g = (number & 0xFF00) >>> 8;
   let r = (number & 0xFF0000) >>> 16;
   let a = Math.round(1 / (((number & 0xFF000000) >>> 24) / 255) * 100) / 100;

   a = a >= Infinity ? 0 : a;

   return `rgba(${r},${g},${b},${a})`;
}

/**
 * Convert color components to Reaper format color
 * @function
 */
export function toColor(alpha: number, red: number, green: number, blue: number): string {
   const toHex = (x: number) => {
      return x.toString(16);
   };

   return `${toHex(alpha)}${toHex(red)}${toHex(green)}${toHex(blue)}`;
}

/**
 * Escape string for writing to Reaper file
 * @param value
 */
export function toSafeString(value: string): string {
   if (!value) return '""';

   if (value.includes(' ')) {
      if (value.includes('"')) {
         return value.includes("'") 
            ? `\`${value.replaceAll('`', "'")}\`` 
            : `'${value}'`;
      }

      return `"${value}"`;
   }

   return value;
}

/**
 * Is the character a white space or a new line or a tab
 *
 * @param value Value to check
 */
export function isWhiteSpace(value: string): boolean {
   return _.trim(value) === '';
}

/**
 * Split lines and remove empty lines
 *
 * @param value
 */
export function splitLines(value: string): string[] {
   return value.split(/\r?\n/).filter(x => x !== '');
}
