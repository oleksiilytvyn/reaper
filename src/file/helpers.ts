import _ from "lodash";
import { Chunk, ChunkNode } from "./chunk";
import { Node } from "./node";
import { Token } from "./token";

/**
 * Is the character a white space or a new line or a tab
 *
 * @param value Value to check
 */
export function isWhiteSpace(value: string): boolean {
   return _.trim(value) === '';
}

/**
 *
 * @param value
 */
export function splitLines(value: string): string[] {
   return value.split(/\r?\n/).filter(x => x !== '');
}

export function StringifyRPPNode(node: Chunk | Node): string {
   return TableRPPNode(node).join('');
}

/**
 * Stringify a Chunk
 */
export function TableRPPNode(node: Node, indent: number = 0, tab: string[] = []): string[] {
   let indentations: string[] = _.range(10).map(x => _.repeat('  ', x));

   tab.push(indentations[indent]);

   if (node instanceof Chunk) {
      tab.push('<') // Open chunk
   }

   if (node.tokens) {
      tab.push.apply(node.getTokensAsLine());
   } else {
      tab.push(node.line);
   }

   tab.push('\n');

   if (node instanceof Chunk) {
      for (let index = 0; index < node.children.length; index++) {
         TableRPPNode(node.children[index], indent + 1, tab); // TODO:
      }

      tab.push(indentations[indent]);
      tab.push(">\n");
   }

   return tab;
}

/**
 * Read a table of lines RPP
 * @param input
 * @constructor
 */
export function ReadRPPChunk(input: string | string[]): ChunkNode | null {
   let root: ChunkNode | null = null;
   let chunk: Chunk | null = null;
   let parent: Node | null = null;
   let lines: string[] = typeof input === 'string' 
      ? splitLines(input)
      : input;

   for (let index = 0; index < lines.length; index++) {
      let line = lines[index].trim(); // ignore surrounding white space
      let first = line[0];

      // Is this line a node or a chunk?
      if (first == "<") {
         chunk = new Chunk();
         chunk.line = line.substring(1);

         if (parent !== null)
            parent.addNode(chunk);

         parent = chunk;

         if (root === null) {
            root = chunk;
         }
      } else if (first === '>') {
         parent = parent!.parent;
      } else {
         let node = new Node();
         node.line = line;

         parent?.addNode(node);
      }
   }

   return root;
}

/**
 * Create a RPP from scratch.
 * You need to write it to file after you have added the chunk you want.
 *
 */
export function CreateRPP(
   version: string = '0.1',
   system: string = '6.21/win64',
   time: string = ''): Chunk { // TODO: Extra parameter could be added
   if (time === '')
      time = (new Date()).toLocaleTimeString(); // TODO: Check correct date format

   return CreateRChunk(["REAPER_PROJECT", version, system, time]);
}

export function CreateRTokens(value: string[]): Token[] {
   let tokens: Token[] = [];

   for (let index = 0; index < value.length; index++) {
      tokens.push(new Token(value[index].toString()));
   }

   return tokens;
}

export function CreateRChunk(tab: string[]): Chunk {
   const tokens = CreateRTokens(tab);
   const chunk = new Chunk();
   chunk.tokens = tokens;

   return chunk;
}

export function CreateRNode(value: string[]): Node {
   const node = new Node();

   if (value.length > 1) {
      node.tokens = CreateRTokens(value);
   } else {
      node.line = value[0];
   }

   return node;
}

export function AddRChunk(parent: Node, tab: string[]): Node {
   const chunk = CreateRChunk(tab)

   return parent.addNode(chunk);
}

export function AddRNode(parent: Node, tab: string[]): Node {
   const chunk = CreateRNode(tab)

   return parent.addNode(chunk);
}

export function AddRToken(node: Node, tab: string[]): Token[] {
   const tokens = CreateRTokens(tab);
   node.tokens = tokens;

   return tokens;
}

/**
 * Convert string to list of tokens
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
