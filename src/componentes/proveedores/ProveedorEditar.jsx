import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useForm, Controller } from "react-hook-form";

export default function ProveedorEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      NombreEmpresa: "",
      Contacto: "",
      Teléfono: "",
      Email: "",
    },
  });

  useEffect(() => {
    if (!/^\d+$/.test(id)) {
      setMensaje("ID de proveedor inválido");
      setLoading(false);
      return;
    }

    const user = JSON.parse(localStorage.getItem("CurrentUser"));

    fetch(
      `https://spavehiculos.runasp.net/api/GestorProv/ConsultarporID?idProveedor=${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }
    )
      .then(async (res) => {
        if (res.status === 204) throw new Error("Proveedor no encontrado");
        if (!res.ok) throw new Error("Error al obtener proveedor");
        const data = await res.json();
        reset(data.Data);
        setLoading(false);
      })
      .catch(() => {
        setMensaje("Error al cargar datos del proveedor.");
        setLoading(false);
      });
  }, [id, reset]);

  const limpiarTexto = (valor) =>
    valor
      .replace(/\s{2,}/g, " ") // reemplaza espacios dobles
      .replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ\s]/g, "") // solo letras y espacios
      .trimStart();

  const limpiarTelefono = (valor) => valor.replace(/\D/g, "").trimStart();

  const limpiarEmail = (valor) => valor.replace(/\s+/g, "");

  const onSubmit = async (data) => {
    try {
      data.IdProveedor = parseInt(id);
      const user = JSON.parse(localStorage.getItem("CurrentUser"));

      const res = await fetch(
        "https://spavehiculos.runasp.net/api/GestorProv/ActualizarProveedor",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) throw new Error("Error en la actualización");
      setMensaje("Proveedor actualizado correctamente");
      setTimeout(() => navigate("/usuarios/proveedor"), 1500);
    } catch {
      setMensaje("Error al actualizar proveedor");
    }
  };

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Box display="flex" justifyContent="center" alignItems="flex-start" p={2}>
      <Paper
        elevation={6}
        sx={{ maxWidth: 500, width: "100%", p: 5, borderRadius: 4 }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/usuarios/proveedor")}
          sx={{
            mb: 4,
            color: "primary.main",
            borderColor: "primary.main",
            fontWeight: "bold",
            textTransform: "none",
            "&:hover": {
              bgcolor: "primary.main",
              color: "white",
            },
          }}
        >
          Volver
        </Button>

        <Typography
          variant="h4"
          fontWeight="bold"
          color="#1565c0"
          mb={4}
          align="center"
        >
          Editar Proveedor
        </Typography>

        {mensaje && (
          <Alert
            severity={mensaje.includes("Error") ? "error" : "success"}
            sx={{ mb: 3 }}
          >
            {mensaje}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box display="flex" flexDirection="column" gap={3}>
            <Controller
              name="NombreEmpresa"
              control={control}
              rules={{
                required: "El nombre de la empresa es obligatorio",
                minLength: { value: 3, message: "Mínimo 3 caracteres" },
                maxLength: { value: 50, message: "Máximo 50 caracteres" },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nombre Empresa"
                  onChange={(e) => field.onChange(limpiarTexto(e.target.value))}
                  error={!!errors.NombreEmpresa}
                  helperText={errors.NombreEmpresa?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="Contacto"
              control={control}
              rules={{
                required: "El contacto es obligatorio",
                minLength: { value: 3, message: "Mínimo 3 caracteres" },
                maxLength: { value: 50, message: "Máximo 50 caracteres" },
                pattern: {
                  value: /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/,
                  message: "Solo letras y espacios",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Contacto"
                  onChange={(e) => field.onChange(limpiarTexto(e.target.value))}
                  error={!!errors.Contacto}
                  helperText={errors.Contacto?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="Teléfono"
              control={control}
              rules={{
                required: "El teléfono es obligatorio",
                pattern: {
                  value: /^[0-9]{7,10}$/,
                  message: "Debe tener entre 7 y 15 dígitos numéricos",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Teléfono"
                  onChange={(e) =>
                    field.onChange(limpiarTelefono(e.target.value))
                  }
                  error={!!errors.Teléfono}
                  helperText={errors.Teléfono?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="Email"
              control={control}
              rules={{
                required: "El email es obligatorio",
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: "Formato de email inválido",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  onChange={(e) => field.onChange(limpiarEmail(e.target.value))}
                  error={!!errors.Email}
                  helperText={errors.Email?.message}
                  fullWidth
                />
              )}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              startIcon={<SaveIcon />}
              disabled={isSubmitting}
              sx={{ mt: 2, fontWeight: "bold", py: 1.5, borderRadius: 3 }}
            >
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
