import { Token, TokenType } from "./token";
import { ChunkNode } from "./chunk";
import { toSafeString } from "~/utils";
import { tokenize } from './helpers';

export enum NodeType {
   Track = 'TRACKID',
   Guid = 'GUID',
   Iguid = 'IGUID'
}

/**
 * Basic Node in Reaper file format
 * 
 * @class
 */
export class Node {
   public parent: Node | null = null;
   public line: string = '';
   public tokens: Token[] = [];
   public children: Node[] = [];

   public constructor(line: string = '') {
      this.line = line;
      this.tokens = tokenize(line);
   }

   public getTokens(): Token[] {
      if (!this.tokens) {
         this.tokens = tokenize(this.line);
      }

      return this.tokens;
   }

   public getToken(index: number): Token {
      return this.getTokens()[index];
   }

   public getName(): string {
      return this.getToken(0).value();
   }

   public getTokensAsLine(): string[] {
      let lines: string[] = [];
      const tokens = this.getTokens();

      for (let index = 0; index < tokens.length; index++) {
         let token = tokens[index];

         lines.push(toSafeString(token.value()));
      }

      return lines;
   }

   public addNode(node: ChunkNode): ChunkNode {
      node.parent = this;
      this.children.push(node);

      return node;
   }
   
   public remove(): void {
      if (!this.parent)
         return;

      const index = this.parent.children.indexOf(this);

      if (index >= 0){
         this.parent.children = this.parent.children.splice(index, 1);
      }
   }

   /**
    * Print node in human-readable format
    */
   public toString(): string {
      const tokens = this.tokens.map(x => x.toString()).join('; ');

      if (this.children.length == 0)
         return `Node (${tokens})`;

      const children = this.children.map(x => x.toString().split('\n').map(x => `  ${x}`).join('\n'))
         .join("\n");

      return `Node (${tokens})\n${children}`;
   }
}
