import fs from 'node:fs/promises';
import { parseReaperString, stringifyReaperNode } from './helpers';
import { Node } from './node';

/**
 * Read from string
 * 
 * @param input
 */
export async function readReaperString(input: string): Promise<Node> {
   try {
      const chunk = parseReaperString(input);

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
export async function readReaperFile(filename: string): Promise<Node> {
   try {
      const data = await fs.readFile(filename);
      const chunk = readReaperString(data.toString());
      
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
export async function writeReaperString(root: Node): Promise<string> {
   try {
      const str = stringifyReaperNode(root);

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
export async function writeReaperFile(filename: string, root: Node): Promise<void> {
   if (!filename)
      return Promise.reject("No file name");

   if (!root)
      return Promise.reject("No chunk passed");

   try {
      await fs.writeFile(filename, await writeReaperString(root));

      return Promise.resolve();
   } catch (error) {
      return Promise.reject(`Writing to file failed\n${filename}`);
   }
}
