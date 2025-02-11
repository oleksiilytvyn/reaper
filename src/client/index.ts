import { ICommand } from "../commands";
import _ from "lodash";

export type ReaperEvent = () => void;
export type CommandToken = [string, number];

/**
 * Interface for Reaper client implementation
 *
 * @interface
 */
export interface IClient {
   /**
    * Make request with specified commands
    *
    * @param commands Request commands
    */
   fetch(...commands: ICommand[]): Promise<ICommand[]>;

   /**
    * Bind event handler
    *
    * @method
    */
   bind(name: string, event: ReaperEvent): void;

   /**
    * Unbind previously bound event handler or if not passed unbind all event by given name
    *
    * @method
    */
   unbind(name: string, event: ReaperEvent | undefined): void;
}

/**
 * Interface for Reaper client implementation
 *
 * @class
 */
export class BaseClient implements IClient {

   private events: { [key: string]: ReaperEvent[] } = {};

   public constructor() {
   }

   /**
    * Make request with specified commands
    *
    * @param commands Request commands
    */
   public async fetch(...commands: ICommand[]): Promise<ICommand[]> {
      return new Promise((accept, decline) => decline('Not implemented'));
   }

   /**
    * Bind event handler
    *
    * @method
    */
   public bind(name: string, event: ReaperEvent): void {
      this.events[name].push(event);
   }

   /**
    * Unbind previously bound event handler or if not passed unbind all event by given name
    *
    * @method
    */
   public unbind(name: string, event: ReaperEvent | undefined): void {
      if (event === undefined) {
         this.events[name] = [];
      } else {
         _.remove(this.events[name], x => x === event);
      }
   }

   /**
    * Parse response text and commands
    *
    * @param response Text of HTTP response from Reaper
    * @param commands List of request commands
    */
   protected parse(response: string, ...commands: ICommand[]): ICommand[] {
      // pairs of tokens and command indexes
      let commandTokens: CommandToken[] =
         _.sortBy(_.map(commands, (value, index) => [value.token, index]) as CommandToken[],
               x => x[0].length)
            .reverse();
      let buffer: string[][] = [];
      const lines = response.split('\n');
      const labelMarker = 'MARKER';
      const labelRegion = 'REGION';
      const labelMarkerList = 'MARKER_LIST';
      const labelMarkerListEnd = 'MARKER_LIST_END';
      const labelRegionList = 'REGION_LIST';
      const labelRegionListEnd = 'REGION_LIST_END';

      for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
         const line = lines[lineIndex];

         if (!line || line == '')
            continue;

         const tokens = line.split('\t');

         let cmdType = tokens[0];

         if (cmdType === labelMarker || cmdType === labelRegion) {
            buffer.push(tokens);
            continue;
         } else if (cmdType === labelMarkerList || cmdType === labelRegionList) {
            buffer = [];
            continue;
         } else if (cmdType === labelMarkerListEnd) {
            cmdType = labelMarker;
         } else if (cmdType === labelRegionListEnd) {
            cmdType = labelRegion;
         } else {
            buffer = [tokens];
         }

         let commandToken = _.find(commandTokens, value => line.startsWith(value[0]));

         if (!!commandToken) {
            let index = commandToken[1];
            let op = commands[index];

            op.response = op.parse(buffer);
         }
      }

      return commands;
   }

}
