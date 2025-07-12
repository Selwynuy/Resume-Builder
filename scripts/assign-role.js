#!/usr/bin/env node

/**
 * Script to assign roles to users
 * Usage: node scripts/assign-role.js <email> <role>
 * Example: node scripts/assign-role.js user@example.com creator
 */

const https = require('https');
const http = require('http');

const email = process.argv[2];
const role = process.argv[3];

if (!email || !role) {
  console.error('Usage: node scripts/assign-role.js <email> <role>');
  console.error('Roles: user, creator, admin');
  console.error('Example: node scripts/assign-role.js user@example.com creator');
  process.exit(1);
}

if (!['user', 'creator', 'admin'].includes(role)) {
  console.error('Invalid role. Must be: user, creator, or admin');
  process.exit(1);
}

const data = JSON.stringify({
  email: email,
  role: role
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/admin/assign-role',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    try {
      const result = JSON.parse(responseData);
      if (res.statusCode === 200) {
        console.log(`✅ Successfully assigned ${role} role to ${email}`);
        console.log('Response:', result);
      } else {
        console.error(`❌ Failed to assign role: ${result.error || 'Unknown error'}`);
      }
    } catch (e) {
      console.error('❌ Invalid response:', responseData);
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Request failed:', e.message);
  console.error('Make sure your server is running on localhost:3000');
});

req.write(data);
req.end();

console.log(`🔄 Assigning ${role} role to ${email}...`); 