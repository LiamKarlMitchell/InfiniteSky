// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

// Starting work on an email queue schema
db.mongoose.emailQueueSchema = mongoose.Schema({
  Subject: { type: String, index: true },
  To: { type: String, index: true },
  Body: String,
  Added: { type : Date, default: Date.now },
  Sent: { type : Date }
});

delete mongoose.models['emailqueue'];
db.EmailQueue = mongoose.model('emailqueue', db.mongoose.emailQueueSchema);
