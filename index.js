require("dotenv").config();
const express = require("express");
const app = express();

const authRouter = require("./routes/auth.routes");
const todoRouter = require("./routes/todo.routes");

app.use(express.json());

app.get("/", (req, res) => {
res.status(200).json({message: "ishladi"})
})

app.use("/api/auth", authRouter);
app.use("/api/todos", todoRouter);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
