import { Command, CommandType } from "./command";

/**
 * Reaper plugin command
 * REAPER plug-in registered command IDs (also used by ReaScripts and custom actions)
 *
 * @class
 **/
export class PluginIdCommand extends Command<PluginIdCommandResponse> {

   public type: CommandType = CommandType.PluginId;
   public id: string;

   /**
    * @param {string} id   Plugin command /([0-9][a-z]_)+/
    * @constructor
    */
   public constructor(id: string) {
      if (!/([0-9][a-z]_)+/.test(id)) {
         throw new Error(`Plugin ID doesn't match required format`);
      }

      super(`${id}`, `${id}`);

      this.id = id;
   }

   public parse(tokens: string[][]): PluginIdCommandResponse {
      // TODO: Implement Plugin Id command parsing
      return {};
   }
}

export type PluginIdCommandResponse = {};
