import bcrypt from 'bcryptjs';
import pool from '../config/database.js';

export const getUsers = async (req, res) => {
  try {
    const { name, email, address, role, sort, order } = req.query;
    
    let query = 'SELECT id, name, email, address, role, created_at FROM users WHERE 1=1';
    const params = [];
    let paramCount = 0;

    // Apply filters
    if (name) {
      paramCount++;
      query += ` AND name ILIKE $${paramCount}`;
      params.push(`%${name}%`);
    }
    if (email) {
      paramCount++;
      query += ` AND email ILIKE $${paramCount}`;
      params.push(`%${email}%`);
    }
    if (address) {
      paramCount++;
      query += ` AND address ILIKE $${paramCount}`;
      params.push(`%${address}%`);
    }
    if (role) {
      paramCount++;
      query += ` AND role = $${paramCount}`;
      params.push(role);
    }

    // Apply sorting
    const validSortFields = ['name', 'email', 'role', 'created_at'];
    const sortField = validSortFields.includes(sort) ? sort : 'created_at';
    const sortOrder = order === 'asc' ? 'ASC' : 'DESC';
    query += ` ORDER BY ${sortField} ${sortOrder}`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const userResult = await pool.query(
      'SELECT id, name, email, address, role, created_at FROM users WHERE id = $1',
      [id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // If user is store owner, get their store rating
    if (user.role === 'store_owner') {
      const storeResult = await pool.query(`
        SELECT s.id, s.name, COALESCE(AVG(r.rating), 0) as average_rating
        FROM stores s
        LEFT JOIN ratings r ON s.id = r.store_id
        WHERE s.owner_id = $1
        GROUP BY s.id, s.name
      `, [id]);
      
      user.stores = storeResult.rows;
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    // Check if user already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, address, role, created_at',
      [name, email, hashedPassword, address, role]
    );

    res.status(201).json({
      message: 'User created successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const usersResult = await pool.query('SELECT COUNT(*) as count FROM users');
    const storesResult = await pool.query('SELECT COUNT(*) as count FROM stores');
    const ratingsResult = await pool.query('SELECT COUNT(*) as count FROM ratings');

    res.json({
      totalUsers: parseInt(usersResult.rows[0].count),
      totalStores: parseInt(storesResult.rows[0].count),
      totalRatings: parseInt(ratingsResult.rows[0].count)
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};