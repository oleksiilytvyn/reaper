import { Command, CommandType } from "./command";

/**
 * Requests track count
 * `value` is 0 (no tracks, just master track) or greater.
 *
 * @class
 */
export class TrackCountCommand extends Command<TrackCountResponse> {

   public type: CommandType = CommandType.TrackCount;

   public constructor() {
      super('NTRACK');
   }

   public parse(tokens: string[][]): TrackCountResponse {
      return tokens.length > 0 && tokens[0].length == 2 ? parseInt(tokens[0][1]) : 0;
   }
}

export type TrackCountResponse = number;
