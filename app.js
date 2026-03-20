import express from "express";
import { corsMiddleware } from "./middlewares/cors.js";
import { prodsRouter } from "./routes/prods.js";
import { DEFAULTS } from "./config.js";

const PORT = process.env.PORT ?? DEFAULTS.PORT;
const app = express();

app.use(corsMiddleware());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bienvenido a la API de productos");
});

app.use("/prods", prodsRouter);

if (!process.env.NODE_ENV) {
  app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
  });
}

export default app;
