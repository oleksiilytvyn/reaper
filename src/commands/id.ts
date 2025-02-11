import { Command, CommandType } from "./command";

export { IdCommandType } from "./idType";

/**
 * Execute Reaper command
 * These typically do not have any response.
 *
 * @class
 **/
export class IdCommand extends Command<IdCommandResponse> {

   public type: CommandType = CommandType.Id;

   public id: number;

   /**
    * @param {number} id     number from 0 to 65535.
    * @constructor
    */
   public constructor(id: number) {
      if (id < 0 || id > 65535) {
         throw new Error(`Command ID doesn't match required format`);
      }

      super(`${id}`, `${id}`);

      this.id = id;
   }

   public parse(tokens: string[][]): IdCommandResponse {
      return {};
   }
}

export type IdCommandResponse = {};
