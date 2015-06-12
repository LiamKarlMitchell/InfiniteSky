				var csvFile = '';
				var columns = [];
				switch (filename) {
					// case '005_00001.IMG':
					// csvFile = 'Exp.csv';
					// break;
					case '005_00002.IMG':
					csvFile = 'Items.csv';
					columns = ['ID','Name','Description1','Description2', 'Description3'];
					break;
					case '005_00003.IMG':
					csvFile = 'Skills.csv';
					columns = ['ID','Name','Description1','Description2', 'Description3'];
					break;
					case '005_00004.IMG':
					csvFile = 'Monsters.csv';
					columns = ['ID','Name'];
					break;
					case '005_00006.IMG':
					csvFile = 'Npcs.csv';
					columns = ['ID','Name','Chat1','Chat2','Chat3','Chat4','Chat5'];
					break;
					//case '005_00007.IMG':
					//csvFile = 'Quests.csv';
					//break;
					default:
					self.emit('loaded', filename);
					self.Loaded = true;
					return;
					break;
				}

				filepath = path.join(config.world.translation_directory || 'data',csvFile);

				fs.exists(filepath, function(exists) {
					if (!exists) {
						dumpError('Server cannot load "'+filepath+'" skipping translation csv.');
						console.log('All '+filename+' records have been processed.');
						self.emit('loaded', filename);
						self.Loaded = true;
						return;
					}
					csv
					 .fromPath(filepath, {quote: '"', escape: '\\',delimiter: ',', headers: true})
					 .on("record", function(data){
					     var record = self[data[columns[0]]];
					     if (record) {
						     for (var i=1;i<columns.length;i++) {
						     	record[columns[i]] = data[columns[i]];
						     }
					 	 } else {
					 	 	record = {};
					 	 	for (var i=0;i<columns.length;i++) {
					 	 		record[columns[i]] = data[columns[i]];
					 	 	}

					 	 	record = onRecordFunction(record);
					 	 	if (record !== undefined && record.ID) {
					 	 		self.infos[record[columns[0]]] = record;
					 	 		self[record[columns[0]]] = record;
					 	 	}
					 	 	//dumpError('Record '+data[columns[0]]+' not found in file: '+filename);
					 	 }
					 })
					 .on("end", function(){
					    self.Loaded = true;
					    console.log('All '+filename+' records have been processed.');
						self.emit('loaded', filename);
					 });
				});
