const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://selwyncybersec:CkmZyUwzpGyOD5Vz@cluster0.7hs2i71.mongodb.net/resume_builder?retryWrites=true&w=majority&appName=Cluster0';

// User schema (simplified)
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

async function testLogin() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Test user credentials
    const testEmail = 'test@example.com';
    const testPassword = 'password123';

    console.log('🔍 Looking up user:', testEmail);
    const user = await User.findOne({ email: testEmail });
    
    if (!user) {
      console.log('❌ User not found:', testEmail);
      return;
    }

    console.log('✅ User found:', {
      id: user._id.toString(),
      email: user.email,
      name: user.name
    });

    console.log('🔍 Testing password comparison...');
    const isValidPassword = await user.comparePassword(testPassword);
    console.log('🔍 Password validation result:', isValidPassword);

    if (isValidPassword) {
      console.log('✅ Login credentials are valid!');
      console.log('📝 You should be able to login with:');
      console.log('   Email:', testEmail);
      console.log('   Password:', testPassword);
    } else {
      console.log('❌ Password is incorrect');
    }

  } catch (error) {
    console.error('❌ Error testing login:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testLogin(); 