import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: 1000
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  helpful: {
    count: {
      type: Number,
      default: 0
    },
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  }
}, {
  timestamps: true
})

// Compound index to prevent duplicate reviews from same user for same template
reviewSchema.index({ templateId: 1, userId: 1 }, { unique: true })

// Index for efficient queries
reviewSchema.index({ templateId: 1, createdAt: -1 })
reviewSchema.index({ rating: -1 })

// Static method to calculate average rating for a template
reviewSchema.statics.calculateTemplateRating = async function(templateId: string) {
  const Template = mongoose.model('Template')
  
  const stats = await this.aggregate([
    { $match: { templateId: new mongoose.Types.ObjectId(templateId) } },
    {
      $group: {
        _id: '$templateId',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ])

  if (stats.length > 0) {
    await Template.findByIdAndUpdate(templateId, {
      rating: Math.round(stats[0].averageRating * 10) / 10, // Round to 1 decimal
      ratingCount: stats[0].totalReviews
    })
  } else {
    await Template.findByIdAndUpdate(templateId, {
      rating: 0,
      ratingCount: 0
    })
  }
}

// Post save middleware to update template rating
reviewSchema.post('save', function() {
  // @ts-expect-error - Mongoose schema definition
  this.constructor.calculateTemplateRating(this.templateId)
})

// Post remove middleware to update template rating
reviewSchema.post('deleteOne', function() {
  // @ts-expect-error - Mongoose schema definition
  this.constructor.calculateTemplateRating(this.templateId)
})

reviewSchema.post('findOneAndDelete', function() {
  // @ts-expect-error - Mongoose schema definition
  this.constructor.calculateTemplateRating(this.templateId)
})

// @ts-expect-error - Mongoose schema definition
reviewSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// @ts-expect-error - Mongoose schema definition
reviewSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc: any, ret: any) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// @ts-expect-error - Mongoose schema definition
reviewSchema.set('toObject', {
  virtuals: true,
  transform: function(doc: any, ret: any) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema)

export default Review 