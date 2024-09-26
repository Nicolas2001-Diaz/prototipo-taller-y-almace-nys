import { Router } from "express";
import {
  getHistorialClientes,
  getHistorialMecanicos,
  createRegistroClientes,
  createRegistroMecanicos,
  deleteRegistro,
} from "../models/historialModel.js";

const router = Router();

router.get("/clientes", async (req, res) => {
  const { desde, hasta } = req.query;
  
  const inventario = await getHistorialClientes(desde, hasta);

  res.status(200).send(inventario);
});

router.get("/mecanicos", async (req, res) => {
  const { desde, hasta } = req.query;

  const inventario = await getHistorialMecanicos(desde, hasta);

  res.status(200).send(inventario);
});

router.post("/clientes", async (req, res) => {
  const { producto_id, metodo_pago, cantidad, cantidad_vendida, total } = req.body;

  const registro = await createRegistroClientes(
    producto_id,
    metodo_pago,
    cantidad,
    cantidad_vendida,
    total
  );

  res.status(201).send(registro);
});

router.post("/mecanicos", async (req, res) => {
  const { producto_id, mecanico_id, metodo_pago, cantidad, cantidad_vendida, total } = req.body;

  const registro = await createRegistroMecanicos(
    producto_id,
    mecanico_id,
    metodo_pago,
    cantidad,
    cantidad_vendida,
    total
  );

  res.status(201).send(registro);
});

router.delete("/:id", async (req, res) => {
  const result = await deleteRegistro(req.params.id);

  res.status(200).send(result);
});

export default router;
