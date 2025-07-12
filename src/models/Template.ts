import mongoose from 'mongoose'

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Template name is required'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, 'Template description is required'],
    trim: true,
    maxlength: 500
  },
  category: {
    type: String,
    required: true,
    enum: ['professional', 'creative', 'modern', 'minimal', 'academic'],
    default: 'professional'
  },
  price: {
    type: Number,
    min: 0,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  creatorName: {
    type: String,
    required: true
  },
  htmlTemplate: {
    type: String,
    required: [true, 'Template HTML is required']
  },
  cssStyles: {
    type: String,
    default: ''
  },
  placeholders: [{
    type: String,
    required: true
  }],
  layout: {
    type: String,
    enum: ['single-column', 'two-column', 'modern', 'creative', 'custom'],
    default: 'single-column'
  },
  previewImage: {
    type: String, // URL to preview image
    default: null
  },
  downloads: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isApproved: {
    type: Boolean,
    default: false // Templates need approval before public visibility
  },
  isPremium: {
    type: Boolean,
    default: false // Premium templates require paid subscription
  },
  tags: [{
    type: String,
    trim: true
  }],
  // Template validation status
  validation: {
    isValid: {
      type: Boolean,
      default: false
    },
    requiredMissing: [String],
    optionalMissing: [String],
    errors: [String]
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
})

// Indexes for better query performance
templateSchema.index({ category: 1, isPublic: 1, isApproved: 1 })
templateSchema.index({ createdBy: 1 })
templateSchema.index({ downloads: -1 })
templateSchema.index({ rating: -1 })
templateSchema.index({ createdAt: -1 })

// Text search index
templateSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text'
})

// Virtual for average rating calculation
templateSchema.virtual('averageRating').get(function() {
  return this.ratingCount && this.ratingCount > 0 ? this.rating / this.ratingCount : 0
})

// Instance method to increment downloads
templateSchema.methods.incrementDownloads = function() {
  this.downloads += 1
  return this.save()
}

// Instance method to add rating
templateSchema.methods.addRating = function(rating: number) {
  const newTotal = (this.rating * this.ratingCount) + rating
  this.ratingCount += 1
  this.rating = newTotal / this.ratingCount
  return this.save()
}

// Static method to find popular templates
templateSchema.statics.findPopular = function(limit = 10) {
  return this.find({ isPublic: true, isApproved: true })
    .sort({ downloads: -1 })
    .limit(limit)
    .populate('createdBy', 'name')
}

// Static method to find by category
templateSchema.statics.findByCategory = function(category: string) {
  return this.find({ 
    category, 
    isPublic: true, 
    isApproved: true 
  }).populate('createdBy', 'name')
}

// Pre-save middleware to validate template
templateSchema.pre('save', function(next) {
  // Auto-approve free templates with valid structure
  if (this.price === 0 && this.validation?.isValid) {
    this.isApproved = true
  }
  
  next()
})

// Clear any existing model from cache to ensure fresh schema
if (mongoose.models.Template) {
  delete mongoose.models.Template
}

const Template = mongoose.model('Template', templateSchema)

export default Template 