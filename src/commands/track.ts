import { Command, CommandType } from "./command";

/**
 * Requests information about all tracks, a single track, or a range of tracks.
 * Note that the indices used are 0 for master, 1 for first user track, etc.
 *
 * @class
 */
export class TrackCommand extends Command<TrackResponse[]> {

   public type: CommandType = CommandType.Track;
   public selection: TrackSelectionType;
   public index: number;
   public end: number | undefined;

   public constructor(type: TrackSelectionType, index: number, end?: number) {
      let cmd = 'TRACK';

      // `TRACK`, `TRACK/<index>`, `TRACK/<start>-<end>`
      super(cmd, cmd);

      this.end = end;
      this.index = index;
      this.selection = type;
   }

   public parse(tokens: string[][]): TrackResponse[] {
      // TODO: Implement this
      // Returns any number of track lines:
      // TRACK tracknumber trackname trackflags volume pan last_meter_peak last_meter_pos width/pan2 panmode sendcnt recvcnt hwoutcnt color

      return [];
   }
}

export enum TrackSelectionType {
   All = 0,
   Index = 1,
   Range = 2
}

export type TrackResponse = {
// `tracknumber` is 0 for master, 1 for first track, etc.
// `trackname` is the name of the track, or MASTER
// `trackflags` includes various bits (test with parseInt(field)&1 etc):
//   - 1: folder
//   - 2: selected
//   - 4: has FX
//   - 8: muted
//   - 16: soloed (32: solo-in-place)
//   - 64: record armed
//   - 128: record monitoring on
//   - 256: record monitoring auto
// `volume` is track volume, where 0 is -inf, 1 is +0dB, etc. see mkvolstr for dB conversions
// `pan` is -1..1, where -1 is full left, 0 is centered, 1 is full right
// `last_meter_peak` and last_meter_pos are integers that are dB*10, so -100 would be -10dB.
// `color` is in the form of 0xaarrggbb, nonzero if a custom color set
   number: number,
   name: string,
   flags: string,
   volume: string,
   pan: number,
   last_meter_peak: string,
   color: string
};

// TODO Implement track command

// #### GET/TRACK/x/SEND/y
//
// Gets state for track x hardware output/send y. Returns a line:
//
//    ```SEND \t x \t y \t flags \t volume \t pan \t other_track_index```
//
// Use y=-1 for first receive, -2 for second, etc.
//
//    other_track_index is -1 if hardware output
//
// flags & 8 is true if send/output muted

// #### GET/TRACK/index/xxxxxx
//
// Requests information for track "index", via GetSetMediaTrackInfo(). See the REAPER API documentation for which
//     strings are acceptable, but for example you can query the track record input index for the first track via:

// #### GET/TRACK/1/I_RECINPUT
//
// The returned string will be:
//
//    ```GET/TRACK/1/I_RECINPUT\t <index>```
//
//    (if an error occurs you may get nothing back at all, or you might get the GET string back but with no parameter)
//
// String will have newlines/tabs/backslashes encoded as \\n, \\t and \\.

// #### SET/TRACK/index/xxxxx/value
//
// Similar to GET/TRACK/index/xxxxx, but sets the value of this item. You probably will want to follow this with a SET/UNDO command, below. This will not give any response.

// #### SET/TRACK/index/VOL/value
//
// Special case of SET/TRACK/index/xxxx, sets volume for a track via control surface API (meaning it respects automation modes etc). If value starts with + or -, then adjustment is relative (in dB), otherwise adjustment is absolute (1=0dB, etc). If value ends in "g", then ganging is ignored. Does not need SET/UNDO.

// #### SET/TRACK/index/PAN/value
//
// Special case of SET/TRACK/index/xxxx, sets pan for a track via control surface API. If value starts with + or -, adjustment is relative. Range is always -1..1. If value ends in "g", then ganging is ignored. Does not need SET/UNDO.

// #### SET/TRACK/index/WIDTH/value
//
// Special case of SET/TRACK/index/xxxx, sets width for a track via control surface API. If value starts with + or -, adjustment is relative. Range is always -1..1. If value ends in "g", then ganging is ignored. Does not need SET/UNDO.

// #### SET/TRACK/index/MUTE/value
//
// Special case of SET/TRACK/index/xxxx, sets mute for track. if value is <0, mute is toggled. Does not need SET/UNDO.
//
// #### SET/TRACK/index/SOLO/value
//
// Special case of SET/TRACK/index/xxxx, sets solo for track. if value is <0, solo is toggled. Does not need SET/UNDO.
//
// #### SET/TRACK/index/FX/value
//
// Special case of SET/TRACK/index/xxxx, sets fx enabled for track. if value is <0, fx enabled is toggled. Does not need SET/UNDO.
//
// #### SET/TRACK/index/RECARM/value
//
// Special case of SET/TRACK/index/xxxx, sets record arm enabled for track. if value is <0, record arm enabled is toggled. Does not need SET/UNDO.
//
// #### SET/TRACK/index/RECMON/value
//
// Special case of SET/TRACK/index/xxxx, sets record monitoring for track. if value is <0, record monitoring is cycled, otherwise 1=on, 2=auto. Does not need SET/UNDO.
//
// #### SET/TRACK/index/SEL/value
//
// Special case of SET/TRACK/index/xxxx, sets selection for track. if value is <0, selection is toggled. Does not need SET/UNDO.
//
// ### SET/TRACK/x/SEND/y/MUTE/value
//
// Sets hardware output/send mute for track x, send y. value can be -1 to toggle.
//
//    Use y=-1 for first receive, -2 for second, etc.
//
//     ### SET/TRACK/x/SEND/y/VOL/value
//
// Sets hardware output/send volume (1.0 = +0dB) for track x, send y. append e to value to treat as "end" (capture), or "E" to treat as an instant edit.
//
//    Use y=-1 for first receive, -2 for second, etc.
//
//     ### SET/TRACK/x/SEND/y/PAN/value
//
// Sets hardware output/send pan (0=center, -1=left) for track x, send y. append e to value to treat as "end" (capture), or "E" to treat as an instant edit.
//
//    Use y=-1 for first receive, -2 for second, etc.
//