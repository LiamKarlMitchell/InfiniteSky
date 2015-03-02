// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

vms.depends({
    name: 'Login Server',
    depends: [
        'Info_Exp',
        'Info_Item',
        'Info_Skill',
        'Account',
        'Character',
        'World Server',
        'Packets'
    ]
}, function(){
if (typeof(login) === 'undefined') {
    console.log('Login Server code loaded.');
    login = {
        packets: new PacketCollection('./packets/login','LoginPC'),
        start: function () {
            this.server = net.createServer(function (socket) { login.connection(socket); });
            console.log('Login server starting listen on port: '+config.ports.login);
            this.server.listen(config.ports.login);
        },
        clients: [],
        clientID: 0,
        running: true
    };
} else {
    console.log('Login Server code reloaded.');
}

login.connection = function(socket) {
    console.log("Client #" + this.clientID + " connected from IP "+_util.cleanIP(socket.remoteAddress));

     socket.clientID = this.clientID;
     this.clientID++;
     socket.authenticated = false;

     socket.characters = [];

     //Handle socket disconnection
     socket.on('end', function() {
         console.log('Client #' + socket.clientID + ' ended connection');
         login.clients.splice(login.clients.indexOf(socket), 1);
         delete login[socket.ID];
         db.Account.logoutUser(socket);
     });

     socket.on('error', function(err) {
         console.log('Client #' + socket.clientID + ' error: '+err);
         socket.destroy();
     });

     // Need to find out which functions to use and make this tidyer....
     // Need to check for memory leaks and make sure we actually delete the un needed socket.
     // Need to make sure using splice won't be slower than deleting the index.
     // Should maybe look at using room or list rather than array of socket object.
     socket.on('close', function() {
         console.log('Client #' + socket.clientID + ' closed connection');

         login.clients.splice(login.clients.indexOf(socket), 1);
         delete login[socket.ID];
         //var i = alllogin.Clients.indexOf(socket);
         //delete alllogin.Clients[i];
         db.Account.logoutUser(socket);
     });

     socket.on('disconnect', function() {
         console.log('Client #' + socket.clientID + ' disconnected');

         login.clients.splice(login.clients.indexOf(socket), 1);
         delete login[socket.ID];
         //var i = alllogin.Clients.indexOf(socket);
         //delete alllogin.Clients[i];
         // Remove from zone transfer list if its there
         db.Account.logoutUser(socket);

         try {
             login.packets.onDisconnected(socket);
         } catch (e) {
             dumpError(e);
         }
     });

     CachedBuffer.call(socket,login.packets);

     //Let client know how many people are playing on server
     try {
         login.packets.onConnected(socket);
     } catch (e) {
         dumpError(e);
     }

     login.clients.push(socket);
     login[socket.ID] = socket;
};

login.findAccountSocket = function(name) {
    for (var i=0;i<login.clients.length;i++) {
        if (login.clients[i].authenticated) {
            if (login.clients[i].ai.username === name) {
                return login.clients[i];
            }
        }
    }
    return null;
};

var loadedInfos = {
    '005_00001.IMG': infos.Exp !== undefined && infos.Exp.Loaded,
    '005_00002.IMG': infos.Item !== undefined && infos.Item.Loaded,
    '005_00003.IMG': infos.Skill !== undefined && infos.Skill.Loaded
};

var AreAllInfosLoaded = function() {
    for (var info in loadedInfos) {
        if (loadedInfos.hasOwnProperty(info)) {
            //console.log(info+' '+ ( loadedInfos[info] ? "Loaded" : "Not Loaded" ));
            if (!loadedInfos[info]) {
                return false;
            }
        }
    }
    if (typeof(db) === "undefined" || db.Account === undefined) {
        console.log("db.Account is not loaded");
        return false;
    }
    if (typeof(db) === "undefined" || db.Character === undefined) {
        console.log("db.Character is not loaded");
        return false;
    }
    return true;
};

login.findAccountSocket = function(name) {
    for (var i=0;i<login.clients.length;i++) {
        if (login.clients[i].authenticated) {
            if (login.clients[i].ai.username === name) {
                return login.clients[i];
            }
        }
    }
    return null;
};
if (login.start) {
    login.start();
    delete login.start;
}
// if (login.start) {
//     if (AreAllInfosLoaded()) {
//         // Accept connections?
//         login.start();
//         delete login.start;
//     } else if (login.waiting_on_game_info === undefined) {
//         login.waiting_on_game_info = 1;

//         var infoWaitEvent = function (what) {
//             switch (what) {
//                 case '005_00001.IMG': loadedInfos['005_00001.IMG'] =  infos.Exp !== undefined && infos.Exp.Loaded; break;
//                 case '005_00002.IMG': loadedInfos['005_00002.IMG'] =  infos.Item !== undefined && infos.Item.Loaded; break;
//                 case '005_00003.IMG': loadedInfos['005_00003.IMG'] = infos.Skill !== undefined && infos.Skill.Loaded; break;
//             }

//             if (AreAllInfosLoaded()) {
//                 console.log('All info the Login Server needs is loaded.');
//                 // Accept connections?
//                 if (login.start) {
//                     login.start();
//                     delete login.start;
//                 }
//                 main.events.removeListener('gameinfo_loaded',infoWaitEvent);
//             }
//         };

//         main.events.once('db_accounts_schema_loaded', infoWaitEvent);
//         main.events.once('db_character_schema_loaded', infoWaitEvent);

//         main.events.on('gameinfo_loaded', infoWaitEvent);
//     }
// }

});
