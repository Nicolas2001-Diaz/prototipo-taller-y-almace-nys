import {
  AddCircleOutline,
  Delete,
  Edit
} from "@mui/icons-material";
import { Alert, Snackbar } from "@mui/material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import Axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../../components/Controls";
import CustomizedDataGrid from "../../components/CustomizedDataGrid/CustomizedDataGrid";
import Modal from "../../components/Dialog/Dialog";
import PageComponent from "../../components/PageComponent/PageComponent";
import ExportarInventario from "./ExportarInventario";
import InventarioForm from "./InventarioForm";

const Inventario = () => {
  const baseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/";

  const columns = [
    { field: "nombre", headerName: "Nombre", width: 320 },
    {
      field: "precio_compra",
      headerName: "Precio Compra",
      headerAlign: "center",
      align: "center",
      width: 200,
    },
    {
      field: "precio_venta",
      headerName: "Precio Venta",
      headerAlign: "center",
      align: "center",
      width: 200,
    },
    {
      field: "stock",
      headerName: "Cantidad",
      headerAlign: "center",
      align: "center",
      width: 100,
    },
    {
      field: "",
      headerName: "Acciones",
      type: "actions",
      headerAlign: "center",
      align: "center",
      width: 200,
      getActions: (params) => [
        <GridActionsCellItem
          key={params.id}
          icon={<Edit />}
          color="info"
          label="Delete"
          onClick={() => openInModal(params.row)}
        />,
        <GridActionsCellItem
          key={params.id}
          icon={<Delete />}
          color="error"
          label="Delete"
          onClick={() => deleteProduct(params.id)}
        />,
      ],
    },
  ];

  const [rows, setRows] = useState([]);

  const getInventario = useCallback(async () => {
    await Axios.get(baseUrl + "inventario").then(({ data }) => {
      setRows(data);
    });
  }, [baseUrl]);

  useEffect(() => {
    getInventario();
  }, [getInventario]);

  const [openModal, setOpenModal] = useState(false);

  const [openSnack, setOpenSnack] = useState({
    show: false,
    severity: "",
    message: "",
  });

  const [recordForEdit, setRecordForEdit] = useState(null);

  const handleCloseSnack = () => {
    setOpenSnack({ show: false, severity: "", message: "" });
  };

  const addOrEdit = async (product, resetForm) => {
    if (recordForEdit === null && product.id === 0) {
      await Axios.post(baseUrl + "inventario", {
        nombre: product.nombre,
        codigo: product.codigo,
        precio_compra: product.precio_compra,
        precio_venta: product.precio_venta,
        stock: product.stock,
      })
        .then(() => {
          getInventario();

          resetForm();
          setRecordForEdit(null);
          setOpenModal(false);

          setOpenSnack({
            show: true,
            severity: "success",
            message: "Producto guardado correctamente",
          });
        })
        .catch(() => {
          setOpenSnack({
            show: true,
            severity: "error",
            message: "No se pudo ingresar el producto",
          });
        });
    } else if (recordForEdit !== null && product.id !== 0) {
      await Axios.put(baseUrl + "inventario", {
        id: product.id,
        nombre: product.nombre,
        codigo: product.codigo,
        precio_compra: product.precio_compra,
        precio_venta: product.precio_venta,
        stock: product.stock,
      })
        .then(() => {
          getInventario();

          resetForm();
          setRecordForEdit(null);
          setOpenModal(false);

          setOpenSnack({
            show: true,
            severity: "success",
            message: "Producto actualizado correctamente",
          });
        })
        .catch(() => {
          setOpenSnack({
            show: true,
            severity: "error",
            message: "No se pudo actualizar el producto",
          });
        });
    }
  };

  const openInModal = (product) => {
    setRecordForEdit(product);
    setOpenModal(true);
  };

  const deleteProduct = async (id) => {
    await Axios.delete(`${baseUrl}inventario/${id}`)
      .then(() => {
        getInventario();

        setOpenSnack({
          show: true,
          severity: "success",
          message: "Producto eliminado correctamente",
        });
      })
      .catch(() => {
        setOpenSnack({
          show: true,
          severity: "error",
          message: "No se pudo eliminar el producto",
        });
      });
  };

  return (
    <>
      <PageComponent
        title="Inventario"
        maxWidth="xl"
        buttons={
          <>
            <ExportarInventario productos={rows} />

            <Button
              text="Agregar Producto"
              color="secondary"
              onClick={() => {
                setOpenModal(true);
                setRecordForEdit(null);
              }}
              startIcon={<AddCircleOutline />}
            />
          </>
        }
      >
        <CustomizedDataGrid columns={columns} rows={rows} />

        <Modal
          open={openModal}
          setOpen={() => setOpenModal(false)}
          title={
            recordForEdit === null ? "Agregar Producto" : "Actualizar Producto"
          }
        >
          <InventarioForm addOrEdit={addOrEdit} recordForEdit={recordForEdit} />
        </Modal>

        <Snackbar
          open={openSnack.show}
          autoHideDuration={3000}
          onClose={handleCloseSnack}
        >
          <Alert
            onClose={handleCloseSnack}
            severity={openSnack.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {openSnack.message}
          </Alert>
        </Snackbar>
      </PageComponent>
    </>
  );
};

export default Inventario;
