import { Command, CommandType } from './command';
import { parseColor } from "~/utils";
import _ from 'lodash';

/**
 * List regions
 * `color` is in the form of 0xaarrggbb, nonzero if a custom color set
 *
 * @class
 **/
export class RegionsCommand extends Command<RegionsCommandCommandResponse> {

   public type: CommandType = CommandType.Regions;

   public constructor() {
      super('REGION');
   }

   public parse(tokens: string[][]): RegionsCommandCommandResponse {
      return _.map(tokens, x => ({
         name: x[1],
         id: x[2],
         startPosition: x[3],
         endPosition: x[4],
         color: parseColor(x[5])
      }));
   }
}

export type Region = {
   name: string,
   id: string,
   startPosition: string,
   endPosition: string,
   color: string
};
export type RegionsCommandCommandResponse = Region[];
