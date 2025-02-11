import { Command, CommandType } from "./command";

/**
 * Sends an OSC message through the default processing (Default.ReaperOSC)
 * and MIDI-learn/action mappings. `oscstring:value` will be urldecoded.
 * @class
 */
export class OscCommand extends Command<OscCommandResponse> {

   public type: CommandType = CommandType.Osc;
   public message: string;
   public value: string;

   public constructor(message: string, value: string = '') {
      let cmd = `OSC/${message}${!!value ? ':' + value : ''}`;

      super(cmd, cmd);

      this.value = value;
      this.message = message;
   }

   public parse(tokens: string[][]): OscCommandResponse {
      // TODO: Parse OSC command response
      return {};
   }
}

export type OscCommandResponse = {};
