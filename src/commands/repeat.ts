import { Command, CommandType } from './command'

/**
 * Set repeat type
 *
 * @class
 **/
export class SetRepeatCommand extends Command<SetRepeatCommandResponse> {

   public type: CommandType = CommandType.Position;
   public repeat: RepeatType;

   public constructor(type: RepeatType) {
      let cmd = `SET/REPEAT/${type}`;

      super(cmd, cmd);

      this.repeat = type;
   }

   public parse(tokens: string[][]): SetRepeatCommandResponse {
   }
}

export enum RepeatType {
   Toggle = -1,
   Disable = 0,
   Enable = 1
}

export type SetRepeatCommandResponse = void;

/**
 * Set repeat type
 *
 * @class
 **/
export class GetRepeatCommand extends Command<GetRepeatCommandResponse> {

   public type: CommandType = CommandType.Position;

   public constructor(type: RepeatType) {
      let cmd = `GET/REPEAT`;

      super(cmd, cmd);
   }

   public parse(tokens: string[][]): GetRepeatCommandResponse {
      let value = parseInt(tokens[0][0]);

      return value == RepeatType.Enable
         ? RepeatType.Enable
         : RepeatType.Disable;
   }
}


export type GetRepeatCommandResponse = RepeatType;
