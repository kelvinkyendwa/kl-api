const express = require("express");
const cors = require("cors");

const bodyParser = require("body-parser");
const { Client } = require("pg");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const client = new Client({
	connectionString:
		"postgres://qsrqsoqw:vkGR6ENEhHoBUf7oajDNf-DbqDX0oHsE@rosie.db.elephantsql.com/qsrqsoqw",
});

client.connect();

// fetch the latest sugar data
app.get("/sugar", (req, res) => {
	client.query("SELECT * FROM sugar_data", (err, result) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.send(result.rows);
		}
	});
});

// function to capitalize the search parameters
function capitalize([first, ...rest]) {
	return first.toUpperCase() + rest.join("").toLowerCase();
}

// fetch sugar based on the search parameters ie country
app.get("/sugar/:country", (req, res) => {
	const searchQuery = capitalize(req.params.country);
	client.query(
		`SELECT * FROM sugar_data WHERE(country = '${searchQuery}')`,
		(err, result) => {
			if (err) {
				res.status(500).send(err);
			} else {
				res.send(result.rows);
			}
		},
	);
});

app.listen(5000, () => {
	console.log("Server started on port 5000");
});
