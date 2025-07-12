import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  role: {
    type: String,
    enum: ['user', 'creator', 'admin'],
    default: 'user',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resumes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
  }],
  templates: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
  }],
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
  }],
  // Subscription fields
  stripeCustomerId: {
    type: String,
    sparse: true,
  },
  stripeSubscriptionId: {
    type: String,
    sparse: true,
  },
  subscriptionTier: {
    type: String,
    enum: ['free', 'basic', 'pro', 'enterprise'],
    default: 'free',
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'canceled', 'past_due', 'incomplete'],
    default: 'active',
  },
  isStudent: {
    type: Boolean,
    default: false,
  },
  subscriptionEndDate: {
    type: Date,
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'quarterly'],
    default: 'monthly',
  },
  // Password reset fields
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  // PayPal subscription fields
  subscription: {
    tier: {
      type: String,
      enum: ['free', 'basic', 'pro', 'enterprise'],
      default: 'free',
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'quarterly'],
      default: 'monthly',
    },
    status: {
      type: String,
      enum: ['active', 'canceled', 'expired'],
      default: 'active',
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    paypalOrderId: {
      type: String,
    },
    paypalCaptureId: {
      type: String,
    },
  },
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: unknown) {
    return false
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to check if user is a creator
userSchema.methods.isCreator = function() {
  return this.role === 'creator' || this.role === 'admin';
};

// Method to check if user is an admin
userSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

export default mongoose.models.User || mongoose.model('User', userSchema); 