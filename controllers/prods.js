import { DEFAULTS } from "../config.js";
import { prodModel } from "../models/prod.js";

export class prodController {
  static async getAll(req, res) {
    const {
      text,
      categoria,
      especie,
      marca,
      promocion,
      limit = DEFAULTS.LIMIT_PAGINATION,
      technology,
      offset = DEFAULTS.LIMIT_OFFSET,
    } = req.query;

    const prods = await prodModel.getAll({
      text,
      categoria,
      especie,
      marca,
      promocion,
      limit,
      technology,
      offset,
    });

    const limitNumber = Number(limit);
    const offsetNumber = Number(offset);

    return res.json({
      data: prods,
      total: prods.length,
      limit: limitNumber,
      offset: offsetNumber,
    });
  }

  static async getId(req, res) {
    const { id } = req.params;

    const prod = await prodModel.getById(id);

    if (!prod) {
      return res.status(404).json({ error: "product not found" });
    }

    return res.json({ data: prod });
  }

  static async create(req, res) {
    const {
      nombre,
      marca,
      precio,
      presentacion,
      especie,
      categoria,
      imagen,
      data,
    } = req.body;

    const newprod = await prodModel.create({
      nombre,
      marca,
      precio,
      presentacion,
      especie,
      categoria,
      imagen,
      data,
    });

    return res.status(201).json({ data: newprod });
  }

  static async update(req, res) {
    const {
      nombre,
      marca,
      precio,
      presentacion,
      especie,
      categoria,
      imagen,
      data,
    } = req.body;

    // Validar que todos los campos estén
    if (
      !nombre ||
      !marca ||
      !precio ||
      !presentacion ||
      !categoria ||
      !imagen ||
      !data
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!especie || !Array.isArray(especie) || especie.length === 0) {
      return res
        .status(400)
        .json({ error: "Debe indicar al menos una especie" });
    }

    const actualizado = await prodModel.update(req.params.id, {
      nombre,
      marca,
      precio,
      presentacion,
      especie,
      categoria,
      imagen,
      data,
    });

    if (!actualizado) {
      return res.status(404).json({ error: "product not found" });
    }

    return res.json({ data: actualizado });
  }

  static async patch(req, res) {
    const body = req.body;

    // Validación básica: debe traer al menos un campo
    if (!body || Object.keys(body).length === 0) {
      return res
        .status(400)
        .json({ error: "Debe enviar al menos un campo para actualizar" });
    }
    const modificados = await prodModel.patch(req.params.id, body);

    if (!modificados) {
      return res.status(404).json({ error: "product not found" });
    }

    return res.json({ data: modificados });
  }
  static async delete(req, res) {
    const { id } = req.params;

    // Validar que el producto exista
    if (!id) {
      return res.status(400).json({ error: "Missing id" });
    }

    const deleted = await prodModel.delete(id);

    if (!deleted) {
      return res.status(404).json({ error: "product not found" });
    }

    return res.json({ message: "product deleted", data: deleted });
  }
}
