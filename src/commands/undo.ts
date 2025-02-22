import { Command, CommandType } from "./command";

/**
 * Adds an undo point, useful if you have modified anything that needs it.
 *
 * @class
 */
export class UndoCommand extends Command<UndoCommandResponse> {

   public type: CommandType = CommandType.Undo;
   public message: string;

   public constructor(message: string) {
      super(`SET/UNDO/${message}`);

      this.message = message;
   }

   public parse(tokens: string[][]): UndoCommandResponse {
   }
}

export type UndoCommandResponse = void;

/**
 * Begins an undo block (should always be matched with SET/UNDO_END!)
 *
 * @class
 */
export class UndoBeginCommand extends Command<UndoBeginCommandResponse> {

   public type: CommandType = CommandType.Undo;

   public constructor() {
      let cmd = `SET/UNDO_BEGIN`;

      super(cmd, cmd);
   }

   public parse(tokens: string[][]): UndoBeginCommandResponse {
   }
}

export type UndoBeginCommandResponse = void;

/**
 * Ends an undo block
 *
 * @class
 */
export class UndoEndCommand extends Command<UndoEndCommandResponse> {

   public type: CommandType = CommandType.Undo;
   public message: string;

   public constructor(message: string) {
      let cmd = `SET/UNDO_END/${message}`;

      super(cmd, cmd);

      this.message = message;
   }

   public parse(tokens: string[][]): UndoEndCommandResponse {
   }
}

export type UndoEndCommandResponse = void;
