import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import ShowPasswordButton from "./showPasswordButton.jsx";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { updateUser } from "../services/usersService.js";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { UseSessionStorage } from "./loginGrid.jsx";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    textAlign: "left",
    boxShadow: "none",
    color: theme.palette.text.primary,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
}));

export default function UpdateUserForm() {
    const theme = useTheme();
    const navigate = useNavigate();

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);

    const [sessionStorageValue, setSessionStorageValue] =
        UseSessionStorage('UserData', { userName: "", id: "", email: "", role: "" });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            userName: sessionStorageValue.userName,
            email: sessionStorageValue.email,
            fullName: sessionStorageValue.fullName,
            password: sessionStorageValue.password,
        },
    });

    const reciveSubmit = useCallback(
        (data) => {
            const updatedData = {
                oldUserName: sessionStorageValue.userName,
                userName: data.userName || sessionStorageValue.userName,
                email: data.email || sessionStorageValue.email,
                fullName: data.fullName || sessionStorageValue.fullName,
                password: data.password || sessionStorageValue.password,
                currentPassword: data.currentPassword,
                role: sessionStorageValue.role
            };
            updateUser(updatedData)
                .then((user) => {
                    const msg = user.msg || "User updated successfully";
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
                    setSessionStorageValue(user.user);
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
        },
        [sessionStorageValue, setSessionStorageValue]
    );

    const goToLogin = () => {
        navigate("/login", { replace: true });
    };

    const goToUserPage = () => {
        navigate("/userPage", { replace: true });
    };

    const returnToGrid = useCallback(() => {
        navigate("/usersData", { replace: true });
    }, [navigate]);

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
                                UPDATING {sessionStorageValue.userName}
                            </Item>
                        </Grid>
                        <Grid item>
                            <Item>
                                <TextField
                                    fullWidth
                                    id="NewUserName"
                                    label="New UserName"
                                    variant="outlined"
                                    {...register("userName")}
                                />
                            </Item>
                        </Grid>
                        <Grid item>
                            <Item>
                                <TextField
                                    fullWidth
                                    id="NewEmail"
                                    label="New Email"
                                    variant="outlined"
                                    placeholder="email@gmail.com"
                                    {...register("email", {
                                        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    })}
                                    error={!!errors.email}
                                    helperText={errors.email ? "Invalid email format" : ""}
                                />
                            </Item>
                        </Grid>
                        <Grid item>
                            <Item>
                                <TextField
                                    fullWidth
                                    id="newFullName"
                                    label="New Full Name"
                                    variant="outlined"
                                    {...register("fullName", {
                                        pattern: /^[A-Za-z\s]+$/i,
                                    })}
                                    error={!!errors.fullName}
                                    helperText={errors.fullName ? "Alphabetical characters only" : ""}
                                />
                            </Item>
                        </Grid>
                        <Grid item>
                            <Item>
                                <TextField
                                    fullWidth
                                    id="newPassword"
                                    label="New Password"
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder={showNewPassword ? "Password1234" : "••••••••••••"}
                                    {...register("password", {
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
                                                        show={showNewPassword}
                                                        setShow={setShowNewPassword}
                                                    />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    error={!!errors.password}
                                />
                                {errors.password?.type === "minLength" && (
                                    <p style={{ color: theme.palette.error.main }}>
                                        Password must be at least 12 characters long
                                    </p>
                                )}
                                {errors.password?.type === "hasUpperCase" && (
                                    <p style={{ color: theme.palette.error.main }}>
                                        Password must contain at least one uppercase letter
                                    </p>
                                )}
                                {errors.password?.type === "hasLowerCase" && (
                                    <p style={{ color: theme.palette.error.main }}>
                                        Password must contain at least one lowercase letter
                                    </p>
                                )}
                                {errors.password?.type === "hasNumber" && (
                                    <p style={{ color: theme.palette.error.main }}>
                                        Password must contain at least one number
                                    </p>
                                )}
                                {errors.password?.type === "noSpaces" && (
                                    <p style={{ color: theme.palette.error.main }}>
                                        Password must not contain spaces
                                    </p>
                                )}
                            </Item>
                        </Grid>
                        <Grid item>
                            <Item
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 2,
                                }}
                            >
                                <span
                                    style={{
                                        color: theme.palette.text.primary,
                                        marginBottom: "8px",
                                        display: "block",
                                    }}
                                >
                                    Insert current password
                                </span>
                                <TextField
                                    fullWidth
                                    id="currentPassword"
                                    label="Current Password"
                                    type={showOldPassword ? "text" : "password"}
                                    placeholder={showOldPassword ? "Password1234" : "••••••••••••"}
                                    {...register("currentPassword", {
                                        required: true,
                                    })}
                                    slots={{
                                        input: OutlinedInput,
                                    }}
                                    slotProps={{
                                        input: {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <ShowPasswordButton
                                                        show={showOldPassword}
                                                        setShow={setShowOldPassword}
                                                    />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    error={!!errors.currentPassword}
                                    helperText={
                                        errors.currentPassword ? "Password is required" : ""
                                    }
                                />
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
                                            color: theme.palette.primary.contrastText,
                                        },
                                    }}
                                >
                                    UPDATE ACCOUNT
                                </Button>
                            </Item>
                        </Grid>
                        <Grid
                            item
                            style={{ display: sessionStorageValue.role === "manager" ? "block" : "none" }}
                        >
                            <Item>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={returnToGrid}
                                    sx={{
                                        backgroundColor: theme.palette.primary.main,
                                        color: theme.palette.primary.contrastText,
                                        border: `1px solid ${theme.palette.divider}`,
                                        padding: "16px",
                                        fontSize: "1rem",
                                        textTransform: "none",
                                        "&:hover": {
                                            backgroundColor: theme.palette.primary.light,
                                            color: theme.palette.primary.contrastText,
                                        },
                                    }}
                                >
                                    BACK TO THE GRID
                                </Button>
                            </Item>
                        </Grid>
                        <Grid container
                            spacing={2}
                            direction="row"
                            sx={{
                                width: '100%'
                            }}>
                            <Grid item
                                xs={6}
                                sx={{
                                    flexGrow: 1
                                }}>
                                <Button
                                    variant="contained"
                                    onClick={goToUserPage}
                                    fullWidth
                                    sx={{
                                        backgroundColor: theme.palette.secondary.main,
                                        color: theme.palette.secondary.contrastText,
                                        border: `1px solid ${theme.palette.divider}`,
                                        padding: "12px",
                                        fontSize: "1rem",
                                        textTransform: "none",
                                        "&:hover": {
                                            backgroundColor: theme.palette.secondary.light,
                                            color: theme.palette.secondary.contrastText,
                                        },
                                    }}
                                >
                                    BACK TO YOUR ACCOUNT
                                </Button>
                            </Grid>
                            <Grid item
                                xs={6}
                                sx={{
                                    flexGrow: 1
                                }}>
                                <Button
                                    variant="contained"
                                    onClick={goToLogin}
                                    fullWidth
                                    sx={{
                                        backgroundColor: theme.palette.secondary.main,
                                        color: theme.palette.secondary.contrastText,
                                        border: `1px solid ${theme.palette.divider}`,
                                        padding: "12px",
                                        fontSize: "1rem",
                                        textTransform: "none",
                                        "&:hover": {
                                            backgroundColor: theme.palette.secondary.light,
                                            color: theme.palette.secondary.contrastText,
                                        },
                                    }}
                                >
                                    LOGOUT
                                </Button>
                            </Grid>
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