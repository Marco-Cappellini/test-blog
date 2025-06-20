import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import ShowPasswordButton from "./showPasswordButton.jsx";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useCallback, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { login } from "../services/usersService.js";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { DarkModeContext } from "../darkModeContext";
import { Context } from "../context.js";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    textAlign: "left",
    boxShadow: "none",
    color: theme.palette.text.primary,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: "8px",
}));

export const UseSessionStorage = (key, initialValue) => {
    const [value, setValue] = useState(() => {
        const storedValue = sessionStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : initialValue;
    });
    useEffect(() => {
        sessionStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
};

export default function LoginForm() {
    const defaultUser = { userName: "", id: "", email: "", role: "" };
    const [theme] = useContext(DarkModeContext);
    const [show, setShow] = useState(false);
    const navigate = useNavigate();

    const [context, setContext] = useContext(Context);
    const [sessionStorageValue, setSessionStorageValue] =
        UseSessionStorage("UserData", defaultUser);

    // Inizializzo React Hook Form senza defaultValues fissi
    // perchè li gestiamo col reset dopo
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    // Ogni volta che sessionStorageValue cambia, resetto i valori del form
    useEffect(() => {
        if (sessionStorageValue)
            reset(sessionStorageValue);
    }, [sessionStorageValue, reset]);

    const goToSubscription = useCallback(() => {
        navigate("/", { replace: true });
    }, [navigate]);

    // Sincronizzo sessionStorageValue con context (attenzione: potrebbe creare loop se context cambia spesso)
    useEffect(() => {
        setSessionStorageValue(context);
    }, [context, setSessionStorageValue]);

    const reciveSubmit = useCallback(
        (data) => {
            login(data)
                .then((user) => {
                    toast.success(user.msg, {
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
                    setContext(user.user);
                    setSessionStorageValue(user.user);
                    setTimeout(() => {
                        navigate("/userPage", { replace: true });
                    }, 200);
                })
                .catch((error) => {
                    toast.error(error.message || "Errore generico", {
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
        },
        [navigate, setSessionStorageValue, setContext]
    );

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
                    borderRadius: 3,
                    boxShadow: 3,
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
                                LOGIN FORM
                            </Item>
                        </Grid>
                        <Grid item>
                            <Item>
                                <TextField
                                    fullWidth
                                    id="userName"
                                    label="UserName"
                                    variant="outlined"
                                    // NON mettere value o defaultValue, lascia gestire React Hook Form
                                    {...register("userName", { required: true })}
                                />
                                {errors.userName && (
                                    <p
                                        style={{
                                            color: theme.palette.error.main,
                                        }}
                                    >
                                        UserName is required
                                    </p>
                                )}
                            </Item>
                        </Grid>
                        <Grid item>
                            <Item>
                                <TextField
                                    fullWidth
                                    id="password"
                                    label="Password"
                                    type={show ? "text" : "password"}
                                    variant="outlined"
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
                                    slots={{ input: OutlinedInput }}
                                    slotProps={{
                                        input: {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <ShowPasswordButton show={show} setShow={setShow} />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                />
                                {errors.password?.type === "required" && (
                                    <p
                                        style={{
                                            color: theme.palette.error.main,
                                        }}
                                    >
                                        Password is required
                                    </p>
                                )}
                                {errors.password?.type === "minLength" && (
                                    <p
                                        style={{
                                            color: theme.palette.error.main,
                                        }}
                                    >
                                        Password must be at least 12 characters long
                                    </p>
                                )}
                                {errors.password?.type === "hasUpperCase" && (
                                    <p
                                        style={{
                                            color: theme.palette.error.main,
                                        }}
                                    >
                                        Password must contain at least one uppercase letter
                                    </p>
                                )}
                                {errors.password?.type === "hasLowerCase" && (
                                    <p
                                        style={{
                                            color: theme.palette.error.main,
                                        }}
                                    >
                                        Password must contain at least one lowercase letter
                                    </p>
                                )}
                                {errors.password?.type === "hasNumber" && (
                                    <p
                                        style={{
                                            color: theme.palette.error.main,
                                        }}
                                    >
                                        Password must contain at least one number
                                    </p>
                                )}
                                {errors.password?.type === "noSpaces" && (
                                    <p
                                        style={{
                                            color: theme.palette.error.main,
                                        }}
                                    >
                                        Password must not contain spaces
                                    </p>
                                )}
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
                                        padding: "16px",
                                        fontSize: "1rem",
                                        textTransform: "none",
                                        "&:hover": {
                                            backgroundColor: theme.palette.primary.light,
                                            color: theme.palette.text.primary,
                                        },
                                    }}
                                >
                                    LOGIN
                                </Button>
                            </Item>
                        </Grid>

                        <Grid item>
                            <Item
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 0.5,
                                }}
                            >
                                <span>Create an account</span>
                                <Button
                                    variant="text"
                                    onClick={goToSubscription}
                                    sx={{
                                        textTransform: "none",
                                        color: theme.palette.primary.main,
                                        "&:hover": {
                                            backgroundColor: theme.palette.action.hover,
                                        },
                                    }}
                                >
                                    HERE
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
