import { test, describe, before, after } from "node:test";
import assert, { rejects } from "node:assert";
import app from "./app.js";

let server;

const PORT = 1234;
const BASE_URL = `http://localhost:${PORT}`;

//Antes de todos los tests, se ejecuta una vez, para levantar el servidor

before(async () => {
  return new Promise((resolve, rejects) => {
    server = app.listen(PORT, () => {
      resolve();
    });
    server.on("error", rejects);
  });
});

//Después de todos los tests, se ejecuta una vez, para cerrar el servidor
after(() => {
  return new Promise((resolve, rejects) => {
    server.close((err) => {
      if (err) return rejects(err);
      resolve();
    });
  });
});

describe("GET /prods", () => {
  test("Debe responder con 200 y un array de trabajos", async () => {
    const response = await fetch(`${BASE_URL}/prods`);
    assert.strictEqual(response.status, 200);
    const json = await response.json();
    assert.ok(Array.isArray(json.data), "El resultado es un array");
  });

  test("Debe filtrar productos por categoria", async () => {
    const category = "Medicamento";
    const response = await fetch(`${BASE_URL}/prods?categoria=${category}`);
    const json = await response.json();
    json.data.every((prod) => prod.categoria === category);
    assert.ok(
      json.data.every((prod) => prod.categoria === category),
      `Todos los productos deben incluir la categoria ${category}`,
    );
  });

  test("Debe filtrar productos por especie", async () => {
    const species = "Perro";
    const response = await fetch(`${BASE_URL}/prods?especie=${species}`);
    const json = await response.json();
    assert.ok(
      json.data.every((prod) => prod.especie.includes(species)),
      `Todos los productos deben incluir la especie ${species}`,
    );
  });

  test("Debe responder con 404 si no coincide el id con ningún producto", async () => {
    const response = await fetch(`${BASE_URL}/prods/a20`);
    assert.strictEqual(response.status, 404);
  });
});

describe("POST /prods", () => {
  test("Debe responder con 201 y un producto creado", async () => {
    const response = await fetch(`${BASE_URL}/prods`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imagen: "https://media.falabella.com/sodimacCO/443544/public",
        nombre: "Nuevo producto",
        marca: "Empresa de prueba",
        categoria: "Medicamento",
        precio: 100,
        especie: "Perro",
        presentacion: "2kg",
        data: {
          descripcion: "Descripción del producto",
          stock: 10,
          valoracion: 4.6,
          promocion: true,
          precio_descuento: 50,
        },
      }),
    });

    assert.strictEqual(response.status, 201);

    const json = await response.json();
    assert.ok(
      json.data.nombre === "Nuevo producto",
      'El título del producto es "Nuevo producto"',
    );
    assert.ok(json.data.marca === "Empresa de prueba");
    assert.ok(json.data.especie.includes("Perro"));
    assert.ok(json.data.categoria === "Medicamento");
  });
});

describe("PUT /prods/:id", () => {
  test("Debe responder con 200 y el producto actualizado", async () => {
    const response = await fetch(`${BASE_URL}/prods/a1`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imagen: "https://media.falabella.com/sodimacCO/443544/public",
        nombre: "Nuevo producto",
        marca: "Empresa de prueba",
        categoria: "Medicamento",
        precio: 250,
        especie: ["Gato"],
        presentacion: "12kg",
        data: {
          descripcion: "Descripción del producto actualizado",
          stock: 10,
          valoracion: 4.6,
          promocion: true,
          precio_descuento: 50,
        },
      }),
    });

    assert.strictEqual(response.status, 200);

    const json = await response.json();
    assert.ok(
      json.data.nombre === "Nuevo producto",
      'El título del producto es "Nuevo producto"',
    );
    assert.ok(json.data.marca === "Empresa de prueba");
    assert.ok(json.data.especie.includes("Gato"));
    assert.ok(json.data.categoria === "Medicamento");
  });
});

describe("PATCH /prods/:id", () => {
  test("Debe responder con 200 y el producto actualizado en el apartado especie", async () => {
    const response = await fetch(`${BASE_URL}/prods/a2`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        especie: ["Perro"],
        precio: 250,
      }),
    });

    const json = await response.json();
    assert.strictEqual(response.status, 200);
    assert.ok(json.data.especie.includes("Perro"));
    assert.ok(json.data.precio === 250);
  });
});

describe("DELETE /prods/:id", () => {
  test("Debe responder con 200 y el producto eliminado", async () => {
    const response = await fetch(`${BASE_URL}/prods/a3`, {
      method: "DELETE",
    });
    assert.strictEqual(response.status, 200);
    const json = await response.json();
    assert.ok(json.message === "product deleted");
  });
});