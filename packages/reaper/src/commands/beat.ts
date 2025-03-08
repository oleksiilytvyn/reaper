import { Command, CommandType } from "./command";
import { TransportPlayState } from "./transport";

/**
 * Beat Position
 *
 * @class
 */
export class BeatCommand extends Command<BeatCommandResponse> {
   public type: CommandType = CommandType.Beat;

   public constructor() {
      super('BEATPOS');
   }

   public parse(tokens: string[][]): BeatCommandResponse {
      return tokens.length > 0 && tokens[0].length > 6 ? {
         state: parseInt(tokens[0][1]) as TransportPlayState,
         positionSeconds: parseFloat(tokens[0][2]),
         fullBeatPosition: tokens[0][3],
         measure: tokens[0][4],
         tsNumerator: tokens[0][5],
         tsDenominator: tokens[0][6]
      } : undefined;
   }
}

export type BeatCommandResponse = {
   state: TransportPlayState,
   positionSeconds: number,
   fullBeatPosition: string,
   measure: string,
   tsNumerator: string,
   tsDenominator: string
} | undefined;
