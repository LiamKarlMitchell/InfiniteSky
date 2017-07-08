# Project Layout

We have a main process.

Which loads up any processes specified in Config/processes.json

Two of interest are Login and World.

Login is the Login server and handles the obvious features of a Login Server.

World is the World Server which also spawns children processes of its own.

Zone is the Zone process which is spawned by World Server for each zone configured to load in Config/zones.json.



Packet structures are defined using Restruct mostly.
And are stored in the appropriate PacketCollection made global by Zone or World or Login servers.

VMScript is a module made by us which watches code for changes and re-loads it at runtime.
This is used to facilitate quicker development of GM Commands and Packets since we do not always have to restart the server from scratch.


The project hopes to use bunyan for logging.

Mongose and Mongodb are used for database stuff.


This project has a layout like so.

```
+---Commands
|   \---asdf
+---Config -> Where our configs are held.
+---Data -> A data directory for files still kept on disk.
|   +---navigation_mesh -> Navigation Meshes.
|   +---packets -> Packets we want to test sending with /s gm command.
|   +---spawninfo -> Spawn information of NPC and Monster.
|   +---Translation -> Translation CSV from Google Docs.
|   \---wregion -> Walkable Region files.
+---Database -> Contains our Database schemas and helper functions.
+---Documentation -> Contains our Documentation of course. Can be generated with the command ```grunt --jsdoc
+---Generic -> Generic commands/modules.
+---Grunt -> Grunt tasks are in here.
+---Helper -> Helper modules / functions.
+---Modules -> More generic Modules.
|   \---restruct -> Restruct js.
+---Processes -> Processes directory where Login, World, Zones and other processes are kept.
|   +---ItemEditor -> An Inventory Editor that works in real time for a character on a Zone.
|   +---Login -> The Login Server.
|   |   \---Packets -> Packets for the Login Server.
|   +---SpawnEdit -> Spawn Editor.
|   +---SpawnLogger -> Spawn Logger tool to help with logging spawn information.
|   +---World -> World Server.
|   |   \---Packets -> Packets for the World Server.
|   \---Zone -> The Zone Server.
|       +---Commands -> Commands for the Zone Server.
|       +---Packets -> Packets for the Zone Server.
|       \---Scripts -> Scripts for the Zone Server.
\---Tutorials -> Tutorials for Documentation.
```