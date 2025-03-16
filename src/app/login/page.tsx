// app/admin/login/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Container,
  Alert,
  CircularProgress,
  Stack,
  InputAdornment,
  IconButton,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import HomeIcon from "@mui/icons-material/Home";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useAuth } from "@/hooks/useAuth";

type LoginInputs = {
  idCard: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({
    defaultValues: {
      idCard: "",
      password: "",
    },
  });

  // Check if user is already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    setLoginError(null);
    
    try {
      await login.mutateAsync({ 
        idCard: data.idCard, 
        password: data.password 
      });
      router.push("/dashboard");
    } catch (err: any) {
      // Handle error without causing Next.js turbopack errors
      setLoginError(err.message || "Invalid credentials. Please try again.");
      console.error("Login error:", err);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login</title>
      </Head>
      <Container component="main" maxWidth="xs">
        <Box className="flex flex-col items-center justify-center min-h-screen">
          <Card className="w-full shadow-lg">
            <CardContent className="p-6">
              <Box className="flex flex-col items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mb-4">
                  <LockOutlinedIcon className="text-white" />
                </div>
                <Typography component="h1" variant="h5" className="font-bold">
                  Admin Login
                </Typography>
              </Box>

              {loginError && (
                <Alert severity="error" className="mb-4">
                  {loginError}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit(onSubmit)} className="mt-2">
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="idCard"
                  label="ID Card"
                  autoComplete="idCard"
                  autoFocus
                  error={!!errors.idCard}
                  helperText={errors.idCard?.message}
                  {...register("idCard", { 
                    required: "ID Card is required",
                    pattern: {
                      value: /^AD/,
                      message: "ID Card must start with AD"
                    }
                  })}
                  variant="outlined"
                  className="mb-4"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={togglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  {...register("password", { 
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters"
                    }
                  })}
                  variant="outlined"
                  className="mb-6"
                />
                <Stack spacing={2}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={login.isPending}
                    className="py-3"
                  >
                    {login.isPending ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Login"
                    )}
                  </Button>
                  <Link href="/" passHref>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="primary"
                      size="large"
                      startIcon={<HomeIcon />}
                      className="py-3"
                    >
                      Back to Home
                    </Button>
                  </Link>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  );
}
