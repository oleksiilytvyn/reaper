import { AddRNode, ReadRPPChunk, splitLines, StringifyRPPNode } from "./helpers";
import { Node } from './node'

export type ChunkNode = Node | Chunk;
export type ChunkFilter = (node: ChunkNode) => boolean;

export class Chunk extends Node {

   public line: string = '';
   public parent: ChunkNode | null = null;
   public children: ChunkNode[] = [];

   public constructor() {
      super();
   }

   public findFirstNodeByName(name: string, start: number = -1, end: number = -1): ChunkNode | null {
      if (!this.children || this.children.length === 0)
         return null;

      // TODO: Optimize range search
      for (let index = 0; index < this.children.length; index++) {
         if ((start === -1 || index >= start)
            && (end === -1 || index <= end)
            && this.children[index].getName() === name) {
            return this.children[index];
         }
      }

      return null;
   }

   public findFirstChunkByName(name: string, start: number = -1, end: number = -1): Chunk | null {
      if (!this.children || this.children.length === 0)
         return null;

      // TODO: Optimize range search
      for (let index = 0; index < this.children.length; index++) {
         if ((start === -1 || index >= start)
            && (end === -1 || index <= end)
            && (this.children[index] instanceof Chunk) // TODO: Check how well it works
            && this.children[index].getName() === name) {
            return this.children[index] as Chunk;
         }
      }

      return null;
   }

   /**
    * Finds child tags that match the filter function
    *
    * @param filter
    * @param start
    * @param end
    */
   public findAllNodesByFilter(filter: ChunkFilter, start: number = -1, end: number = -1): ChunkNode[] {
      let nodes: ChunkNode[] = [];

      // TODO: Optimize range search
      for (let index = 0; index < this.children.length; index++) {
         if ((start === -1 || index >= start)
            && (end === -1 || index <= end)
            && filter(this.children[index])) {
            nodes.push(this.children[index]);
         }
      }

      return nodes;
   }

   public findAllChunksByFilter(filter: ChunkFilter, start: number = -1, end: number = -1): ChunkNode[] {
      let nodes: ChunkNode[] = [];

      // TODO: Optimize range search
      for (let index = 0; index < this.children.length; index++) {
         if ((start === -1 || index >= start)
            && (end === -1 || index <= end)
            && (this.children[index] instanceof Chunk) // TODO: Check how well it works
            && filter(this.children[index])) {
            nodes.push(this.children[index]);
         }
      }

      return nodes;
   }

   public findAllNodesByName(name: string, start: number = -1, end: number = -1): ChunkNode[] {
      return this.findAllNodesByFilter((node) => node.getName() === name, start, end);
   }

   public findAllChunksByName(name: string, start: number = -1, end: number = -1): ChunkNode[] {
      return this.findAllChunksByFilter((node) => node.getName() === name, start, end);
   }

   /**
    * Find index of given node
    * @returns Index of node or -1 if not found
    * @param node
    */
   public indexOf(node: ChunkNode): number {
      for (let index = 0; index < this.children.length; index++) {
         if (this.children[index] == node)
            return index;
      }

      return -1;
   }

   public getTextNotes(): string {
      let buffer: string[] = [];

      for (let index = 0; index < this.children.length; index++) {
         buffer.push(this.children[index].line.substring(1));
      }

      return buffer.join('\n');
   }

   public setTextNotes(value: string): ChunkNode[] {
      const tab = splitLines(value);

      this.children = []; // Reset nodes

      for (let index = 0; index < tab.length; index++) {
         AddRNode(this, [`|${tab[index]}`]);
      }

      return this.children;
   }

   // function RChunk:setTextNotes(str)
   //   local tab = SplitMultilinesStrToTab(str)
   //   self.children = {} -- reset children
   //   for i, line in ipairs( tab ) do
   //     AddRNode(self, "|" .. line)
   //   end
   //   return self.children
   // end

   public removeNode(node: ChunkNode): boolean {
      for (let index = 0; index < this.children.length; index++) {
         let child = this.children[index];

         if (node === child) {
            node.parent = null;
            this.children.splice(index, 1);

            return true;
         }
      }

      return false;
   }

   public stripGUID() {
      // Reset all GUID to let REAPER generates new ones
      const node_GUID = this.findFirstChunkByName("GUID");
      const node_IGUID = this.findFirstChunkByName("IGUID");
      const node_TRACKID = this.findFirstChunkByName("TRACKID");

      if (!!node_GUID) node_GUID.remove()
      if (!!node_IGUID) node_IGUID.remove()
      if (!!node_TRACKID) node_TRACKID.remove()
      // TODO Support even more GUID types like markers
   }

   public copy(parent: Node | null = null): Node | null {
      // TODO: Review this code
      let chunk = ReadRPPChunk(StringifyRPPNode(this));
      parent = parent || this.parent;

      if (chunk !== null && parent !== null) {
         return parent.addNode(chunk);
      }

      return null;
   }

}
