const express = require('express');
const { BigQuery } = require('@google-cloud/bigquery');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Define the path to your keyfile
const keyFilename = path.join(__dirname, 'keyfile.json'); // Update this with your actual path

// Initialize BigQuery with the keyfile
const bigquery = new BigQuery({ keyFilename });

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Project and dataset information
const projectId = 'my-vue-app-435611';
const datasetId = 'Alifmart';
const tableId = 'Con';

// CRUD routes
app.get('/api/consumers', async (req, res) => {
  const query = `SELECT * FROM \`${projectId}.${datasetId}.${tableId}\``;
  try {
    const [rows] = await bigquery.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/consumers', async (req, res) => {
  const { g_id, g_name, g_email, g_img, c_number } = req.body;
  const query = `INSERT INTO \`${projectId}.${datasetId}.${tableId}\`
                 (g_id, g_name, g_email, g_img, c_number)
                 VALUES (@g_id, @g_name, @g_email, @g_img, @c_number)`;
  const options = { query, params: { g_id, g_name, g_email, g_img, c_number } };

  try {
    await bigquery.query(options);
    res.status(201).json({ message: 'Consumer created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/consumers/:g_id', async (req, res) => {
  const { g_id } = req.params;
  const { g_name, g_email, g_img, c_number } = req.body;
  const query = `UPDATE \`${projectId}.${datasetId}.${tableId}\`
                 SET g_name = @g_name, g_email = @g_email, g_img = @g_img, c_number = @c_number
                 WHERE g_id = @g_id`;
  const options = { query, params: { g_id, g_name, g_email, g_img, c_number } };

  try {
    await bigquery.query(options);
    res.status(200).json({ message: 'Consumer updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/consumers/:g_id', async (req, res) => {
  const { g_id } = req.params;
  const query = `DELETE FROM \`${projectId}.${datasetId}.${tableId}\` WHERE g_id = @g_id`;
  const options = { query, params: { g_id } };

  try {
    await bigquery.query(options);
    res.status(200).json({ message: 'Consumer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
