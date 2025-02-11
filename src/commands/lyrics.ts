import { Command, CommandType } from './command';
import _ from 'lodash';

/**
 * Retrieves MIDI lyrics for track index.
 *
 * @class
 **/
export class LyricsCommand extends Command<LyricsCommandResponse> {

   public type: CommandType = CommandType.Lyrics;
   public track: number;

   /**
    * @param {number} track     track index
    * @constructor
    */
   public constructor(track: number) {
      if (track < 0) {
         throw new Error(`Track number is not valid`);
      }

      super(`LYRICS/${track}`, `LYRICS\t${track}`);

      this.track = track;
   }

   public parse(tokens: string[][]): LyricsCommandResponse {
      // LYRICS \t trackindex \t beat_position \t lyric \t ...
      // String will have newlines/tabs/backslashes encoded as \\n, \\t and \\. Length is limited to around 16k.
      return {
         beatPosition: tokens[0][1],
         lyrics: _.slice(tokens[0], 2)
      };
   }
}

export type LyricsCommandResponse = {
   beatPosition: string;
   lyrics: string[]
};