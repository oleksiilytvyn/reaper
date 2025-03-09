-- Plugin that reads lyrics and adds them to Reaper state that can be accessed via HTTP JS client
-- Author: Oleksii Lytvyn

local LYRICS_ARG = "lyrics"
local LYRICS_2_ARG = "lyrics2"
local LYRICS_3_ARG = "lyrics3"
local EMPTY = "--NO-TEXT--"
local STATE_NAMESPACE = "plugin"
lyrics_track = nil
notes = nil
notes2nd = nil
notes3rd = nil

-- Set project state
function SetState(name, value)
  if value == "" or value == nil then
    value = EMPTY
  end

  reaper.SetProjExtState( 0, STATE_NAMESPACE, name, value )
end

-- Set ToolBar Button State
function SetButtonState( set )
  if not set then set = 0 end

  local is_new_value, filename, sec, cmd, mode, resolution, val = reaper.get_action_context()
  local state = reaper.GetToggleCommandStateEx( sec, cmd )

  reaper.SetToggleCommandState( sec, cmd, set ) -- Set ON
  reaper.RefreshToolbar2( sec, cmd )
end


-- Clear state
function Exit()
  SetState( LYRICS_ARG, "" )
  SetState( LYRICS_2_ARG, "" )
  SetState( LYRICS_3_ARG, "" )
  SetButtonState()
end


-- Get track with lyrics
function GetLyricsTrack()
  lyrics_track = nil
  count_tracks = reaper.CountTracks()

  for i = 0, count_tracks - 1 do
    track = reaper.GetTrack(0,i)
    retval, track_name = reaper.GetTrackName( track )

    if track_name:lower() == "lyrics" then
      lyrics_track = track
      break
    end
  end
end

-- Main Function (which loop in background)
function main()

  -- Get play or edit cursor
  if reaper.GetPlayState() > 0 then
    cur_pos = reaper.GetPlayPosition()
  else
    cur_pos = reaper.GetCursorPosition()
  end

  -- Lyrics
  if reaper.ValidatePtr(lyrics_track, 'MediaTrack*') then
    track_items = reaper.GetTrackNumMediaItems( lyrics_track )
    no_item = true

    -- Loop over all items in lyrics track
    for i = 0, track_items - 1 do
      item = reaper.GetTrackMediaItem( lyrics_track, i )
      item_pos = reaper.GetMediaItemInfo_Value( item, "D_POSITION" )

      if item_pos < cur_pos then -- if item is after cursor then ignore
        item_len = reaper.GetMediaItemInfo_Value( item, "D_LENGTH" )

        if item_pos + item_len > cur_pos then -- if item end is after cursor, then item is under cursor
          item_notes_val, item_notes = reaper.GetSetMediaItemInfo_String( item, "P_NOTES", "", false )
          no_item = false

          -- Get lyrics for next item
          if i + 1 < track_items - 1 then
            item2nd = reaper.GetTrackMediaItem( lyrics_track, i + 1 )
            item_notes_val, item_notes2nd = reaper.GetSetMediaItemInfo_String( item2nd, "P_NOTES", "", false )
          end

          -- Get lyrics for 3rd item
          if i + 2 < track_items - 1 then
            item3rd = reaper.GetTrackMediaItem( lyrics_track, i + 2 )
            item_notes_val, item_notes3rd = reaper.GetSetMediaItemInfo_String( item3rd, "P_NOTES", "", false )
          end

          -- Refresh state only if lyrics changed
          if item_notes2nd ~= notes2nd then
            notes2nd = item_notes2nd
            SetState( LYRICS_2_ARG, notes2nd )
          end

          if item_notes3rd ~= notes3rd then
            notes3rd = item_notes3rd
            SetState( LYRICS_3_ARG, notes3rd )
          end

          if item_notes ~= notes then
            notes = item_notes
            SetState( LYRICS_ARG, notes )
          end
        end
      end
    end

    if no_item then
      notes = nil
      SetState( LYRICS_ARG, notes )
    end

  else -- If lyrics track invalid try to get it again
    GetLyricsTrack()
  end

  -- Re-execute loop function
  reaper.defer( main )
end


-- Global logic
GetLyricsTrack()

if not lyrics_track then
  reaper.MB('No tracks named "Lyrics".', "Error", 0)
end

SetButtonState( 1 )
main()
reaper.atexit( Exit )
