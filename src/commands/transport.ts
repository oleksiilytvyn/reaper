import { Command, CommandType } from "./command";

/**
 * Transport
 *
 * `playstate` is 0 for stopped, 1 for playing, 2 for paused, 5 for recording, and 6 for record paused.
 * `is_repeat_on` will be nonzero if repeat is enabled
 * `position_string` is always in the project timeline format (time, beats, etc.)
 * `position_string_beats` is always in measures.beats.hundredths format.
 *
 * @class
 **/
export class TransportCommand extends Command<TransportCommandResponse> {

   public type: CommandType = CommandType.Transport;

   public constructor() {
      super('TRANSPORT', 'TRANSPORT');
   }

   public parse(tokens: string[][]): TransportCommandResponse {
      return tokens.length > 0 && tokens[0].length > 5 ? {
         state: parseInt(tokens[0][1]) as TransportPlayState,
         repeat: parseInt(tokens[0][3]) > 0,
         position: tokens[0][4],
         positionSeconds: parseFloat(tokens[0][2]),
         positionBeats: tokens[0][5]
      } : {
         state: TransportPlayState.Stopped,
         repeat: false,
         position: '0.0.0',
         positionSeconds: 0,
         positionBeats: '0.0.0'
      };
   }
}

/**
 * Representation of transport play state
 *
 * @enum
 */
export enum TransportPlayState {
   Stopped = 0,
   Playing = 1,
   Paused = 2,
   Recording = 5,
   RecordPaused = 6
}

export type TransportCommandResponse = {
   state: TransportPlayState,
   repeat: boolean,
   position: string,
   positionSeconds: number,
   positionBeats: string
};
