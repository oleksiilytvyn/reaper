/**
 * Nodes and Chunk types
 */
export enum NodeType {
   Act = 'ACT',
   Arm = 'ARM',
   AutoMode = 'AUTOMODE',
   AutoMute = 'AUTOMUTE',
   AutoXFade = 'AUTOXFADE',
   AuxRECV = 'AUXRECV',
   BusComp = 'BUSCOMP',
   Bypass = 'BYPASS',
   ChannelMode = 'CHANMODE',
   Cursor = 'CURSOR',
   DEFShape = 'DEFSHAPE',
   Docked = 'DOCKED',
   EventAttach = 'ENVATTACH',
   FadeIn = 'FADEIN',
   FadeOut = 'FADEOUT',
   Feedback = 'FEEDBACK',
   File = 'FILE',
   Framerate = 'FRAMERATE',
   Fx = 'FX',
   FxChain = 'FXCHAIN', // chunk
   Grid = 'GRID',
   GroupOverride = 'GROUPOVERRIDE',
   IPhase = 'IPHASE',
   ISBus = 'ISBUS',
   Item = 'ITEM', // chunk
   JS = 'JS', // chunk
   LastSelected = 'LASTSEL',
   Length = 'LENGTH',
   Loop = 'LOOP',
   LoopGRAN = 'LOOPGRAN',
   MainSend = 'MAINSEND',
   Marker = 'MARKER',
   MasterFxList = 'MASTERFXLIST', // chunk
   MasterHWOut = 'MASTERHWOUT',
   MasterMuteSolo = 'MASTERMUTESOLO',
   MasterPanEnv = 'MASTERPANENV', // chunk
   MasterPanAutomation = 'MASTERPANENV2', // chunk
   MasterPlaySpeedEnv = 'MASTERPLAYSPEEDENV', // chunk
   MasterTrackHeight = 'MASTERTRACKHEIGHT',
   MasterTrackView = 'MASTERTRACKVIEW',
   MasterVolumeEnv = 'MASTERVOLENV', // chunk
   MasterVolumeAutomation = 'MASTERVOLENV2', // chunk
   MasterAutoMode = 'MASTERAUTOMODE',
   MasterPeakCol = 'MASTERPEAKCOL',
   MaxProjectLength = 'MAXPROJLEN',
   MidiOut = 'MIDIOUT',
   MixerUIFlags = 'MIXERUIFLAGS',
   Metronome = 'METRONOME',
   Mute = 'MUTE',
   MuteSolo = 'MUTESOLO',
   Name = 'NAME',
   Channels = 'NCHAN',
   Notes = 'NOTES', // chunk
   PanAutomation = 'PANENV2', // chunk
   PANLAW = 'PANLAW',
   PeakGain = 'PEAKGAIN',
   PlayRate = 'PLAYRATE',
   Position = 'POSITION',
   PT = 'PT',
   Project = 'REAPER_PROJECT', // chunk
   PluginAutomation = 'PARMENV',
   REC = 'REC',
   RecordMode = 'RECMODE',
   RecordConfig = 'RECORD_CFG', // chunk
   RenderConfig = 'RENDER_CFG', // chunk
   ReceiveVolumeAutomation = 'AUXVOLENV',
   Ripple = 'RIPPLE',
   SampleRate = 'SAMPLERATE',
   SEL = 'SEL',
   Selection = 'SELECTION',
   Send = 'SEND',
   Show = 'SHOW',
   ShowInMix = 'SHOWINMIX',
   Snapoffs = 'SNAPOFFS',
   Soffs = 'SOFFS',
   Source = 'SOURCE', // chunk
   StartTime = 'STARTTIME',
   Take = 'TAKE',
   TakeVolumePan = 'TAKEVOLPAN',
   Temp = 'TEMPO',
   TempoEnvelope = 'TEMPOENVNEW', // chunk
   TempoEnvelopeLockMode = 'TEMPOENVLOCKMODE',
   TempoAutomation = 'TEMPOENVEX',
   TimeMode = 'TIMEMODE',
   Track = 'TRACK', // chunk
   TrackHeight = 'TRACKHEIGHT',
   UserData = 'USERDATA',
   VIS = 'VIS',
   VolumePan = 'VOLPAN',
   Vst = 'VST', // chunk
   VZOOMEX = 'VZOOMEX',
   Window = 'WNDRECT',
   WidthAutomation = 'WIDTHENV2',
   Zoom = 'ZOOM',
   TakesAll = 'ALLTAKES',
   ApplyFxConfig = 'APPLYFX_CFG', // chunk
   Beat = 'BEAT',
   BeatLength = 'BEATLEN',
   CCINTERP = 'CCINTERP',
   ConfigEdit = 'CFGEDIT',
   ConfigEditView = 'CFGEDITVIEW',
   DEFPitchMode = 'DEFPITCHMODE',
   E = 'E',
   EGuid = 'EGUID',
   EventFilter = 'EVTFILTER',
   Extensions = 'EXTENSIONS', // chunk
   FixedLanes = 'FIXEDLANES',
   Frequency = 'FREQ',
   Guid = 'GUID',
   HasData = 'HASDATA',
   IGNTEMPO = 'IGNTEMPO',
   IGuid = 'IGUID',
   IID = 'IID',
   INQ = 'INQ',
   ItemMix = 'ITEMMIX',
   KeySnap = 'KEYSNAP',
   LaneHeight = 'LANEHEIGHT',
   Lock = 'LOCK',
   MULT = 'MULT',
   PANENV2 = 'PANENV2', // chunk
   PanLawFlags = 'PANLAWFLAGS',
   PanMode = 'PANMODE',
   Pattern = 'PATTERN',
   PatternString = 'PATTERNSTR',
   PeakCOL = 'PEAKCOL',
   PERF = 'PERF',
   Playoffs = 'PLAYOFFS',
   PooledEventsAttach = 'POOLEDENVATTACH',
   PooledEvents = 'POOLEDEVTS',
   PROJBAY = 'PROJBAY', // chunk
   PROJOFFS = 'PROJOFFS',
   Samples = 'SAMPLES',
   SMPTESync = 'SMPTESYNC',
   SPLDef = 'SPLDEF',
   SPLIgnore = 'SPLIGNORE',
   SourceColor = 'SRCCOLOR',
   TakeLane = 'TAKELANE',
   TimeLockMode = 'TIMELOCKMODE',
   TrackID = 'TRACKID',
   TRACKSEL = 'TRACKSEL',
   VELLANE = 'VELLANE',
   Volume = 'VOL',
   VU = 'VU',

   Default = 'NODE'
}
