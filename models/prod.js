import productos from "../productos.json" with { type: "json" };

export class prodModel {
  static async getAll({
    text,
    categoria,
    especie,
    marca,
    promocion,
    limit = 10,
    offset = 0,
  }) {
    let filteredProductos = productos;

    // Filtro por texto en nombre o descripción
    if (text) {
      const searchTerm = text.toLowerCase();
      filteredProductos = filteredProductos.filter(
        (prod) =>
          prod.nombre.toLowerCase().includes(searchTerm) ||
          prod.data.descripcion.toLowerCase().includes(searchTerm)||
          prod.marca.toLowerCase().includes(searchTerm),
      );
    }

    // Filtro por categoría (exacto)
    if (categoria) {
      filteredProductos = filteredProductos.filter(
        (prod) =>
          prod.categoria &&
          prod.categoria.toLowerCase() === categoria.toLowerCase(),
      );
    }

    // Filtro por especie
    if (especie) {
      filteredProductos = filteredProductos.filter(
        (prod) =>
          Array.isArray(prod.especie) &&
          prod.especie.some((e) => e.toLowerCase() === especie.toLowerCase()),
      );
    }

    // Filtro por marca
    if (marca) {
      const marcaQuery = marca.toLowerCase();
      filteredProductos = filteredProductos.filter((prod) => {
        const marcaProd = prod.marca.toLowerCase();
        return marcaProd === marcaQuery || marcaProd.includes(marcaQuery);
      });
    }

    // Filtro por promoción
    if (promocion) {
      const promo = promocion === "true";
      filteredProductos = filteredProductos.filter(
        (prod) => prod.data.promocion === promo,
      );
    }

    const limitNumber = Number(limit);
    const offsetNumber = Number(offset);

    const paginatedProductos = filteredProductos.slice(
      offsetNumber,
      offsetNumber + limitNumber,
    );

    return paginatedProductos;
  }

  static async getById(id) {
    const prod = productos.find((prod) => prod.id === id);
    return prod;
  }

  static async create({
    nombre,
    marca,
    precio,
    presentacion,
    especie,
    categoria,
    imagen,
    data,
  }) {
    const newprod = {
      id: crypto.randomUUID(),
      nombre,
      marca,
      precio,
      presentacion,
      especie: Array.isArray(especie) ? especie : [especie],
      categoria,
      imagen,
      data,
    };
    productos.push(newprod);
    return newprod;
  }

  static async update(
    id,
    { nombre, marca, precio, presentacion, especie, categoria, imagen, data },
  ) {
    const prodIndex = productos.findIndex((prod) => prod.id === id);
    if (prodIndex === -1) {
      return null;
    }
    productos[prodIndex] = {
      id,
      nombre,
      marca,
      precio,
      presentacion,
      especie: Array.isArray(especie) ? especie : [especie],
      categoria,
      imagen,
      data,
    };
    return productos[prodIndex];
  }

  static async patch(id, data) {
    const prod = productos.find((prod) => prod.id === id);
    if (!prod) {
      return null;
    }
    // Actualizar campos de nivel superior

    Object.assign(prod, data);

    // Normalizar especie si viene en el body
    if (data.especie) {
      prod.especie = Array.isArray(data.especie)
        ? data.especie
        : [data.especie];
    }

    // Si viene un objeto data, hacer merge profundo

    if (prod.data) {
      prod.data = {
        ...prod.data, // copia todas las propiedades actuales de data
        ...data.data, // mezcla las nuevas propiedades que vienen en el body
      };
    }
    return prod;
  }

  static async delete(id) {
    const prodIndex = productos.findIndex((prod) => prod.id === id);
    if (prodIndex === -1) {
      return null;
    }
    const deleted = productos.splice(prodIndex, 1);
    return deleted[0];
  }
}
