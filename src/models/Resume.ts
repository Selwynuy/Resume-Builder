import mongoose from 'mongoose'

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: false },
  position: { type: String, required: false },
  startDate: { type: String, required: false },
  endDate: { type: String, required: false },
  description: { type: String, required: false }
})

const educationSchema = new mongoose.Schema({
  school: { type: String, required: false },
  degree: { type: String, required: false },
  field: { type: String },
  graduationDate: { type: String, required: false },
  gpa: { type: String }
})

const skillSchema = new mongoose.Schema({
  name: { type: String, required: false },
  level: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    required: false,
    default: 'Intermediate'
  }
})

const personalInfoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: false },
  phone: { type: String, required: false },
  location: { type: String, required: false },
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
    required: true
  },
  isDraft: {
    type: Boolean,
    default: true
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
    // All console.error statements removed for production
  }
})

// Clear any existing model from cache to ensure fresh schema
if (mongoose.models.Resume) {
  delete mongoose.models.Resume
}

const Resume = mongoose.model('Resume', resumeSchema)

export default Resume 