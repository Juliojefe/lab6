import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({ extended: true }));

//setting up database connection pool
const pool = mysql.createPool({
  host: "w1h4cr5sb73o944p.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
  user: "bp1t2waqynoo300o",
  password: "xhvh50l86emzmr72",
  database: "zutb6skwh6b157ly",
  connectionLimit: 10,
  waitForConnections: true
});

app.get('/', async (req, res) => {
  let authorsSql = "SELECT authorId, firstName, lastName FROM authors ORDER BY lastName";
  const [authorRows] = await pool.query(authorsSql);
  let categoriesSql = "SELECT DISTINCT category FROM quotes;";
  const [categoriesRows] = await pool.query(categoriesSql);
  res.render("home.ejs", { authorRows, categoriesRows });
});

app.get('/searchByAuthor', async (req, res) => {
  let authorId = req.query.authorId;
  let sql = "SELECT firstName, lastName, quote, q.authorId FROM quotes q JOIN authors a ON q.authorId = a.authorId WHERE q.authorId = ?;"
  const [rows] = await pool.query(sql, [authorId]);
  res.render("results.ejs", { rows });
});

app.get('/searchByCategory', async (req, res) => {
  let cat = req.query.category;
  const sqlCat = `
    SELECT a.firstName, a.lastName, q.quote, q.authorId
    FROM quotes q
    JOIN authors a ON q.authorId = a.authorId
    WHERE q.category = ?`;
  const [rowsCat] = await pool.query(sqlCat, [cat]);
  res.render("results.ejs", { rows: rowsCat });
});

//  get all info for a specific author
app.get('/api/authors/:authorId', async (req, res) => {
  let authorId = req.params.authorId;
  let sql = "SELECT * FROM authors WHERE authorId = ?"
  const [rows] = await pool.query(sql, [authorId]);
  res.send(rows);
});

app.get('/searchByKeyword', async (req, res) => {
  let keyword = req.query.keyword;
  let sql = "SELECT firstName, lastName, quote, authorId FROM authors NATURAL JOIN quotes WHERE quote LIKE ?";
  let sqlParams = [`%${keyword}%`];
  const [rows] = await pool.query(sql, sqlParams);
  console.log(rows);
  res.render("results.ejs", { rows });
});

app.get("/dbTest", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT CURDATE()");
    res.send(rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Database error!");
  }
});//dbTest

app.listen(3000, () => {
  console.log("Express server running")
})