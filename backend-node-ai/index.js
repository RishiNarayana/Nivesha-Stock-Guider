const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const aiRoutes = require('./routes/aiRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
    res.send('Nivesha AI Gateway is running');
});

// Mock Python Service connection just for testing connectivity
app.get('/api/health', (req, res) => {
    res.json({ status: 'UP', service: 'AI Gateway' });
});

app.listen(PORT, () => {
    console.log(`AI Gateway running on port ${PORT}`);
});
