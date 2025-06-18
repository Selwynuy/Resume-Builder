import mongoose from 'mongoose'

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  description: { type: String, required: true }
})

const educationSchema = new mongoose.Schema({
  school: { type: String, required: true },
  degree: { type: String, required: true },
  field: { type: String },
  graduationDate: { type: String, required: true },
  gpa: { type: String }
})

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    required: true 
  }
})

const personalInfoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  summary: { type: String }
})

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    default: 'Untitled Resume'
  },
  personalInfo: {
    type: personalInfoSchema,
    required: true
  },
  experiences: [experienceSchema],
  education: [educationSchema],
  skills: [skillSchema],
  template: {
    type: String,
    default: 'classic',
    enum: ['classic', 'modern', 'minimal', 'creative']
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// Update the updatedAt field before saving
resumeSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

// Update User's resumes array when a new resume is created
resumeSchema.post('save', async function(doc) {
  try {
    const User = mongoose.models.User || mongoose.model('User')
    await User.findByIdAndUpdate(
      doc.userId,
      { $addToSet: { resumes: doc._id } },
      { new: true }
    )
  } catch (error) {
    console.error('Error updating user resumes:', error)
  }
})

export default mongoose.models.Resume || mongoose.model('Resume', resumeSchema) 