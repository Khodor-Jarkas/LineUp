const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'lineupdb'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
  console.log('Connected to database');
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// User registration
app.post('/api/register', async (req, res) => {
  const { email, password, full_name, phone } = req.body;

  try {
    // Check if user exists
    const [existing] = await db.promise().query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await db.promise().query(
      'INSERT INTO users (email, password, full_name, phone) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, full_name, phone]
    );

    // Generate token
    const token = jwt.sign(
      { userId: result.insertId, email, userType: 'customer' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { id: result.insertId, email, full_name, phone }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check user
    const [users] = await db.promise().query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, userType: 'customer' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Business registration
app.post('/api/business/register', authenticateToken, async (req, res) => {
  const {
    business_name,
    description,
    address,
    city,
    state,
    zip_code,
    phone,
    email,
    category
  } = req.body;
  const userId = req.user.userId;

  try {
    // Insert business
    const [result] = await db.promise().query(
      `INSERT INTO businesses 
      (user_id, business_name, description, address, city, state, zip_code, phone, email, category) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, business_name, description, address, city, state, zip_code, phone, email, category]
    );

    res.status(201).json({
      message: 'Business registered successfully',
      businessId: result.insertId
    });
  } catch (error) {
    console.error('Business registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Business login
app.post('/api/business/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check business login
    const [logins] = await db.promise().query(
      `SELECT bl.*, b.business_name 
       FROM business_logins bl
       JOIN businesses b ON bl.business_id = b.id
       WHERE bl.email = ?`,
      [email]
    );

    if (logins.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const businessLogin = logins[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, businessLogin.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      {
        businessId: businessLogin.business_id,
        email: businessLogin.email,
        userType: 'business',
        businessName: businessLogin.business_name
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Business login successful',
      token,
      business: {
        id: businessLogin.business_id,
        name: businessLogin.business_name,
        email: businessLogin.email
      }
    });
  } catch (error) {
    console.error('Business login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all businesses (for home page)
app.get('/api/businesses', async (req, res) => {
  try {
    const [businesses] = await db.promise().query(
      `SELECT id, business_name, description, address, city, category, 
              created_at 
       FROM businesses 
       WHERE business_name IS NOT NULL 
       ORDER BY created_at DESC 
       LIMIT 6`
    );

    res.json(businesses);
  } catch (error) {
    console.error('Get businesses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get business by ID
app.get('/api/businesses/:id', async (req, res) => {
  try {
    const [businesses] = await db.promise().query(
      `SELECT * FROM businesses WHERE id = ?`,
      [req.params.id]
    );

    if (businesses.length === 0) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Get services for this business
    const [services] = await db.promise().query(
      `SELECT * FROM business_services WHERE business_id = ?`,
      [req.params.id]
    );

    res.json({
      ...businesses[0],
      services
    });
  } catch (error) {
    console.error('Get business error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get businesses by user (for business dashboard)
app.get('/api/user/businesses', authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const [businesses] = await db.promise().query(
      `SELECT * FROM businesses WHERE user_id = ?`,
      [userId]
    );

    res.json(businesses);
  } catch (error) {
    console.error('Get user businesses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add queue entry
app.post('/api/queue', async (req, res) => {
  const {
    business_id,
    customer_name,
    customer_email,
    customer_phone,
    service_id,
    service_name,
    date,
    time
  } = req.body;

  try {
    // Calculate position
    const [countResult] = await db.promise().query(
      `SELECT COUNT(*) as count FROM queues 
       WHERE business_id = ? AND date = ? AND status IN ('waiting', 'in-progress')`,
      [business_id, date]
    );

    const position = countResult[0].count + 1;

    // Insert queue entry
    const [result] = await db.promise().query(
      `INSERT INTO queues 
      (business_id, customer_name, customer_email, customer_phone, 
       service_id, service_name, position, date, time) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [business_id, customer_name, customer_email, customer_phone,
       service_id, service_name, position, date, time]
    );

    res.status(201).json({
      message: 'Added to queue successfully',
      queueId: result.insertId,
      position,
      estimatedWaitTime: position * 15 // Simple estimation
    });
  } catch (error) {
    console.error('Add to queue error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get queue for business
app.get('/api/business/:id/queue', async (req, res) => {
  try {
    const [queue] = await db.promise().query(
      `SELECT * FROM queues 
       WHERE business_id = ? 
       ORDER BY date DESC, position ASC`,
      [req.params.id]
    );

    res.json(queue);
  } catch (error) {
    console.error('Get queue error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update queue status
app.put('/api/queue/:id', authenticateToken, async (req, res) => {
  const { status } = req.body;

  try {
    await db.promise().query(
      `UPDATE queues SET status = ? WHERE id = ?`,
      [status, req.params.id]
    );

    res.json({ message: 'Queue updated successfully' });
  } catch (error) {
    console.error('Update queue error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});