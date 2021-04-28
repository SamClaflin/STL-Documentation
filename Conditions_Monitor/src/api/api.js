const express = require("express");
const cors = require("cors");
const apiRouter = require("./routes");
const helmet = require("helmet");

const app = express();
const port = 5000;

app.use(cors());
app.use(helmet());
app.use("/", apiRouter);

app.listen(port, () => { console.log(`STL Temperature Data App running on port ${port}...`) })
