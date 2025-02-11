import { Command, CommandType } from './command'

/**
 * Set Position
 * Sets edit cursor position (seeking playback) to value_in_seconds
 *
 * @class
 **/
export class SetPositionCommand extends Command<SetPositionCommandResponse> {

   public type: CommandType = CommandType.Position;
   public position: PositionType;
   public value: string;

   public constructor(type: PositionType, value: string) {
      let cmd = '';

      if (type == PositionType.PositionSeconds && isNaN(parseFloat(value))) {
         throw new Error(`Position value is not valid for seconds type`);
      } else if (isNaN(parseInt(value))) {
         throw new Error('Position value is not valid');
      }

      // r1 goes to region ID 1, m1 to marker 1, R1 to first timeline region, M1 to first timeline marker
      switch (type) {
         case PositionType.PositionSeconds:
            cmd = `SET/POS/${value}`;
            break;
         case PositionType.MarkerId:
            cmd = `SET/POS_STR/m${value}`;
            break;
         case PositionType.RegionId:
            cmd = `SET/POS_STR/r${value}`;
            break;
         case PositionType.MarkerIndex:
            cmd = `SET/POS_STR/M${value}`;
            break;
         case PositionType.RegionIndex:
            cmd = `SET/POS_STR/R${value}`;
            break;
         default:
            throw new Error('Unable to set playback position as arguments are incompatible');
      }

      super(cmd, cmd);

      this.value = value;
      this.position = type;
   }

   public parse(tokens: string[][]): SetPositionCommandResponse {
   }
}

export enum PositionType {
   PositionSeconds = 'seconds',
   RegionId = 'region',
   MarkerId = 'marker',
   RegionIndex = 'region-index',
   MarkerIndex = 'marker-index'
}

export type SetPositionCommandResponse = void;
