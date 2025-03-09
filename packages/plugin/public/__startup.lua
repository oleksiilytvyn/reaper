-- Launch plugin at Reaper start

local plugin_cmd = '_RSb56cec56f538c207b315b66ee544526bce829180'
reaper.Main_OnCommand(reaper.NamedCommandLookup(plugin_cmd), 0)
