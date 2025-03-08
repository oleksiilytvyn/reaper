import { Token } from "./token";
import { tokenize } from './helpers';
import { NodeType } from "./nodetype";

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
   public isChunk: boolean = false;
   public type: NodeType = NodeType.Default;

   public constructor(line: string = '') {
      this.line = line;
      this.tokens = tokenize(line);
   }

   public addNode(node: Node): Node {
      node.parent = this;
      this.children.push(node);

      return node;
   }
   
   /**
    * Print node in human-readable format
    */
   public toString(): string {
      const tokens = this.tokens.map(x => x.toString()).slice(1).join(' ');

      if (this.children.length == 0)
         return `${this.type} (${tokens})`;

      const children = this.children.map(x => x.toString().split('\n').map(x => `  ${x}`).join('\n'))
         .join("\n");

      return `${this.type} (${tokens})\n${children}`;
   }
}
