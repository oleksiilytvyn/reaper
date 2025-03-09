import _ from 'lodash';
import { Component, createSignal, For, JSX, Match, Show, Switch } from 'solid-js';
import {
   CommandType,
   getProjectExtStateCmd,
   idCmd,
   IdCommandType,
   Marker,
   markersCmd,
   PositionType,
   Region,
   regionsCmd,
   setPositionCmd,
   StateCommandResponse,
   transportCmd,
   TransportCommandResponse,
   TransportPlayState,
   HttpClient
} from 'reaper';
import { Icon } from '~/ui';
import { Button } from '~/ui/button';
import { ModeToggle } from '~/ui/mode-provider';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger
} from '~/ui/dialog'
import { Switch as SwitchUI, SwitchControl, SwitchLabel, SwitchThumb } from "~/ui/switch"
import { Slider, SliderFill, SliderLabel, SliderThumb, SliderTrack, SliderValueLabel } from "~/ui/slider"

const FONT_SIZE_INCREMENT = 0.25;
const REGIONS_UPDATE_INTERVAL = 5000;
const TRANSPORT_UPDATE_INTERVAL = 1000 / 2;
const TRANSPORT_REFRESH_RATE = 1000 / 15;

const loop = (fn: () => void, interval: () => number): NodeJS.Timer => {
   fn();

   return setInterval(fn, interval());
};

/**
 * Convert seconds to timestamp in HH:MM:SS.SS format (like 00:09:04.00)
 * */
const secondsToTimestamp = (time: number): string => {
   const hours = Math.floor(time / 3600);
   const minutes = Math.floor((time - (hours * 3600)) / 60);
   const seconds = time - (hours * 3600) - (minutes * 60);
   const h = _.padStart(hours.toString(), 2, '0');
   const m = _.padStart(minutes.toString(), 2, '0');
   const s = _.padStart(seconds.toFixed(2), 5, '0');

   return `${h}:${m}:${s}`;
}

const inRegion = (pos: number, region: { start: number, end: number }): boolean => {
   return pos >= region.start && pos < region.end;
}

interface AppMarker extends Marker {
   active: boolean;
}

interface AppRegion extends Region {
   active: boolean;
}

const App: Component = (): JSX.Element => {
   const [locked, setLocked] = createSignal(false);
   const [lyrics, setLyrics] = createSignal("no lyrics");
   const [lyrics2, setLyrics2] = createSignal("no lyrics");
   const [lyrics3, setLyrics3] = createSignal("no lyrics");
   const [regions, setRegions] = createSignal([] as AppRegion[]);
   const [markers, setMarkers] = createSignal([] as AppMarker[]);
   const [transportState, setTransportState] = createSignal(TransportPlayState.Stopped);
   const [transportPosition, setTransportPosition] = createSignal(0);
   const [showRegions, setShowRegions] = createSignal(true);
   const [showMarkers, setShowMarkers] = createSignal(true);
   const [showLyrics, setShowLyrics] = createSignal(true);
   const [fontSize, setFontSize] = createSignal(3.0);

   const reaper = new HttpClient('');
   let transportTimer = setInterval(() => 0, TRANSPORT_REFRESH_RATE);

   const update_regions = () => {
      const cmds = [];

      if (showMarkers()) {
         cmds.push(markersCmd());
      }

      if (showRegions()) {
         cmds.push(regionsCmd());
      }

      // Skip fetch if regions and markers hidden
      if (cmds.length === 0) {
         return;
      }

      reaper.fetch(...cmds)
         .then(response => {
            let position = transportPosition();

            _.each(response, x => {
               let name = x.command;

               if (name === 'REGION') {
                  setRegions(_.map(x.response, r => {
                     r.start = parseFloat(r.startPosition);
                     r.end = parseFloat(r.endPosition);
                     r.active = inRegion(position, r);

                     return r;
                  }));
               } else if (name === 'MARKER') {
                  setMarkers(_.map(x.response, m => {
                     m.start = parseFloat(m.position);
                     m.end = m.start + 1;
                     m.active = inRegion(position, m);

                     return m;
                  }))
               }
            });
         });
   };

   // Region clicked event handler
   const clickRegion = (region: Region) => {
      if (locked()) return;

      setTransportPosition(parseFloat(region.startPosition));
      // update_regions();
      reaper.fetch(setPositionCmd(PositionType.RegionId, region.id)).then(() => {
      });
   };

   // Marker clicked event handler
   const clickMarker = (marker: Marker) => {
      if (locked()) return;

      setTransportPosition(parseFloat(marker.position));
      // update_regions();
      reaper.fetch(setPositionCmd(PositionType.MarkerId, marker.id)).then(() => {
      });
   };

   // Transport clicked event handler
   const clickTransport = () => {
      if (locked()) return;

      reaper
         .fetch(idCmd(transportState() == TransportPlayState.Playing
            ? IdCommandType.TransportStop
            : IdCommandType.TransportPlay))
         .then(() => {
         });
   };

   loop(() => {
      reaper
         .fetch(
            transportCmd(),
            getProjectExtStateCmd("lyrics", "region"),
            getProjectExtStateCmd("lyrics", "lyrics"),
         )
         .then(response => {
            _.each(response, x => {
               if (x.type === CommandType.Transport) {
                  let transport = x.response as TransportCommandResponse;

                  clearInterval(transportTimer)
                  setTransportState(transport.state);
                  setTransportPosition(transport.positionSeconds);

                  if (transport.state == TransportPlayState.Playing) {
                     transportTimer = setInterval(() => {
                        setTransportPosition(x => x + TRANSPORT_REFRESH_RATE / 1000);
                     }, TRANSPORT_REFRESH_RATE)
                  }
               } else if (x.type === CommandType.State) {
                  let state = x.response as StateCommandResponse;

                  if (!state)
                     return;

                  if (state.key == 'lyrics') {
                     setLyrics(state.value == "--NO-TEXT--" ? "" : state.value);
                  } else if (state.key == 'lyrics2') {
                     setLyrics2(state.value == "--NO-TEXT--" ? "" : state.value);
                  } else if (state.key == 'lyrics3') {
                     setLyrics3(state.value == "--NO-TEXT--" ? "" : state.value);
                  }
               }
            })
         });
   }, () => transportState() == TransportPlayState.Playing ? TRANSPORT_UPDATE_INTERVAL : (TRANSPORT_UPDATE_INTERVAL * 4));

   loop(update_regions, () => transportState() == TransportPlayState.Playing ? REGIONS_UPDATE_INTERVAL : (REGIONS_UPDATE_INTERVAL * 4));

   return (
      <>
         <div class="py-2 flex justify-between justify-items-center">
            <div class="ms-3 me-auto">
               <Button onclick={() => setLocked(x => !x)} variant={locked() ? 'destructive' : 'ghost'}>
                  <Icon name={locked() ? 'lock' : 'unlock'}/>
               </Button>
            </div>
            <div
               class="w-50 flex justify-between justify-items-center items-center mx-2 rounded bg-gray-300 dark:bg-gray-800">
               <Button class="text-nowrap bg-transparent" variant="ghost" onclick={() => clickTransport()}>
                  <Switch fallback={<span class="text-muted">Unknown</span>}>
                     <Match when={transportState() == TransportPlayState.Playing}>
                        <span class="text-green-400">
                           <Icon name="play" class="me-2"/>
                           <span class="hidden lg:inline">Playing</span>
                        </span>
                     </Match>
                     <Match when={transportState() == TransportPlayState.Stopped}>
                        <span class="text-red-600">
                           <Icon name="stop" class="me-2"/>
                           <span class="hidden lg:inline">Stopped</span></span>
                     </Match>
                     <Match when={transportState() == TransportPlayState.Paused}>
                        <span class="text-yellow-500">
                           <Icon name="pause" class="me-2"/>
                           <span class="hidden lg:inline">Paused</span>
                        </span>
                     </Match>
                  </Switch>
               </Button>
               <pre
                  class="text-gray-900 dark:text-gray-200 mx-3 mx-lg-5 p-0 cursor-default">{secondsToTimestamp(transportPosition())}</pre>
            </div>
            <div class="ms-auto me-3">
               <ModeToggle/>
            </div>
            <div class="ms-0 me-3">
               <Dialog>
                  <DialogTrigger as={Button<"button">} variant="ghost">
                     <Icon name="cog"/>
                  </DialogTrigger>
                  <DialogContent class="sm:max-w-[425px]">
                     <DialogHeader>
                        <DialogTitle>Change settings</DialogTitle>
                        <DialogDescription>
                           Set how you want to see controls
                        </DialogDescription>
                     </DialogHeader>
                     <div class="grid gap-3">
                        <SwitchUI class="flex items-center space-x-2" checked={showRegions()}
                                  onClick={() => setShowRegions(y => !y)}>
                           <SwitchControl>
                              <SwitchThumb/>
                           </SwitchControl>
                           <SwitchLabel>Show Regions</SwitchLabel>
                        </SwitchUI>
                        <SwitchUI class="flex items-center space-x-2" checked={showMarkers()}
                                  onClick={() => setShowMarkers(y => !y)}>
                           <SwitchControl>
                              <SwitchThumb/>
                           </SwitchControl>
                           <SwitchLabel>Show Markers</SwitchLabel>
                        </SwitchUI>
                        <SwitchUI class="flex items-center space-x-2" checked={showLyrics()}
                                  onClick={() => setShowLyrics(y => !y)}>
                           <SwitchControl>
                              <SwitchThumb/>
                           </SwitchControl>
                           <SwitchLabel>Show Lyrics</SwitchLabel>
                        </SwitchUI>
                        <Slider
                           minValue={0.1}
                           maxValue={10}
                           defaultValue={[3]}
                           step={0.1}
                           getValueLabel={(params) => `${params.values[0]}`}
                           value={[fontSize()]}
                           onChange={(values) => setFontSize(values[0])}
                           class="w-100 space-y-3"
                        >
                           <div class="flex w-full justify-between">
                              <SliderLabel>Font size</SliderLabel>
                              <SliderValueLabel/>
                           </div>
                           <SliderTrack>
                              <SliderFill/>
                              <SliderThumb/>
                              <SliderThumb/>
                           </SliderTrack>
                        </Slider>
                     </div>
                  </DialogContent>
               </Dialog>
            </div>
         </div>
         <Show when={showLyrics}>
            <div class="text-center mb-5 text-gray-600 p-4 h-3/6 flex items-center justify-center">
               {
                  lyrics()
                     ? <span class="text-gray-900 dark:text-gray-200"
                             style={`font-size: ${fontSize()}em`}>{lyrics()}</span>
                     : <span class="text-gray-400 dark:text-gray-800 my-5">No Lyrics</span>
               }
            </div>
         </Show>
         <div class="container">
            <div class="columns-1 sm:columns-2 gap-8">
               <Show when={showRegions()}>
                  <div class="p-3 mb-3">
                     <b class="mb-3 block">Regions</b>
                     <div class="d-grid gap-2">
                        <For each={regions()} fallback={
                           <div class="text-gray-400">No regions</div>
                        }>
                           {(item: Region & { active: boolean }) =>
                              <Button
                                 variant="ghost"
                                 class="w-100 flex justify-between justify-items-center items-center"
                                 onClick={() => clickRegion(item)}>
                                 <b class="me-3">{item.id}</b>
                                 <Show when={item.name} fallback={<span>Unnamed</span>}>
                                    <span>{item.name}</span>
                                 </Show>
                                 <Icon name="circle" class="ms-auto" style={`color: ${item.color};`}/>
                                 <Show when={!locked()}>
                                    <i class="fas fa-play text-yellow-500 ms-3"></i>
                                 </Show>
                              </Button>
                           }
                        </For>
                     </div>
                  </div>
               </Show>
               <Show when={showMarkers()}>
                  <div class="p-3 mb-3">
                     <b class="mb-3 block">Markers</b>
                     <div class="grid gap-2">
                        <For each={markers()} fallback={
                           <div class="list-group-item bg-dark text-light">No markers</div>
                        }>
                           {(item: Marker & { active: boolean }) =>
                              <Button
                                 variant="ghost"
                                 class="w-100 flex justify-between justify-items-center items-center"
                                 onClick={() => clickMarker(item)}>
                                 <b class="me-3">{item.id}</b>
                                 <Show when={item.name} fallback={<span>Unnamed</span>}>
                                    <span>{item.name}</span>
                                 </Show>
                                 <Icon name="circle" class="ms-auto" style={`color: ${item.color};`}/>
                                 <Show when={!locked()}>
                                    <i class="fas fa-play text-yellow-500 ms-3"></i>
                                 </Show>
                              </Button>
                           }
                        </For>
                     </div>
                  </div>
               </Show>
            </div>
         </div>
      </>
   );
};

export default App;
