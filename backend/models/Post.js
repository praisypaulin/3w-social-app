const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true }, // denormalized for easy display
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true }, // denormalized for easy display in feed

    text: {
      type: String,
      trim: true,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
    },

    // Array of user IDs who liked this post — lets us show "who liked" and prevent double-likes
    likes: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        username: String,
      },
    ],

    comments: [commentSchema],
  },
  { timestamps: true }
);

// Enforce: at least text OR image must be present (both optional individually)
postSchema.pre('validate', function (next) {
  if (!this.text && !this.imageUrl) {
    return next(new Error('Post must contain text, an image, or both.'));
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);
