// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder
var Mixed = db.mongoose.Schema.Types.Mixed;

db.guildSchema = mongoose.Schema({
  Name: { type: String, unique: true, index: true },
  Level: {type: Number, default: 0},
  hasGuildEmblem: { type: Boolean, default: 0 },
  Members: [Mixed]
});

delete mongoose.models['guilds'];
db.Guild = mongoose.model('guilds', db.guildSchema);