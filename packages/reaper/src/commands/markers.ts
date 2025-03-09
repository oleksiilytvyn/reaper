import _ from 'lodash';
import { Command, CommandType } from './command';
import { parseColor } from "~/utils";

/**
 * List markers
 * `color` is in the form of 0xaarrggbb, nonzero if a custom color set
 *
 * @class
 **/
export class MarkersCommand extends Command<MarkersCommandCommandResponse> {

   public type: CommandType = CommandType.Markers;

   public constructor() {
      super('MARKER');
   }

   public parse(tokens: string[][]): MarkersCommandCommandResponse {
      return _.map(tokens, x => ({
         name: x[1],
         id: x[2],
         position: x[3],
         color: parseColor(x[4])
      }));
   }
}

export type Marker = {
   name: string,
   id: string,
   position: string,
   color: string
};
export type MarkersCommandCommandResponse = Marker[];
