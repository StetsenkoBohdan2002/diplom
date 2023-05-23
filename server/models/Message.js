const mongoose = require('mongoose');

const socialMediaMessageSchema = new mongoose.Schema({
  id: Number,
  author: {
    name: String,
    username: String,
    followersCount: Number,
    verified: Boolean,
    metadata: {
      platform: String,
      handle: String,
      bio: String,
    },
  },
  content: {
    text: String,
    media: [
      {
        type: String,
        url: String,
        metadata: {
          altText: String,
          location: String,
          duration: Number,
          resolution: String,
        },
      },
    ],
    metadata: {
      timestamp: Date,
      likesCount: Number,
      commentsCount: Number,
    },
  },
  metadata: {
    channel: {
      name: String,
      title: String,
      description: String,
    },
    language: String,
    location: {
      country: String,
      city: String,
    },
    tags: [String],
  },
});

const SocialMediaMessage = mongoose.model('SocialMediaMessage', socialMediaMessageSchema);
