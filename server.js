// minimal nodejs static file server.
// listens to http://localhost:3000/
const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("public"));
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
