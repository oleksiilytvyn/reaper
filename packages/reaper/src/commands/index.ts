// Commands shortcuts
import {
   BeatCommand,
   GetCommandStateCommand,
   GetExtStateCommand,
   GetExtStatePersistentCommand,
   GetProjectExtStateCommand,
   IdCommand,
   LyricsCommand,
   MarkersCommand,
   OscCommand,
   PluginIdCommand,
   PositionType,
   RegionsCommand,
   SetExtStateCommand,
   SetExtStatePersistentCommand,
   SetPositionCommand,
   SetProjectExtStateCommand,
   TrackCountCommand,
   TransportCommand
} from "../commands";

export * from './command';

// Commands
export * from "./id";
export * from "./osc";
export * from "./beat";
export * from "./undo";
export * from "./track";
export * from "./state";
export * from "./lyrics";
export * from "./repeat";
export * from "./regions";
export * from "./markers";
export * from "./pluginId";
export * from "./position";
export * from "./transport";
export * from "./trackCount";

export const idCmd = (id: number) => new IdCommand(id);
export const oscCmd = (message: string, value: string) => new OscCommand(message, value);
export const beatCmd = () => new BeatCommand();
export const regionsCmd = () => new RegionsCommand();
export const markersCmd = () => new MarkersCommand();
export const pluginIdCmd = (id: string) => new PluginIdCommand(id);
export const transportCmd = () => new TransportCommand();
export const setPositionCmd = (type: PositionType, value: string) => new SetPositionCommand(type, value);
export const trackCountCmd = () => new TrackCountCommand();
export const lyricsCmd = (track: number) => new LyricsCommand(track);
export const getCommandStateCmd = (id: string) => new GetCommandStateCommand(id);
export const getExtStatePersistentCmd = (section: string, key: string) => new GetExtStatePersistentCommand(section, key);
export const setExtStatePersistentCmd = (section: string, key: string, value: string) => new SetExtStatePersistentCommand(section, key, value);
export const getExtStateCmd = (section: string, key: string) => new GetExtStateCommand(section, key);
export const setExtStateCmd = (section: string, key: string, value: string) => new SetExtStateCommand(section, key, value);
export const getProjectExtStateCmd = (section: string, key: string) => new GetProjectExtStateCommand(section, key);
export const setProjectExtStateCmd = (section: string, key: string, value: string) => new SetProjectExtStateCommand(section, key, value);
