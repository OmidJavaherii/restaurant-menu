"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  Lock as LockIcon,
  Person as PersonIcon,
  Visibility,
  VisibilityOff,
  Home as HomeIcon,
} from "@mui/icons-material";
import {
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useThemeStore } from "@/store/themeStore";
import Head from "next/head";

interface LoginFormData {
  idCard: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: {
      idCard: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      if (!data.idCard || !data.password) {
        toast.error("Please fill in all fields");
        return;
      }

      const result = await login.mutateAsync({
        idCard: data.idCard,
        password: data.password,
      });

      if (result && typeof result === "object") {
        toast.success("Login successful!");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Invalid credentials");
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login</title>
      </Head>
      <div className={`min-h-screen flex items-center justify-center p-4 ${isDarkMode ? 'dark' : ''}`}>
        <Paper elevation={3} className="paper">
          <Box className="text-center mb-8">
            <Typography
              variant="h4"
              component="h1"
              className="font-bold"
            >
              Admin Login
            </Typography>
          </Box>

          <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="space-y-6 flex flex-col gap-4" 
            autoComplete="off"
            name="login-form"
          >
            <Controller
              name="idCard"
              control={control}
              rules={{
                required: "ID Card is required",
                pattern: {
                  value: /^AD[A-Za-z0-9]+$/,
                  message: "ID Card must start with 'AD' followed by letters or numbers",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="ID Card"
                  variant="outlined"
                  error={!!errors.idCard}
                  helperText={errors.idCard?.message}
                  value={field.value.startsWith("AD") ? field.value : `AD${field.value}`}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.startsWith("AD")) {
                      field.onChange(value);
                    } else {
                      field.onChange(`AD${value}`);
                    }
                  }}
                  className="input-field"
                  autoComplete="off"
                  name="idCard"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon className="icon" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Password is too long",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  className="input-field"
                  autoComplete="new-password"
                  name="password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon className="icon" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          className="icon"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              className="btn-primary py-3"
            >
              {isSubmitting ? (
                <CircularProgress size={24} className="text-white" />
              ) : (
                "Sign In"
              )}
            </Button>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<HomeIcon />}
              onClick={() => router.push("/")}
              className={`mt-2 ${isDarkMode ? 'text-white border-white hover:bg-white/10' : 'text-gray-700 border-gray-700 hover:bg-gray-100'}`}
            >
              Return to Home
            </Button>

            <Box className="mt-4 text-center">
              <Typography variant="body2" className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Hint:
                Admin ID: AD123456 / Password: admin123
              </Typography>
            </Box>
          </form>
        </Paper>
      </div>
    </>
  );
}
