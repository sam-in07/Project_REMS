const bcrypt = require('bcryptjs');
const mockDb = require('../services/mockDb');

const register = async (req, res) => {
  try {
    const { name, email, password, role, universityId, department } = req.body;

    // Validate input
    if (!name || !email || !password || !role || !universityId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    const existingUser = mockDb.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password (in production, use proper hashing)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = mockDb.createUser({
      name,
      email,
      password: hashedPassword,
      role,
      universityId,
      department: department || ''
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const user = mockDb.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password (in production, use proper verification)
    // For mock purposes, accept "password123" or verify hash
    const isValidPassword = password === 'password123' || 
                           await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      user: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login };
