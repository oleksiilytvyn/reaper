import { Command, CommandType } from "./command";
import { unescapeString } from "../utils";
import _ from 'lodash';

class StateCommand extends Command<StateCommandResponse> {

   public type: CommandType = CommandType.State;

   public key: string;
   public read: boolean;
   public value: string;
   public section: string;
   public endpoint: string;

   public constructor(read: boolean, endpoint: string, section: string, key: string, value: string = '') {
      let encode = encodeURIComponent;
      let cmd = `${!read ? 'SET' : 'GET'}/${endpoint}/${encode(section)}/${encode(key)}${!read ? '/' + encode(value) : ''}`;
      let token = `${endpoint}\t${encode(section)}\t${encode(key)}`;

      super(cmd, token);

      this.key = key;
      this.read = read;
      this.value = value;
      this.section = section;
      this.endpoint = endpoint;
   }

   public parse(tokens: string[][]): StateCommandResponse {
      // String will have newlines/tabs/backslashes encoded as \\n, \\t and \\. Length is limited to around 16k.
      let valid = tokens.length > 0 && tokens[0].length > 0;

      return {
         section: valid ? tokens[0][1] : '',
         key: valid ? tokens[0][2] : '',
         value: valid ? unescapeString(tokens[0][3]) : ''
      };
   }
}

export type StateCommandResponse = {
   section: string;
   key: string;
   value: string;
};

/**
 * Set project ext state
 *
 * @class
 **/
export class SetProjectExtStateCommand extends StateCommand {
   public constructor(section: string, key: string, value: string) {
      super(false, 'PROJEXTSTATE', section, key, value);
   }
}

/**
 * Set project ext state
 *
 * @class
 **/
export class GetProjectExtStateCommand extends StateCommand {
   public constructor(section: string, key: string) {
      super(true, 'PROJEXTSTATE', section, key);
   }
}

/**
 * Set ext state
 *
 * @class
 **/
export class SetExtStateCommand extends StateCommand {
   public constructor(section: string, key: string, value: string) {
      super(false, 'EXTSTATE', section, key, value);
   }
}

/**
 * Set ext state
 *
 * @class
 **/
export class GetExtStateCommand extends StateCommand {
   public constructor(section: string, key: string) {
      super(true, 'EXTSTATE', section, key);
   }
}

/**
 * Set ext state
 *
 * @class
 **/
export class SetExtStatePersistentCommand extends StateCommand {
   public constructor(section: string, key: string, value: string) {
      super(false, 'EXTSTATEPERSIST', section, key, value);
   }
}

/**
 * Set ext state
 *
 * @class
 **/
export class GetExtStatePersistentCommand extends StateCommand {
   public constructor(section: string, key: string) {
      super(true, 'EXTSTATEPERSIST', section, key);
   }
}

/**
 * Get command state
 * @class
 */
export class GetCommandStateCommand extends Command<GetCommandStateResponse> {
   public id: string;

   public constructor(id: string) {
      // TODO: Validate ID /[a-z0-9_]+/
      super(`GET/${id}`, 'CMDSTATE');

      this.id = id;
   }

   public parse(tokens: string[][]): GetCommandStateResponse {
      // TODO:
      let cmd = _.find(tokens, x => x.length > 0 && x[0][1] == this.id);
      let state = cmd ? parseInt(cmd[1]) : 0;

      if (state > 1)
         state = 1;

      return { command: this.id, state: cmd ? state as CommandState : CommandState.No };
   }
}

export enum CommandState {
   No = -1,
   On = 1,
   Off = 0
}

export type GetCommandStateResponse = {
   command: string,
   state: CommandState
};
