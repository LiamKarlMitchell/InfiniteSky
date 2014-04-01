// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

db.guildSchema = mongoose.Schema({
  Name: { type: String, unique: true, index: true },
  Master: String,
  Level: {type: Number, default: 0},
  //Storage: [Mixed],
  //Members: [String],
  hasGuildEmblem: { type: Boolean, default: 0 }
});

delete mongoose.models['guilds'];
db.Guild = mongoose.model('guilds', db.guildSchema);
