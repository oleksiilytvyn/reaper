/**
 * @function
 * */
export function toVolumeString(volume: string): string {
   let result = parseFloat(volume);

   if (result < 0.00000002980232)
      return "-inf dB";

   result = Math.log(result) * 8.68588963806;

   return result.toFixed(2) + " dB";
}

/**
 * @function
 * */
export function toPanString(pan: number): string {
   if (Math.abs(pan) < 0.001)
      return "center";

   if (pan > 0)
      return (pan * 100).toFixed(0) + "%R";

   return (pan * -100).toFixed(0) + "%L";
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
export function parseColor(value: string): string {
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
