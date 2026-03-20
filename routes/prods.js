import { Router } from "express";
import { prodController } from "../controllers/prods.js";
import { validateProd, validatePartialProd } from "../schemas/prods.js";

export const prodsRouter = Router();

function validateCreate(req, res, next) {
  const result = validateProd(req.body);
  if (result.success) {
    req.body = result.data; //tener datos validados y limpios
    return next();
  }
  return res
    .status(400)
    .json({ error: "Invalid request", details: result.error.errors });
}

function validateUpdate(req, res, next) {
  const result = validatePartialProd(req.body);
  if (result.success) {
    req.body = result.data; //tener datos validados y limpios
    return next();
  }
  return res
    .status(400)
    .json({ error: "Invalid request", details: result.error.errors });
}

prodsRouter.get("/", prodController.getAll);

prodsRouter.get("/:id", prodController.getId);

prodsRouter.post("/", validateCreate, prodController.create);

prodsRouter.put("/:id", prodController.update);

prodsRouter.patch("/:id", validateUpdate, prodController.patch);

prodsRouter.delete("/:id", prodController.delete);
