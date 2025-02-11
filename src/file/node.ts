import { Token, tokenize } from "./token";
import { ChunkNode } from "./chunk";

export class Node {

   public parent: Node | null = null;
   public line: string = '';
   public tokens: Token[] = [];
   public children: Node[] = [];

   public constructor() {

   }

   public getTokens(): Token[] {
      // TODO: Check if tokens parsed
      if (!this.tokens) {
         this.tokens = tokenize(this.line);
      }

      return this.tokens;
   }

   public getToken(index: number): Token {
      return this.getTokens()[index];
   }

   public getName(): string {
      return this.getToken(0).getString();
   }

   public getParam(index: number): Token {
      return this.getToken(index);
   }

   public getTokensAsLine(): string[] {
      let lines: string[] = [];
      const tokens = this.getTokens();

      for (let index = 0; index < tokens.length; index++) {
         let token = tokens[index];

         lines.push(token.toSafeString(token.getString()));
      }

      return lines;
   }

   public addNode(node: ChunkNode): ChunkNode {
      node.parent = this;
      this.children.push(node);

      return node;
   }


   // TODO: Remove node from parent and self destruct
   public remove(): void {
   }
}
