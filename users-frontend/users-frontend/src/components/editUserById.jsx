import { useContext, useEffect } from "react";
import { getUserById, managerUpdate } from "../services/usersService.js";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import ShowPasswordButton from "./showPasswordButton.jsx"
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Bounce, toast, ToastContainer } from "react-toastify"
import { useParams } from "react-router-dom";
import { DarkModeContext } from "../darkModeContext.js";



const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    textAlign: "left",
    boxShadow: "none",
    color: theme.palette.text.primary,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
}));

export default function EditUserForm() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [user, setUser] = useState({
        userName: "",
        email: "",
        fullName: "",
        role: ""
    })

    const [theme] = useContext(DarkModeContext);
    const goToUserPage = () => {
        navigate("/userPage", { replace: true });
    };


    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm();

    useEffect(() => {
        if (!user?.id || user?.id !== id) {
            console.log(id);
            getUserById(id)
                .then((userData) => {
                    toast.success(userData.msg || "User data loaded", {
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

                    setUser(userData.user);
                    setValue("userName", userData.user.userName);
                    setValue("email", userData.user.email);
                    setValue("fullName", userData.user.fullName);
                    setValue("role", userData.user.role);
                })
                .catch((error) => {
                    toast.error("Error during data gathering");
                    console.error(error);
                });
        }
    }, [id, setValue, user?.id]);


    const reciveSubmit = useCallback((data) => {
        const updatedData = {
            oldUserName: user.userName,
            userName: data.userName || user.userName,
            email: data.email || user.email,
            fullName: data.fullName || user.fullName,
            password: data.password
        };
        console.log(updatedData)
        managerUpdate(updatedData)
            .then((userUpdated) => {
                const msg = userUpdated.msg || "User updated successfully";
                const userName = userUpdated.user?.userName || "";
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

                setUser(userUpdated.user);
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
            })
    }, [user.userName, user.email, user.fullName]);

    const goToLogin = () => {
        navigate("/login", { replace: true });
    };

    const returnToGrid = useCallback(() => {
        navigate(("/usersData"), { replace: true });
    }, [navigate])

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
                                UPDATING {user.userName}
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
                            <Item>
                                <TextField
                                    fullWidth
                                    id="role"
                                    label="New role"
                                    variant="outlined"
                                    {...register("role",)}
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
                        <Item>
                            <Grid item>
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
                        </Item>
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
        </Box >
    )
}