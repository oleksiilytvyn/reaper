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

   /**
    * Print token in human-readable string
    */
   public toString(){
      return `Token (${this.token})`;
   }
}
