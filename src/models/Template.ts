import mongoose from 'mongoose'

// Always delete the model to avoid OverwriteModelError in dev/test
if (mongoose.models.Template) {
  delete mongoose.models.Template;
}

const templateSchema: any = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  supportedDocumentTypes: [{ type: String }],
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  isPublic: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: false },
  // ... other fields ...
}, {
  timestamps: true,
  statics: {
    findPopular: function(limit = 10) {
      return this.find({ isPublic: true, isApproved: true })
        .sort({ downloads: -1 })
        .limit(limit)
        .populate('createdBy', 'name')
    },
    findByCategory: function(category: string) {
      return this.find({
        category,
        isPublic: true,
        isApproved: true
      }).populate('createdBy', 'name')
    },
    findByDocumentType: function(documentType: string) {
      return this.find({
        $or: [
          { supportedDocumentTypes: documentType },
          { supportedDocumentTypes: { $exists: false } },
          { supportedDocumentTypes: { $size: 0 } }
        ],
        isPublic: true,
        isApproved: true
      }).populate('createdBy', 'name')
    }
  }
});

// Only add virtual if not already defined
if (templateSchema.virtuals && typeof (templateSchema.virtuals as any).averageRating === 'undefined') {
  templateSchema.virtual('averageRating').get(function(this: any) {
    return this.ratingCount && this.ratingCount > 0 ? this.rating / this.ratingCount : 0;
  });
}

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

// Pre-save middleware to validate template
templateSchema.pre('save', function(this: any, next: any) {
  // Ensure at least one document type is selected
  if (!this.supportedDocumentTypes || !Array.isArray(this.supportedDocumentTypes) || this.supportedDocumentTypes.length === 0) {
    return next(new Error('At least one document type must be selected.'));
  }
  // Auto-approve free templates with valid structure
  if (this.price === 0 && this.validation?.isValid) {
    this.isApproved = true
  }
  next()
})

const Template = mongoose.model('Template', templateSchema);

export default Template 