import React, { useCallback, useContext } from "react";
import { DarkModeContext } from "../darkModeContext";
import TextField from "@mui/material/TextField";
import { useForm } from "react-hook-form";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { addPost } from "../services/postsService";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from "react-router-dom";
import { UseSessionStorage } from "./loginGrid";

export default function PostCreation() {
    const [theme] = useContext(DarkModeContext);
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();
    const [sessionStorageValue, setSessionStorageValue] =
        UseSessionStorage('UserData', { userName: "", id: "", email: "", role: "" });

    const reciveSubmit = useCallback((data) => {

        const now = new Date();
        const formatted = now.toLocaleString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
        const postData = {
            owner: sessionStorageValue?.userName,
            date: formatted,
            title: data.title,
            content: data.content,
        };
        addPost(postData)
            .then((post) => {
                toast.info(post.msg || "Post added");
                navigate("/userPage");
            })
            .catch((error) => {
                toast.error(error.message || "Errore generico");
            });
    }, [sessionStorageValue, navigate]);

    if (!sessionStorageValue || sessionStorageValue === null) {
        navigate("/login")
        return (
            <ThemeProvider theme={theme}>
                <Alert severity='error'>Cannot acces this data</Alert>
            </ThemeProvider>
        )
    }

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
            ><Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    mb: 4
                }}>
                    <div
                        style={{
                            fontSize: 28,
                            fontWeight: 'bold',
                            color: theme.palette.text.primary
                        }}>
                        Write your post here
                    </div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/userPage")}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 'bold',
                            fontSize: '1rem'
                        }}
                    >
                        My Page
                    </Button>
                </Box>
                <form onSubmit={handleSubmit(reciveSubmit)}>
                    <TextField
                        fullWidth
                        id="title"
                        label="Post title"
                        variant="outlined"
                        {...register("title", { required: true })}
                        sx={{ marginBottom: 3 }}
                    />

                    <Box
                        sx={{
                            position: "relative"
                        }}>
                        <TextField
                            fullWidth
                            id="content"
                            label="Post content"
                            variant="outlined"
                            multiline
                            minRows={6}
                            {...register("content", { required: true })}
                            slotProps={{
                                input: {
                                    sx: {
                                        paddingBottom: "48px",
                                    }
                                }
                            }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            endIcon={<SendIcon />}
                            sx={{
                                position: "absolute",
                                bottom: 8,
                                right: 8,
                                padding: "6px 12px",
                                textTransform: "none",
                                fontSize: "0.875rem",
                                backgroundColor: theme.palette.primary.main,
                                color: theme.palette.primary.contrastText,
                                "&:hover": {
                                    backgroundColor: theme.palette.primary.dark,
                                },
                            }}
                        >
                            Post
                        </Button>
                    </Box>
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