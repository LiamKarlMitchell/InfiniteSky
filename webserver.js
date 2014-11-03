// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder
vms.depends({
    name: 'Web Server',
    depends: ['World Server','Login Server']
}, function() {
    if(typeof(web) === 'undefined') {
        console.log('Loading Express');
        express = require('express');
        web = express();
        web_server = web.listen(config.web_server_port || 80, function() {
            console.log('Web Server Listening on port %d', web_server.address().port);
        });
    
        web.use(express.static(path.join(config.web_server_dir || "public")));
    } else {
        console.log('Express code reloaded');
    }


    web.handle_info = function(req, res){
        var info = {
            version: 'v'+_util.package.version+' - '+_util.package.version_name,
            online_count: login.clients.length + world.clients.length,
            // Just testing outputing quad tree info from zone1 here.
            zone1QuadTreeTest: zones[1].QuadTree.query({}).map(function(x){ 
                var info = { x: x.node.x, y: x.node.y, type: x.node.type, node: x.node.id };
                switch (x.node.type) {
                    case 'client':
                        info.Name = x.object.character.Name;
                    break;
                    case 'npc':
                        var npcinfo = infos.Npc[x.object.ID];
                        info.ID = npcinfo.ID;
                        info.Name = npcinfo.Name;
                    break;
                };
                return info;
             })
        }
        res.send(info);
    };

    web.handle_api = function(req, res){
        res.send('API is running see documentation for how to use.');
    };

    web.get('/info', function(req,res){return web.handle_info(req,res);});
    web.get('/api', function(req,res){return web.handle_api(req,res);});
    
});
