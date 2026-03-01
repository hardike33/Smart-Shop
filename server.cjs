const db = require('./backend/db');

db.query("SELECT 1 + 1 AS result", (err, results) => {
  if (err) {
    console.error('Query error:', err);
    process.exit(1);
  }
  console.log('Query results:', results);
  process.exit(0);
});
