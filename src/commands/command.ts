export interface ICommand {
   command: string;
   response: any;
   token: string;
   type: CommandType;

   parse(tokens: string[][]): any;

   // OSC support
   oscPath(): string;

   oscArgs(): { type: string, value: boolean | number | string }[];
}

/***
 * Base class for all commands
 *
 * @class
 */
export abstract class Command<TResponse> implements ICommand {
   public token: string;
   public command: string;
   public response: TResponse | null = null; // Property set form response parse() method by client
   public type: CommandType = CommandType.Unknown;

   protected constructor(command: string, token: string) {
      this.command = command;
      this.token = token;
   }

   public abstract parse(tokens: string[][]): TResponse;

   public oscPath(): string {
      return this.command;
   }

   public oscArgs(): ({ type: string; value: boolean | number | string })[] {
      // THIS METHOD SHOULD BE IMPLEMENTED BY EACH COMMAND
      return [];
   }
}

export enum CommandType {
   Unknown = 'unknown',
   Id = 'id',
   PluginId = 'plugin-id',
   Lyrics = 'lyrics',
   Markers = 'markers',
   Regions = 'regions',
   Osc = 'osc',
   Position = 'position',
   Repeat = 'repeat',
   State = 'state',
   Track = 'track',
   TrackCount = 'track-count',
   Transport = 'transport',
   Undo = 'undo',
   Beat = 'beat'
}
