import connection from "../database.js";

export async function getHistorialClientes(desde, hasta) {
  let query = `SELECT
                  historial.id,
                  historial.metodo_pago,
                  historial.total,
                  historial.cantidad,
                  productos.nombre AS producto_nombre,
                  proveedores.nombre AS proveedor_nombre,
                  historial.producto_id,
                  DATE_FORMAT(historial.created_at, '%d-%m-%Y') AS fecha
              FROM
                  historial
              INNER JOIN productos ON productos.id = historial.producto_id
              INNER JOIN proveedores ON proveedores.id = productos.proveedor_id
              WHERE historial.tipo_venta = ?`;

  const params = [1];

  if (desde) {
    query += " AND created_at >= ?";
    params.push(desde);
  }

  if (hasta) {
    query += " AND created_at <= ?";
    params.push(hasta);
  }

  query += ";";

  const [rows] = await connection.query(query, params);

  return rows;
}

export async function getHistorialMecanicos(desde, hasta) {
  let query = `SELECT
                  historial.id,
                  historial.metodo_pago,
                  historial.total,
                  historial.cantidad,
                  productos.nombre AS producto_nombre,
                  proveedores.nombre AS proveedor_nombre,
                  historial.producto_id,
                  mecanicos.nombre AS mecanicos_nombre,
                  DATE_FORMAT(historial.created_at, '%d-%m-%Y') AS fecha
              FROM
                  historial
              INNER JOIN productos ON productos.id = historial.producto_id
              INNER JOIN proveedores ON proveedores.id = productos.proveedor_id
              INNER JOIN mecanicos ON mecanicos.id = historial.mecanico_id
              WHERE historial.tipo_venta = ?`;

  const params = [2];

  if (desde) {
    query += " AND created_at >= ?";
    params.push(desde);
  }

  if (hasta) {
    query += " AND created_at <= ?";
    params.push(hasta);
  }

  query += ";";

  const [rows] = await connection.query(query, params);

  return rows;
}

export async function createRegistroClientes(
  producto_id, metodo_pago, cantidad, cantidad_vendida, total
) {
  const [result] = await connection.query(
    `INSERT INTO historial (producto_id, metodo_pago, cantidad, total, tipo_venta, created_at) VALUES (?, ?, ?, ?, 1, CURDATE());`,
    [producto_id, metodo_pago, cantidad_vendida, total]
  );

  cantidad = parseInt(cantidad) - parseInt(cantidad_vendida);

  const [resultUpdate] = await connection.query(
    `UPDATE productos SET stock = ? WHERE id = ?;`,
    [cantidad, producto_id]
  );

  return result;
}

export async function createRegistroMecanicos(
  producto_id, mecanico_id, metodo_pago, cantidad, cantidad_vendida, total
) {
  const [result] = await connection.query(
    `INSERT INTO historial (producto_id, mecanico_id, metodo_pago, cantidad, total, tipo_venta, created_at) VALUES (?, ?, ?, ?, ?, 2, CURDATE());`,
    [producto_id, mecanico_id, metodo_pago, cantidad_vendida, total]
  );

  cantidad = parseInt(cantidad) - parseInt(cantidad_vendida);

  const [resultUpdate] = await connection.query(
    `UPDATE productos SET stock = ? WHERE id = ?;`,
    [cantidad, producto_id]
  );

  return result;
}

export async function deleteRegistro(id) {
  const [rowsHistorial] = await connection.query(
    `SELECT producto_id, cantidad FROM historial WHERE id = ?;`,
    [id]
  );

  const [rowsProducto] = await connection.query(
    `SELECT stock FROM productos WHERE id = ?;`,
    [rowsHistorial[0].producto_id]
  );

  var cantidad = parseInt(rowsProducto[0].stock) + parseInt(rowsHistorial[0].cantidad);

  const [resultUpdate] = await connection.query(
    `UPDATE productos SET stock = ? WHERE id = ?;`,
    [cantidad, rowsHistorial[0].producto_id]
  );
  
  const [result] = await connection.query(
    `DELETE FROM historial WHERE id = ?;`,
    [id]
  );

  return result;
}
