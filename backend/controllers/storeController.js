import pool from '../config/database.js';

export const getStores = async (req, res) => {
  try {
    const { name, address, sort, order } = req.query;
    const userId = req.user?.id;
    
    let query = `
      SELECT s.id, s.name, s.email, s.address, 
             COALESCE(AVG(r.rating), 0) as average_rating,
             COUNT(r.id) as total_ratings
    `;
    
    // Add user's rating if user is authenticated
    if (userId) {
      query += `, ur.rating as user_rating`;
    }
    
    query += `
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
    `;
    
    if (userId) {
      query += ` LEFT JOIN ratings ur ON s.id = ur.store_id AND ur.user_id = ${userId}`;
    }
    
    query += ` WHERE 1=1`;
    
    const params = [];
    let paramCount = 0;

    // Apply filters
    if (name) {
      paramCount++;
      query += ` AND s.name ILIKE $${paramCount}`;
      params.push(`%${name}%`);
    }
    if (address) {
      paramCount++;
      query += ` AND s.address ILIKE $${paramCount}`;
      params.push(`%${address}%`);
    }

    query += ` GROUP BY s.id, s.name, s.email, s.address`;
    
    if (userId) {
      query += `, ur.rating`;
    }

    // Apply sorting
    const validSortFields = ['name', 'address', 'average_rating'];
    const sortField = validSortFields.includes(sort) ? sort : 'name';
    const sortOrder = order === 'asc' ? 'ASC' : 'DESC';
    query += ` ORDER BY ${sortField} ${sortOrder}`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    // Check if store email already exists
    const existingStore = await pool.query('SELECT id FROM stores WHERE email = $1', [email]);
    if (existingStore.rows.length > 0) {
      return res.status(400).json({ error: 'Store already exists with this email' });
    }

    // Verify owner exists and is a store_owner
    const ownerResult = await pool.query('SELECT role FROM users WHERE id = $1', [ownerId]);
    if (ownerResult.rows.length === 0) {
      return res.status(400).json({ error: 'Owner not found' });
    }
    if (ownerResult.rows[0].role !== 'store_owner') {
      return res.status(400).json({ error: 'Owner must have store_owner role' });
    }

    // Create store
    const result = await pool.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, address, ownerId]
    );

    res.status(201).json({
      message: 'Store created successfully',
      store: result.rows[0]
    });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStoresByOwner = async (req, res) => {
  try {
    const ownerId = req.user.id;
    
    const result = await pool.query(`
      SELECT s.id, s.name, s.email, s.address,
             COALESCE(AVG(r.rating), 0) as average_rating,
             COUNT(r.id) as total_ratings
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.owner_id = $1
      GROUP BY s.id, s.name, s.email, s.address
    `, [ownerId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get owner stores error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStoreRatings = async (req, res) => {
  try {
    const { storeId } = req.params;
    const ownerId = req.user.id;

    // Verify store belongs to owner
    const storeResult = await pool.query('SELECT id FROM stores WHERE id = $1 AND owner_id = $2', [storeId, ownerId]);
    if (storeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found or access denied' });
    }

    // Get ratings with user details
    const result = await pool.query(`
      SELECT r.rating, r.created_at, u.name as user_name, u.email as user_email
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = $1
      ORDER BY r.created_at DESC
    `, [storeId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get store ratings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};