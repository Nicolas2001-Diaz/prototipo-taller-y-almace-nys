import { Box, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import useScanDetection from "use-scan-detection-react18";
import { Button, Input } from "../../components/Controls";
import { useForm } from "../../hooks/useForm";

const initialFvalues = {
  id: 0,
  nombre: "",
  codigo: "",
  precio_compra: "",
  precio_venta: "",
  stock: "",
};

const InventarioForm = ({ addOrEdit, recordForEdit }) => {
  const validate = (fieldValues = values) => {
    let temp = { ...errors };

    if ("nombre" in fieldValues)
      temp.nombre = fieldValues.nombre ? "" : "Este campo es obligatorio.";
    if ("codigo" in fieldValues)
      temp.codigo = fieldValues.codigo ? "" : "Este campo es obligatorio.";
    if ("precio_compra" in fieldValues)
      temp.precio_compra =
        fieldValues.precio_compra.length > 2 ? "" : "Mínimo 3 números.";
    if ("precio_venta" in fieldValues)
      temp.precio_venta =
        fieldValues.precio_venta.length > 2 ? "" : "Mínimo 3 números.";

    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };

  const { values, errors, setValues, setErrors, handleInputChange, resetForm } =
    useForm(initialFvalues, true, validate);

  const [barcodeScan, setBarcodeScan] = useState("");

  useScanDetection({
    onComplete: setBarcodeScan,
    minLength: 5,
    averageWaitTime: 20,
  });

  const handleClose = () => {
    resetForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    values.codigo = barcodeScan;

    if (validate()) {
      addOrEdit(values, resetForm);
    }
  };

  useEffect(() => {
    if (recordForEdit != null) {
      setBarcodeScan(recordForEdit.codigo);

      setValues({
        ...recordForEdit,
        precio_compra: recordForEdit.precio_compra.toString(),
        precio_venta: recordForEdit.precio_venta.toString(),
        stock: recordForEdit.stock.toString(),
      });
    }
  }, [recordForEdit, setValues]);

  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { mt: 1, width: "100%" },
      }}
      autoComplete="off"
    >
      <Grid container columnSpacing={{ md: 2 }}>
        <Grid item xs={12}>
          <Input
            label="Codigo"
            name="codigo"
            value={barcodeScan}
            onChange={(e) => setBarcodeScan(e.target.value)}
            error={errors.codigo}
          />
        </Grid>

        <Grid item xs={12}>
          <Input
            label="Nombre"
            name="nombre"
            value={values.nombre}
            onChange={handleInputChange}
            error={errors.nombre}
            required
          />
        </Grid>

        <Grid item xs={12} md={5}>
          <Input
            label="Precio de compra"
            name="precio_compra"
            type="number"
            value={values.precio_compra}
            onChange={handleInputChange}
            error={errors.precio_compra}
          />
        </Grid>

        <Grid item xs={12} md={5}>
          <Input
            label="Precio de venta"
            name="precio_venta"
            type="number"
            value={values.precio_venta}
            onChange={handleInputChange}
            error={errors.precio_venta}
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <Input
            label="stock"
            name="stock"
            type="number"
            value={values.stock}
            onChange={handleInputChange}
            error={errors.stock}
          />
        </Grid>
      </Grid>

      <Grid
        sx={{ mt: 2 }}
        container
        justifyContent={{ xs: "space-between", md: "flex-end" }}
        columnSpacing={2}
      >
        <Grid item>
          {!recordForEdit && <Button text="Borrar" onClick={handleClose} />}
        </Grid>
        <Grid item>
          <Button
            text={recordForEdit ? "Editar" : "Guardar"}
            color="success"
            type="button"
            onClick={handleSubmit}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default InventarioForm;
