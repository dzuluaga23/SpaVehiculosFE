import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function CiudadForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const cleaned = value.replace(/\s+/g, " ");
    setValue(name, cleaned, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    try {
      const storedUser = JSON.parse(
        localStorage.getItem("CurrentUser") || "null"
      );
      const token = storedUser?.token || null;

      if (!token) {
        throw new Error("No se encontró el token de autenticación.");
      }

      const response = await fetch(
        "https://spavehiculos.runasp.net/api/Ciudades/Insertar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Error al guardar la ciudad");
      }

      navigate("/ciudades");
    } catch (error) {
      console.error("Error en la solicitud:", error.message);
    }
  };

  return (
    <Paper
      sx={{
        p: 5,
        maxWidth: 600,
        margin: "auto",
        mt: 6,
        boxShadow: 4,
        borderRadius: 3,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h5" fontWeight="bold" mb={4} textAlign="center">
        Formulario de Ciudad
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        autoComplete="off"
        display="flex"
        flexDirection="column"
        gap={3}
      >
        <TextField
          label="Nombre"
          {...register("Nombre", {
            required: "El nombre es obligatorio",
            minLength: {
              value: 2,
              message: "Debe tener al menos 2 caracteres",
            },
          })}
          onChange={handleInputChange}
          error={!!errors.Nombre}
          helperText={errors.Nombre?.message}
          fullWidth
        />

        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          mt={3}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            color="secondary"
            onClick={() => navigate("/ciudades")}
          >
            Regresar
          </Button>

          <Button variant="contained" type="submit" color="primary">
            Guardar Ciudad
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}
