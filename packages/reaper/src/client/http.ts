import _ from "lodash";
import { BaseClient } from "~/client/base";
import { ICommand } from "~/commands";

// TODO: Add support for fetch API for NodeJS 18<

/**
 * @class
 */
export class HttpClient extends BaseClient {
   
   private host: string;

   /**
    * 
    * @param host URL of Reaper Web instance
    */
   public constructor(host: string = 'http://127.0.0.1:8080') {
      super();

      this.host = host;
   }

   public async fetch(...commands: ICommand[]): Promise<ICommand[]> {
      if (commands.length === 0) {
         return new Promise((accept, decline) => decline());
      }

      const args = _.map(commands, x => x.command).join(';');

      return new Promise<ICommand[]>(async (accept, decline) => {
         try {
            const response = await fetch(this.host + "/_/" + args, {
               headers: { 'Content-type': 'text/plain; charset=WINDOWS-1251' }
            });

            if (!response.ok) {
               decline('Failed to make request');
               return;
            }

            accept(this.parse(await response.text(), ...commands));
         } catch (error) {
            decline(error);
         }
      });
   }
}
