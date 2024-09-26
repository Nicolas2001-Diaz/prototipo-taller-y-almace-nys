import cors from "cors";
import express from "express";

import inventarioRouter from "./routes/inventarioRouter.js";

const corsOptions = {
  origin: ["http://localhost:5173"],
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true,
};

const app = express();

app.use(express.json());
app.use(cors(corsOptions));

app.use('/api/inventario', inventarioRouter)

app.listen(4000, () => {
  console.log("Listening on port 4000")
});
