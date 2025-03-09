# Reaper lyrics example

This script consists of two parts:
- lua script - this will allow you to see current lyrics
- web page - this part will communicate with Reaper

## Instructions:

1. Copy lyrics.lua and __startup.lua to Reaper Plugins folder
2. Copy lyrics.html and "lyrics" folder to Reaper Web pages
3. Setup Reaper Web page Options -> Settings -> Control/OSC/Web
- Click on Add button
- Under "Control Surface Mode" select "Web browser interface"
- Under default interface select lyrics
- If there is no such options, click on "User Pages..." and copy "lyrics.html" and "lyrics" folder into this location
- Navigate to web page that displays in "Access URL" field
- Execute lyrics.lua plugin