import fs from 'node:fs/promises';
import { ChunkNode } from "./chunk";
import { ReadRPPChunk, StringifyRPPNode } from "./helpers";

/**
 * Read from string
 * 
 * @param input
 */
export async function readReaperString(input: string): Promise<ChunkNode> {
   try {
      const chunk = ReadRPPChunk(input);

      if (!chunk){
         return Promise.reject();
      }
   
      return chunk;
   } catch (error){
      return Promise.reject();
   }
}

/**
 * Open Reaper file
 *
 * @param filename Path to file
 */
export async function readReaperFile(filename: string): Promise<ChunkNode> {
   try {
      const data = await fs.readFile(filename);
      const lines = data.toString();
      const chunk = ReadRPPChunk(lines);
      
      if (!chunk){
         return Promise.reject();
      }
      
      return chunk;
   } catch (error) {
      return Promise.reject(error);
   }
}

/**
 * Write Reaper project tor string
 * 
 * @param root
 */
export async function writeReaperString(root: ChunkNode): Promise<string> {
   try {
      const str = StringifyRPPNode(root);

      return Promise.resolve(str);
   } catch (error) {
      return Promise.reject(`Writing to string failed`);
   }
}

/**
 * Write Reaper file from project instance
 *
 * @param filename Path to file
 * @param root Reaper project instance
 */
export async function writeReaperFile(filename: string, root: ChunkNode): Promise<void> {
   if (!filename)
      return Promise.reject("No file name");

   if (!root)
      return Promise.reject("No chunk passed");

   try {
      const str = StringifyRPPNode(root);

      await fs.writeFile(filename, str);

      return Promise.resolve();
   } catch (error) {
      return Promise.reject(`Writing to file failed\n${filename}`);
   }
}
