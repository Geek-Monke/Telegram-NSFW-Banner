const express = require('express');
const app = express();
const cors = require('cors');
const checkRoute = require('./routes/check');
const bodyParser = require('body-parser');

app.use(cors());
app.options('*', cors());

app.use(bodyParser.json());
app.use('/api', checkRoute);
app.post('/api/check', (req, res) => {
    const { link } = req.body;
    // Process the link here
    res.json({ message: 'Link received', link });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
