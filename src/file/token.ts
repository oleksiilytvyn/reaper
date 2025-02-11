import { isWhiteSpace } from './helpers';

/**
 *
 * @param line
 */
export function tokenize(line: string): Token[] {
   let index = 0;
   let tokens: Token[] = [];

   while (index <= line.length) {
      let buff = '';
      let c = '';

      // Ignore white space
      while (index <= line.length) {
         c = line.charAt(index);
         if (!isWhiteSpace(c)) {
            break;
         }
         index++;
      }

      // Check if next character is a quote
      c = line.charAt(index);
      let quote = false;
      let quoteChar = '0';

      if (c === '\'' || c === '"' || c === '`') {
         quote = true;
         quoteChar = c;
      } else {
         buff += c;
      }
      index++;

      // Read till quote or whitespace
      while (index <= line.length) {
         c = line.charAt(index);
         index++; // Fixed increment

         if (quote) {
            if (c === quoteChar) {
               break;
            } else {
               buff += c;
            }
         } else {
            if (isWhiteSpace(c)) {
               break;
            } else {
               buff += c;
            }
         }
      }

      // At this point, buff is the next token
      tokens.push(new Token(buff));
   }

   return tokens;
}

/**
 * Token
 *
 * @class
 */
export class Token {
   public token: string = '';

   public constructor(token: string) {
      this.token = token;
   }

   public getString(): string {
      return this.token;
   }

   public getNumber(): number {
      return this.token.indexOf('.') > 0
         ? parseFloat(this.token)
         : parseInt(this.token);
   }

   public getBoolean(): boolean {
      return this.token !== '0';
   }

   public setString(value: string): void {
      this.token = value;
   }

   public setNumber(value: number): void {
      this.token = value.toString();
   }

   public setBoolean(value: boolean): void {
      this.token = value ? '1' : '0';
   }

   // TODO: Can be made static function or moved to library
   public toSafeString(value: string): string {
      if (!value || value === '') {
         return '\"\"';
      } else if (value.indexOf(' ') >= 0) {
         if (value.indexOf('\"')) {
            if (value.indexOf('\'')) {
               value = value.replaceAll('`', '\'');

               return `\`${value}\``;
            } else {
               return `'${value}'`;
            }
         } else {
            return `\"${value}\"`
         }
      } else {
         return value;
      }
   }
}
