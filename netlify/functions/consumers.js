const { BigQuery } = require('@google-cloud/bigquery');

const bigquery = new BigQuery();
const projectId = 'my-vue-app-435611';
const datasetId = 'Alifmart';
const tableId = 'Con';

exports.handler = async (event) => {
  const method = event.httpMethod;

  switch (method) {
    case 'GET':
      return await getConsumers();
    case 'POST':
      return await createConsumer(JSON.parse(event.body));
    case 'PUT':
      return await updateConsumer(event.path.split('/').pop(), JSON.parse(event.body));
    case 'DELETE':
      return await deleteConsumer(event.path.split('/').pop());
    default:
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method not allowed' }),
      };
  }
};

const getConsumers = async () => {
  const query = `SELECT * FROM \`${projectId}.${datasetId}.${tableId}\``;
  try {
    const [rows] = await bigquery.query(query);
    return { statusCode: 200, body: JSON.stringify(rows) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};

const createConsumer = async (data) => {
  const { g_id, g_name, g_email, g_img, c_number } = data;
  const query = `INSERT INTO \`${projectId}.${datasetId}.${tableId}\`
                 (g_id, g_name, g_email, g_img, c_number)
                 VALUES (@g_id, @g_name, @g_email, @g_img, @c_number)`;
  const options = { query, params: { g_id, g_name, g_email, g_img, c_number } };

  try {
    await bigquery.query(options);
    return { statusCode: 201, body: JSON.stringify({ message: 'Consumer created successfully' }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};

const updateConsumer = async (g_id, data) => {
  const { g_name, g_email, g_img, c_number } = data;
  const query = `UPDATE \`${projectId}.${datasetId}.${tableId}\`
                 SET g_name = @g_name, g_email = @g_email, g_img = @g_img, c_number = @c_number
                 WHERE g_id = @g_id`;
  const options = { query, params: { g_id, g_name, g_email, g_img, c_number } };

  try {
    await bigquery.query(options);
    return { statusCode: 200, body: JSON.stringify({ message: 'Consumer updated successfully' }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};

const deleteConsumer = async (g_id) => {
  const query = `DELETE FROM \`${projectId}.${datasetId}.${tableId}\` WHERE g_id = @g_id`;
  const options = { query, params: { g_id } };

  try {
    await bigquery.query(options);
    return { statusCode: 200, body: JSON.stringify({ message: 'Consumer deleted successfully' }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
