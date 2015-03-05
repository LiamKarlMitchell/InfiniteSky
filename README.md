InfiniteSky
=========

[![Join the chat at https://gitter.im/LiamKarlMitchell/InfiniteSky](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/LiamKarlMitchell/InfiniteSky?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

InfiniteSky is an open-source project, emulating a Twelve Sky Server. It is written in Node.JS

  - We have reloadable code. This means less need to reset the server when developing.
  - Currently the world server part is being re-intergrated into the code base.
  - Zone features are being implemented.
  - Code will under go cleaning and documentation..

Version
----

1.0.05 - Tomato Soup

Tech
-----------

InfiniteSky uses a number of open source projects to work properly:

* [hexy] - hexdump, binary pretty-printing
* [async] - Higher-order functions and common patterns for asynchronous code
* [jshint] - Static analysis tool for JavaScript
* [socket] - Socket is a connect clone for simple socket based applicationsad
* [netmask] - Parse and lookup IP network blocks
* [node.js] - evented I/O for the backend
* [mongodb] - A NoSQL DB that is awesome
* [mongoose] - Mongoose MongoDB ODM
* [vmscript] - Scripts that reload when changed and run in a node vm [@LiamKarlMitchell]
* [socket.io] - a super fast port of Markdown to JavaScript apps
* [restruct.js] A JavaScript binary data library. [@rfw]

If you need a runtime debuger, I would suggest node-inspector
Example usage: npm install node-inspector -g
node-debug main

Installation
--------------

[Video Guide](http://youtu.be/WH32P1i5DrQ)
I will make another video when I can as this one has poor quality.

To setup with git check see [Git Setup](https://github.com/LiamKarlMitchell/InfiniteSky/blob/master/docs/gitsetup.md)

## Install Node.js & MongoDB
*If you have not already*
Currently using Node.js v0.10.26

Don't use the one from apt-get on linux, I have had experiences with it being quite out of date.

See the following links:
* [Node.JS](http://nodejs.org)
* [MongoDB](http://www.mongodb.org)

Some assumptions are that you know how to do basic file management and use the command prompt or terminal. As well as download and install files.
We suggest setting up your code somewhere like c:\node\projects and check out Infinite Sky using a GIT client.

Server is currently untested on linux. I have been running it on Windows 7
```
sh
git clone [git-repo-url] InfiniteSky
cd InfiniteSky
npm install
mkdir data
mkdir data/infos
mkdir data/packets
mkdir data/spawninfo
mkdir data/world
```

or maybe ```mkdir -p data/world data/infos data/packets data/spawninfo data/world```

To setup mongodb what I did was create a data directory in the mongo db directory. Then I make a bat script like this
```
title Mongodb
cls
bin\mongod.exe --dbpath "data"
```

or you could use sh script like this on linux
```
./bin/mongod --dbpath "./data"
```

By running that script you can easily start the database server for InfiniteSky.

You will also need to create the ts1 db collection and user.
To do that run mongo or cd bin then type ./mongo if your on linux.
Then type in the following commands.
```
use ts1
db.createCollection("ts1")
db.createUser({user: "ts1", pwd: "ts1", roles: ["readWrite"]})
```

## Copy game files to data directorys you made

for more information on these see [Directory Documentation](https://github.com/LiamKarlMitchell/InfiniteSky/blob/master/docs/directorys.md)

data/infos:
* G03_GDATA/D01_GIMAGE2D/005/*.IMG

data/world:
* G03_GDATA/D07_GWORLD/*.WM
* G03_GDATA/D07_GWORLD/*.WREGION
*
## Configure. Instructions in
copy the config.json-dist file and rename it to config.json and edit it accordingly

```cp config.json-dist config.json```

For more info see [Config Documentation](https://github.com/LiamKarlMitchell/InfiniteSky/blob/master/docs/config.md)

Replace the following in the config
"PUT YOUR INTERNAL IP HERE" with your ip address you can find it by doing ipconfig and looking at your interfaces ip.
"PUT YOUR NETWORK MASK HERE" Your nemask in cider notation. For example "10.1.1.0/24" is 255.255.255.0
"PUT YOUR EXTERNAL IP HERE" Get your external ip by googling what is my ip and putting the result in here. This is required for other people to connect to your server. Otherwise use your internal IP if running on lan.

## Configure Plugins. Instructions in following README.md files

* plugins/dropbox/README.md
* plugins/github/README.md
* plugins/googledrive/README.md

```sh
node app
```

## Documentation
Main Documentation in docs/index.html
[Restruct Documentation](https://github.com/LiamKarlMitchell/InfiniteSky/blob/master/docs/gitsetup.md)
[Scripting Documentation](https://github.com/LiamKarlMitchell/InfiniteSky/blob/master/docs/scripting.md)

## Game Launcher and TSX Client DLL

Compile the launcher and dll and package them together.
The PrivateServer.ini should look like this
```ini
[PrivateServer]
BypassGameGuard = 1
MultiClient = 1
ChangeIP = 1
ServerIP = 127.0.0.1
HookFileLoading = 1
DevButtons = 1
```

## Create Game Accounts
You will want to create some game accounts too use.
To make a GM account use
````
/createaccount Name Password 100
````

The 100 us the level.

Try also /help for other commands.
If you want information on game info try infos.Item[1].Name or other attributes.

## Notes

The server will take a while to start, be patient.

## Style Guide
We should style our code like so [Idiomatic.js Style Guide](https://github.com/rwldrn/idiomatic.js),
there are places where we may not have written code this way in existing code. I recommend you fix these in existing code or in the case of a pull request tell the author to fix it up.

##Recommended sublime plug-ins:
Coming Soon


License
----

GNU GPL see LICENSE file

**Enjoy!**
