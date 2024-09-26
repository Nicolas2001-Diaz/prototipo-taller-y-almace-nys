import connection from "../database.js";

export async function getInventario() {
  const [rows] = await connection.query(`SELECT
                                            productos.id,
                                            productos.nombre,
                                            productos.codigo,
                                            productos.precio_compra,
                                            productos.precio_venta,
                                            productos.stock
                                        FROM
                                            productos;`);

  return rows;
}

export async function getProducto(id) {
  const [row] = await connection.query(`SELECT
                                            productos.id,
                                            productos.nombre,
                                            productos.codigo,
                                            productos.precio_compra,
                                            productos.precio_venta,
                                            productos.stock
                                        FROM
                                            productos
                                        WHERE productos.codigo = ?;`, [id]);

  return row;
}

export async function createProducto(
  nombre,
  codigo,
  precio_compra,
  precio_venta,
  stock
) {
  const [result] = await connection.query(
    `INSERT INTO productos (nombre, codigo, precio_compra, precio_venta, stock) VALUES (?, ?, ?, ?, ?);`,
    [nombre, codigo, precio_compra, precio_venta, stock]
  );

  return result;
}

export async function updateProducto(
  id,
  nombre,
  codigo,
  precio_compra,
  precio_venta,
  stock
) {
  const [result] = await connection.query(
    `UPDATE productos SET nombre = ?, codigo = ?, precio_compra = ?, precio_venta = ?, stock = ? WHERE id = ?;`,
    [nombre, codigo, precio_compra, precio_venta, stock, id]
  );

  return result;
}

export async function deleteProducto(id) {
  const [result] = await connection.query(`DELETE FROM productos WHERE id = ?;`, [
    id,
  ]);

  return result;
}
