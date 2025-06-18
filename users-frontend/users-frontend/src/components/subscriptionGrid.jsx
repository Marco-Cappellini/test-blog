import { useContext, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import ShowPasswordButton from "./showPasswordButton.jsx";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { subscribe } from "../services/usersService.js";
import { Bounce, toast, ToastContainer } from "react-toastify";
import Switch from "@mui/material/Switch";
import { Context } from "../context.js";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  textAlign: "left",
  boxShadow: "none",
  color: theme.palette.text.primary,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
}));

export default function SubscriptionForm(/*{ onSwitchForm }*/) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [role, setRole] = useState("employee");
  const [context, setContext] = useContext(Context);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const reciveSubmit = (data) => {
    const newUser = {
      fullName: data.fullName,
      email: data.email,
      userName: data.userName,
      password: data.password,
      role: role,
    };
    subscribe(newUser)
      .then((user) => {
        console.log(newUser);
        const msg = user.msg || "You are now subscribed";
        const userName = user.user?.userName || "";
        toast.info(`${msg}: ${userName}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
        setContext(user.user)
      })
      .catch((error) => {
        const errorMessage = error.message || "Errore generico";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      });
  };

  const goToLogin = () => {
    navigate("/login", { replace: true });
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Box
        sx={{
          width: "60%",
          maxWidth: 600,
          backgroundColor: theme.palette.background.paper,
          p: 4,
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[3],
        }}
      >
        <form onSubmit={handleSubmit(reciveSubmit)}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <Item
                sx={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "1.5rem",
                }}
              >
                SUBSCRIPTION FORM
              </Item>
            </Grid>
            <Grid item>
              <Item>
                <TextField
                  fullWidth
                  id="userName"
                  label="UserName"
                  variant="outlined"
                  {...register("userName",
                    { required: true })}
                  error={!!errors.userName}
                  helperText={errors.userName && "UserName is required"}
                />
              </Item>
            </Grid>
            <Grid item>
              <Item>
                <TextField
                  fullWidth
                  id="email"
                  label="Email"
                  variant="outlined"
                  placeholder="email@gmail.com"
                  {...register("email", {
                    required: true,
                    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  })}
                  error={!!errors.email}
                  helperText={
                    errors.email?.type === "required"
                      ? "Email is required"
                      : errors.email?.type === "pattern"
                        ? "Invalid email format"
                        : ""
                  }
                />
              </Item>
            </Grid>
            <Grid item>
              <Item>
                <TextField
                  fullWidth
                  id="fullName"
                  label="Full Name"
                  variant="outlined"
                  {...register("fullName", {
                    required: true,
                    pattern: /^[A-Za-z\s]+$/i,
                  })}
                  error={!!errors.fullName}
                  helperText={
                    errors.fullName?.type === "required" 
                      ? "This field is required"
                      : errors.fullName?.type === "pattern"
                        ? "Alphabetical characters only"
                        : ""
                  }
                />
              </Item>
            </Grid>
            <Grid item>
              <Item>
                <TextField
                  fullWidth
                  id="password"
                  label="Password"
                  type={show ? "text" : "password"}
                  placeholder={show ? "Password1234" : "••••••••••••"}
                  {...register("password", {
                    required: true,
                    minLength: 12,
                    validate: {
                      hasUpperCase: (value) => /[A-Z]/.test(value),
                      hasLowerCase: (value) => /[a-z]/.test(value),
                      hasNumber: (value) => /[0-9]/.test(value),
                      noSpaces: (value) => /^\S+$/.test(value),
                    },
                  })}
                  slots={{
                    input: OutlinedInput,
                  }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <ShowPasswordButton
                            show={show}
                            setShow={setShow} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  error={!!errors.password}
                />
                {errors.password?.type === "required" &&
                  <p
                    style={{
                      color: theme.palette.error.main
                    }}>
                    Password is required
                  </p>}
                {errors.password?.type === "minLength" &&
                  <p
                    style={{
                      color: theme.palette.error.main
                    }}>
                    Password must be at least 12 characters long
                  </p>}
                {errors.password?.type === "hasUpperCase" &&
                  <p
                    style={{
                      color: theme.palette.error.main
                    }}>
                    Password must contain at least one uppercase letter
                  </p>}
                {errors.password?.type === "hasLowerCase" &&
                  <p
                    style={{
                      color: theme.palette.error.main
                    }}>
                    Password must contain at least one lowercase letter
                  </p>}
                {errors.password?.type === "hasNumber" &&
                  <p
                    style={{
                      color: theme.palette.error.main
                    }}>
                    Password must contain at least one number
                  </p>}
                {errors.password?.type === "noSpaces" &&
                  <p
                    style={{
                      color: theme.palette.error.main
                    }}>
                    Password must not contain spaces
                  </p>}
              </Item>
            </Grid>
            <Grid item>
              <Item
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: theme.spacing(2),
                  height: "auto",
                }}
              >
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.3rem",
                    color: theme.palette.text.primary
                  }}
                >
                  employee
                </span>
                <Switch
                  checked={role === "manager"}
                  onChange={(e) =>
                    setRole(e.target.checked ? "manager" : "employee")
                  }
                  sx={{
                    transform: "scale(1.5)",
                    marginLeft: theme.spacing(1),
                    "& .MuiSwitch-switchBase": {
                      color: theme.palette.error.main,
                      "&.Mui-checked": {
                        color: theme.palette.success.main,
                      },
                    },
                    "& .MuiSwitch-track": {
                      backgroundColor: theme.palette.error.main,
                      opacity: 1,
                      borderRadius: 20,
                      "&.Mui-checked": {
                        backgroundColor: theme.palette.success.main,
                      },
                    },
                  }}
                />
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.3rem",
                    color: theme.palette.text.primary
                  }}
                >
                  manager
                </span>
              </Item>
            </Grid>
            <Grid item>
              <Item>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    border: `1px solid ${theme.palette.divider}`,
                    padding: theme.spacing(2),
                    fontSize: "1rem",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.light,
                      color: theme.palette.primary.contrastText,
                    },
                  }}
                >
                  SUBSCRIBE
                </Button>
              </Item>
            </Grid>
            <Grid item>
              <Item
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: theme.spacing(0.5),
                  color: theme.palette.text.primary,
                }}
              >
                <span>Do you already have an account?</span>
                <Button
                  variant="text"
                  onClick={goToLogin}
                  sx={{
                    textTransform: "none",
                    color: theme.palette.primary.main,
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  LOGIN
                </Button>
              </Item>
            </Grid>
          </Grid>
        </form>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Bounce}
        />
      </Box>
    </Box>
  );
}