import fs from 'node:fs/promises';
import { ChunkNode } from "./chunk";
import { ReadRPPChunk, StringifyRPPNode } from "./helpers";

/**
 * Open Reaper file
 *
 * @param filename Path to file
 */
export async function readReaperFile(filename: string): Promise<ChunkNode | null> {
   const data = await fs.readFile(filename);
   const lines = data.toString().split('\n');

   return ReadRPPChunk(lines);
}

/**
 * Write Reaper file from project instance
 *
 * @param filename Path to file
 * @param root Reaper project instance
 */
export async function writeReaperFile(filename: string, root: ChunkNode): Promise<[boolean, string]> {
   if (!filename)
      return [false, "No file name"];

   if (!root)
      return [false, "No chunk passed"];

   const str = StringifyRPPNode(root);

   try {
      await fs.writeFile(filename, str);

      return [true, 'File successfully created'];
   } catch (error) {
      return [false, `Writing to file failed\n${filename}`];
   }
}
