import { Router } from "express";
import {
  getInventario,
  getProducto,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../models/inventarioModel.js";

const router = Router();

router.get("/", async (req, res) => {
  const inventario = await getInventario();

  res.status(200).send(inventario);
});

router.get("/:id", async (req, res) => {
  const producto = await getProducto(req.params.id);

  res.status(200).send(producto);
});

router.post("/", async (req, res) => {
  const { nombre, codigo, precio_compra, precio_venta, stock } =
    req.body;

  const producto = await createProducto(
    nombre,
    codigo,
    precio_venta,
    precio_compra,
    stock
  );

  res.status(201).send(producto);
});

router.put("/", async (req, res) => {
  const { id, nombre, codigo, precio_venta, precio_compra, stock } =
    req.body;
  const producto = await updateProducto(
    id,
    nombre,
    codigo,
    precio_compra,
    precio_venta,
    stock
  );

  res.status(200).send(producto);
});

router.delete("/:id", async (req, res) => {
  const result = await deleteProducto(req.params.id);

  res.status(200).send(result);
});

export default router;
