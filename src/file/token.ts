/**
 * Token
 *
 * @class
 */
export class Token {
   private token: string = ''; // Original value
   public type: TokenType = TokenType.string; // Value type

   public constructor(token: string, type: TokenType = TokenType.unknown) {
      this.token = token;
      this.type = type === TokenType.unknown ? this.guessType(this.token) : type;
   }

   /**
    * Try to guess type from string
    */
   public guessType(input: string): TokenType {
      if (input === '')
         return TokenType.null;

      // if (input == '0' || input == '1')
      //    return TokenType.boolean;

      if (input.startsWith('{'))
         return TokenType.guid;
      
      if (!isNaN(+input))
         return TokenType.number;
      
      return TokenType.string;
   }

   public value(): string
   public value(value: string): void
   public value(type: TokenType.null): null
   public value(type: TokenType.guid): string
   public value(type: TokenType.number): number
   public value(type: TokenType.string): string
   public value(type: TokenType.boolean): boolean
   public value(value?: any, type?: TokenType): any {
      if (arguments.length == 0){
         // Return value as string
         return this.token;
      } 
      
      if (arguments.length == 1){
         if (typeof arguments[0] === typeof TokenType){
            // Get as type
            return this.getValue(type!);
         } else {
            // Set value by guessed type
            this.setValue(value, this.guessType(value));
         }
      }
      
      if (arguments.length == 2){
         // Set type with value
         this.token = value;
         return this.getValue(type || TokenType.unknown);
      }
   }
   
   private setValue(input: any, type: TokenType): void {
      this.type = type;
      this.token = input;
   }

   private getValue(type: TokenType): any {
      switch (type){
         case TokenType.null:
            return null;
         case TokenType.boolean:
            return this.token === '1';
         case TokenType.number:
            return this.token.indexOf('.') > 0
               ? parseFloat(this.token)
               : parseInt(this.token);
         case TokenType.guid:
            return this.token.substring(1, this.token.length - 1);
         case TokenType.string:
         default:
            return this.token;
      }
   }
   
   /**
    * Print token in human-readable format
    */
   public toString(){
      return `${this.token}`;
   }
}

/**
 * 
 */
export enum TokenType {
   string = 's',
   number = 'n',
   guid = 'g',
   boolean = 'b',
   null = '0',
   encoded = 'e', // Base64 encoded string
   unknown = 'u'
}
