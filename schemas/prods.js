import * as z from "zod";

export const dataSchema = z.object({
  descripcion: z
    .string()
    .min(
      5,
      "La descripción no puede ser menor a 5 caracteres, además de ser obligatoria",
    ),
  stock: z
    .number()
    .int()
    .nonnegative(
      "El campo stock debe ser un número entero positivo, además de ser obligatorio",
    ),
  valoracion: z
    .number()
    .min(0)
    .max(
      5,
      "El campo valoracion debe ser un número entre 0 y 5, permite numeros decimales positivos, además de ser obligatorio",
    ),
  promocion: z.boolean(
    "El campo promocion debe ser un booleano, además de ser obligatorio",
  ),
  precio_descuento: z
    .number()
    .positive(
      "El campo precio_descuento debe ser un número positivo, además de ser obligatorio",
    ),
});

const imagenSchema = z.string().refine(
  (val) => {
    // acepta si es URL válida o si empieza con "/" (ruta local del proyecto)
    try {
      new URL(val); // si es URL válida, pasa
      return true;
    } catch {
      return val.startsWith("/"); // si es ruta interna, también pasa
    }
  },
  {
    message: "Debe ser una URL válida o una ruta local del proyecto",
  },
);

const ProductSchema = z.object({
  categoria: z.enum(["Alimento", "Medicamento", "Accesorios/Juguetes"], {
    errorMap: () => ({
      message:
        "La categoría debe ser una de las opciones: Alimento, Medicamento, Accesorios/Juguetes",
    }),
  }),

  imagen: imagenSchema,
  nombre: z
    .string({
      error: "El campo titulo es obligatorio",
    })
    .min(1, "El campo titulo no puede estar vacío")
    .max(100, "El campo titulo no puede tener más de 100 caracteres"),

  marca: z
    .string({
      error: "El campo empresa es obligatorio",
    })
    .min(1, "El campo empresa no puede estar vacío")
    .max(100, "El campo empresa no puede tener más de 100 caracteres"),

  precio: z
    .number()
    .positive("El campo precio es obligatorio y debe ser positivo"),

  presentacion: z.string({ error: "El campo presentacion es obligatorio" }),

  especie: z.union([
    z.string().regex(/^[A-Za-z\s]+$/, "Solo letras y espacios"),
    z.array(z.string().regex(/^[A-Za-z\s]+$/, "Solo letras y espacios")),
  ]),

  data: dataSchema,
});

export function validateProd(input) {
  return ProductSchema.safeParse(input);
}

export function validatePartialProd(input) {
  return ProductSchema.partial().safeParse(input);
}
