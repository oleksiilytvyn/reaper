import _ from "lodash";
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
 * Split lines and remove empty lines
 * 
 * @param value
 */
export function splitLines(value: string): string[] {
   return value.split(/\r?\n/).filter(x => x !== '');
}

/**
 * Convert Node to string in Reaper format
 * @param node
 * @constructor
 */
export function stringifyReaperNode(node: Node): string {
   return stringifyNode(node).join('');
}

/**
 * Stringify node
 */
function stringifyNode(node: Node, indent: number = 0, tab: string[] = []): string[] {
   let indentations: string[] = _.range(10).map(x => _.repeat('  ', x));

   tab.push(indentations[indent]);

   if (node.isChunk) {
      tab.push('<') // Open chunk
   }

   if (node.tokens && node.tokens.length > 0) {
      tab.push(...node.getTokensAsLine());
   } else {
      tab.push(node.line);
   }

   tab.push('\n');

   if (node.isChunk) {
      for (let index = 0; index < node.children.length; index++) {
         stringifyNode(node.children[index], indent + 1, tab);
      }

      tab.push(indentations[indent], ">\n");
   }

   return tab;
}

/**
 * Read a table of lines RPP
 * @param input
 * @constructor
 */
export function parseReaperString(input: string | string[]): Node | null {
   let root: Node | null = null;
   let chunk: Node | null = null;
   let parent: Node | null = null;
   let lines: string[] = typeof input === 'string' 
      ? splitLines(input)
      : input;

   for (let index = 0; index < lines.length; index++) {
      let line = lines[index].trim(); // ignore surrounding white space
      let first = line[0];

      // Is this line a node or a chunk?
      if (first == "<") {
         chunk = new Node(line.substring(1));
         chunk.isChunk = true;

         if (parent !== null)
            parent.addNode(chunk);

         parent = chunk;

         if (root === null) {
            root = chunk;
         }
      } else if (first === '>') {
         parent = parent!.parent;
      } else {
         parent?.addNode(new Node(line));
      }
   }

   return root;
}

/**
 * Returns specific Node type based on first token
 * 
 * @param line
 */
function getSpecificNode(line: string): Node {
   const index = line.indexOf(' ');
   const type = index >= 0 ? line.substring(0, index) : line;

   switch (type){
      default:
         return new Node(line);
   }
}

/**
 * Create a RPP from scratch.
 * You need to write it to file after you have added the chunk you want.
 */
export function createReaperProject(
   version: string = '0.1',
   system: string = '6.21/win64',
   time: number = 0): Node 
{ 
   if (time === 0)
      time = Date.now();

   return createReaperChunk(["REAPER_PROJECT", version, system, time.toString()]);
}

/**
 * 
 * @param value
 */
export function createReaperTokens(value: string[]): Token[] {
   return value.map(x => new Token(x));
}

/**
 * 
 * @param tab
 */
export function createReaperChunk(tab: string[]): Node {
   const chunk = new Node('');
   chunk.tokens = createReaperTokens(tab);

   return chunk;
}

/**
 * 
 * @param value
 */
export function createReaperNode(value: string[]): Node {
   const node = new Node();

   if (value.length > 1) {
      node.tokens = createReaperTokens(value);
   } else {
      node.line = value[0];
   }

   return node;
}

/**
 * Convert string to list of tokens
 * 
 * @param line
 */
export function tokenize(line: string): Token[] {
   let index = 0;
   let tokens: Token[] = [];
   const length = line.length;

   while (index <= length) {
      let buffer = '';
      let char = '';

      while (index <= length && isWhiteSpace(line[index])) {
         index++;
      }

      char = line[index];
      let quote = false;
      let quoteChar = '0';

      if (char === '\'' || char === '"' || char === '`') {
         quote = true;
         quoteChar = char;
      } else {
         buffer += char;
      }

      index++;

      while (index <= length) {
         char = line[index];
         index++;

         if (quote) {
            if (char === quoteChar) break;
         } else if (isWhiteSpace(char)) break;
         
         buffer += char;
      }

      tokens.push(new Token(buffer));
   }

   return tokens;
}
