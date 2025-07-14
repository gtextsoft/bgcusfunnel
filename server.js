const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.set('view engine', 'ejs');
app.set('views', './views');

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Database initialization
const db = new sqlite3.Database('./cms.db');

// Initialize database tables
db.serialize(() => {
    // Event Details Table
    db.run(`CREATE TABLE IF NOT EXISTS event_details (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        subtitle TEXT,
        date TEXT,
        location TEXT,
        description TEXT,
        hero_image TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Pricing Tiers Table
    db.run(`CREATE TABLE IF NOT EXISTS pricing_tiers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price REAL,
        currency TEXT DEFAULT 'USD',
        features TEXT,
        button_text TEXT,
        is_featured BOOLEAN DEFAULT 0,
        sort_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Testimonials Table
    db.run(`CREATE TABLE IF NOT EXISTS testimonials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        title TEXT,
        company TEXT,
        content TEXT,
        image TEXT,
        rating INTEGER DEFAULT 5,
        is_active BOOLEAN DEFAULT 1,
        sort_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Coaches Table
    db.run(`CREATE TABLE IF NOT EXISTS coaches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        title TEXT,
        bio TEXT,
        image TEXT,
        social_links TEXT,
        is_active BOOLEAN DEFAULT 1,
        sort_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Features Table
    db.run(`CREATE TABLE IF NOT EXISTS features (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        icon TEXT,
        is_active BOOLEAN DEFAULT 1,
        sort_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Settings Table
    db.run(`CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        setting_key TEXT UNIQUE,
        setting_value TEXT,
        setting_type TEXT DEFAULT 'text',
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Insert default data
    db.run(`INSERT OR IGNORE INTO event_details (id, title, subtitle, date, location, description) 
            VALUES (1, 'Business Growth Conference 2025', 'Scale to 10 Figures', '2025-08-23', 'Dallas, TX', 'Join us for the most comprehensive business growth conference of the year')`);

    db.run(`INSERT OR IGNORE INTO settings (setting_key, setting_value, setting_type, description) 
            VALUES ('seats_available', '20', 'number', 'Number of VIP seats available')`);

    db.run(`INSERT OR IGNORE INTO settings (setting_key, setting_value, setting_type, description) 
            VALUES ('countdown_date', '2025-08-23T09:00:00', 'datetime', 'Event countdown date')`);

    db.run(`INSERT OR IGNORE INTO settings (setting_key, setting_value, setting_type, description) 
            VALUES ('trust_count', '6000', 'number', 'Number of entrepreneurs who trust us')`);
});

// Admin Dashboard Routes
app.get('/admin', (req, res) => {
    res.render('admin/dashboard');
});

app.get('/admin/event', (req, res) => {
    db.get('SELECT * FROM event_details WHERE id = 1', (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }
        res.render('admin/event', { event: row || {} });
    });
});

app.get('/admin/pricing', (req, res) => {
    db.all('SELECT * FROM pricing_tiers ORDER BY sort_order', (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }
        res.render('admin/pricing', { pricing: rows || [] });
    });
});

app.get('/admin/testimonials', (req, res) => {
    db.all('SELECT * FROM testimonials ORDER BY sort_order', (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }
        res.render('admin/testimonials', { testimonials: rows || [] });
    });
});

app.get('/admin/coaches', (req, res) => {
    db.all('SELECT * FROM coaches ORDER BY sort_order', (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }
        res.render('admin/coaches', { coaches: rows || [] });
    });
});

app.get('/admin/features', (req, res) => {
    db.all('SELECT * FROM features ORDER BY sort_order', (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }
        res.render('admin/features', { features: rows || [] });
    });
});

app.get('/admin/settings', (req, res) => {
    db.all('SELECT * FROM settings ORDER BY setting_key', (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }
        res.render('admin/settings', { settings: rows || [] });
    });
});

// API Routes

// Event Details API
app.get('/api/event', (req, res) => {
    db.get('SELECT * FROM event_details WHERE id = 1', (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(row || {});
    });
});

app.post('/api/event', (req, res) => {
    const { title, subtitle, date, location, description } = req.body;
    
    db.run(`UPDATE event_details SET title = ?, subtitle = ?, date = ?, location = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1`, 
           [title, subtitle, date, location, description], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Event updated successfully' });
    });
});

// Pricing API
app.get('/api/pricing', (req, res) => {
    db.all('SELECT * FROM pricing_tiers ORDER BY sort_order', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows || []);
    });
});

app.post('/api/pricing', (req, res) => {
    const { name, price, currency, features, button_text, is_featured, sort_order } = req.body;
    
    db.run(`INSERT INTO pricing_tiers (name, price, currency, features, button_text, is_featured, sort_order) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`, 
           [name, price, currency || 'USD', features, button_text, is_featured || 0, sort_order || 0], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, message: 'Pricing tier created successfully' });
    });
});

app.put('/api/pricing/:id', (req, res) => {
    const { name, price, currency, features, button_text, is_featured, sort_order } = req.body;
    
    db.run(`UPDATE pricing_tiers SET name = ?, price = ?, currency = ?, features = ?, button_text = ?, is_featured = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, 
           [name, price, currency, features, button_text, is_featured, sort_order, req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Pricing tier updated successfully' });
    });
});

app.delete('/api/pricing/:id', (req, res) => {
    db.run('DELETE FROM pricing_tiers WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Pricing tier deleted successfully' });
    });
});

// Testimonials API
app.get('/api/testimonials', (req, res) => {
    db.all('SELECT * FROM testimonials WHERE is_active = 1 ORDER BY sort_order', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows || []);
    });
});

app.post('/api/testimonials', (req, res) => {
    const { name, title, company, content, rating, is_active, sort_order } = req.body;
    
    db.run(`INSERT INTO testimonials (name, title, company, content, rating, is_active, sort_order) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`, 
           [name, title, company, content, rating || 5, is_active || 1, sort_order || 0], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, message: 'Testimonial created successfully' });
    });
});

app.put('/api/testimonials/:id', (req, res) => {
    const { name, title, company, content, rating, is_active, sort_order } = req.body;
    
    db.run(`UPDATE testimonials SET name = ?, title = ?, company = ?, content = ?, rating = ?, is_active = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, 
           [name, title, company, content, rating, is_active, sort_order, req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Testimonial updated successfully' });
    });
});

app.delete('/api/testimonials/:id', (req, res) => {
    db.run('DELETE FROM testimonials WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Testimonial deleted successfully' });
    });
});

// Coaches API
app.get('/api/coaches', (req, res) => {
    db.all('SELECT * FROM coaches WHERE is_active = 1 ORDER BY sort_order', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows || []);
    });
});

app.post('/api/coaches', (req, res) => {
    const { name, title, bio, social_links, is_active, sort_order } = req.body;
    
    db.run(`INSERT INTO coaches (name, title, bio, social_links, is_active, sort_order) 
            VALUES (?, ?, ?, ?, ?, ?)`, 
           [name, title, bio, social_links, is_active || 1, sort_order || 0], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, message: 'Coach created successfully' });
    });
});

app.put('/api/coaches/:id', (req, res) => {
    const { name, title, bio, social_links, is_active, sort_order } = req.body;
    
    db.run(`UPDATE coaches SET name = ?, title = ?, bio = ?, social_links = ?, is_active = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, 
           [name, title, bio, social_links, is_active, sort_order, req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Coach updated successfully' });
    });
});

app.delete('/api/coaches/:id', (req, res) => {
    db.run('DELETE FROM coaches WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Coach deleted successfully' });
    });
});

// Features API
app.get('/api/features', (req, res) => {
    db.all('SELECT * FROM features WHERE is_active = 1 ORDER BY sort_order', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows || []);
    });
});

app.post('/api/features', (req, res) => {
    const { title, description, icon, is_active, sort_order } = req.body;
    
    db.run(`INSERT INTO features (title, description, icon, is_active, sort_order) 
            VALUES (?, ?, ?, ?, ?)`, 
           [title, description, icon, is_active || 1, sort_order || 0], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, message: 'Feature created successfully' });
    });
});

app.put('/api/features/:id', (req, res) => {
    const { title, description, icon, is_active, sort_order } = req.body;
    
    db.run(`UPDATE features SET title = ?, description = ?, icon = ?, is_active = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, 
           [title, description, icon, is_active, sort_order, req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Feature updated successfully' });
    });
});

app.delete('/api/features/:id', (req, res) => {
    db.run('DELETE FROM features WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Feature deleted successfully' });
    });
});

// Settings API
app.get('/api/settings', (req, res) => {
    db.all('SELECT * FROM settings ORDER BY setting_key', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows || []);
    });
});

app.put('/api/settings/:key', (req, res) => {
    const { setting_value } = req.body;
    
    db.run(`UPDATE settings SET setting_value = ?, updated_at = CURRENT_TIMESTAMP WHERE setting_key = ?`, 
           [setting_value, req.params.key], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Setting updated successfully' });
    });
});

// File Upload API
app.post('/api/upload', (req, res) => {
    if (!req.files || !req.files.image) {
        return res.status(400).json({ error: 'No image uploaded' });
    }

    const image = req.files.image;
    const filename = `${uuidv4()}-${image.name}`;
    const uploadPath = path.join(__dirname, 'uploads', filename);

    image.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ filename: filename, url: `/uploads/${filename}` });
    });
});

// Serve the original landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint for the frontend to get all data
app.get('/api/all-data', (req, res) => {
    const data = {};
    
    db.get('SELECT * FROM event_details WHERE id = 1', (err, event) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        data.event = event || {};
        
        db.all('SELECT * FROM pricing_tiers ORDER BY sort_order', (err, pricing) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            data.pricing = pricing || [];
            
            db.all('SELECT * FROM testimonials WHERE is_active = 1 ORDER BY sort_order', (err, testimonials) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                data.testimonials = testimonials || [];
                
                db.all('SELECT * FROM coaches WHERE is_active = 1 ORDER BY sort_order', (err, coaches) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    data.coaches = coaches || [];
                    
                    db.all('SELECT * FROM features WHERE is_active = 1 ORDER BY sort_order', (err, features) => {
                        if (err) {
                            return res.status(500).json({ error: err.message });
                        }
                        data.features = features || [];
                        
                        db.all('SELECT * FROM settings', (err, settings) => {
                            if (err) {
                                return res.status(500).json({ error: err.message });
                            }
                            data.settings = {};
                            settings.forEach(setting => {
                                data.settings[setting.setting_key] = setting.setting_value;
                            });
                            
                            res.json(data);
                        });
                    });
                });
            });
        });
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 CMS Server running on http://localhost:${PORT}`);
    console.log(`📊 Admin Dashboard: http://localhost:${PORT}/admin`);
    console.log(`🌐 Landing Page: http://localhost:${PORT}/`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down gracefully...');
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Database connection closed.');
        process.exit(0);
    });
});