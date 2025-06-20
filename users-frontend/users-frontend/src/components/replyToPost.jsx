import * as React from 'react';
import { addReply, usePostById } from '../services/postsService';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { DarkModeContext } from '../darkModeContext';
import Box from '@mui/material/Box';
import { ThemeProvider } from '@emotion/react';
import { Grid } from '@mui/system';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import { UseSessionStorage } from './loginGrid';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

export default function Reply() {
    const [darkModeContext] = React.useContext(DarkModeContext);
    const navigate = useNavigate();
    const { id } = useParams();
    const { register, handleSubmit } = useForm();
    const [sessionStorageValue] =
        UseSessionStorage('UserData', 'default');

    const { data, isError, isLoading } = usePostById(id);

    const post = React.useMemo(() => {
        return data?.post
    }, [data?.post]);


    const receiveSubmit = React.useCallback((data) => {
        const now = new Date();
        const formatted = now.toLocaleString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
        const replyData = {
            owner: sessionStorageValue.userName,
            date: formatted,
            content: data.content,
        };
        addReply(replyData, id)
            .then((res) => {
                toast.info(res.msg || "Reply added");
                navigate("/userPage", { replace: true });
            })
            .catch((error) => {
                toast.error(error.message || "Errore generico");
            });
    }, [sessionStorageValue, navigate, id]);

    if (isError) {
        return (
            <ThemeProvider theme={darkModeContext}>
                <Alert severity='error'>Failed to load posts.</Alert>
            </ThemeProvider>
        )
    }

    if (isLoading) {
        return (
            <ThemeProvider theme={darkModeContext}>
                <CircularProgress />
            </ThemeProvider>
        )
    }


    return (
        <ThemeProvider theme={darkModeContext}>
            <Box
                sx={{
                    bgcolor: darkModeContext.palette.background.default,
                    color: darkModeContext.palette.text.primary,
                    p: 4,
                    width: '100vw',
                    height: '100vh',
                    overflow: 'auto',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    spacing={5}
                    sx={{
                        width: '100%',
                        maxWidth: 1200
                    }}
                >
                    <Box
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
                                fontWeight: 'bold'
                            }}>
                            Reply to Post
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

                    {post && (
                        <Grid
                            item
                            key={post.id}
                            sx={{
                                border: `1px solid ${darkModeContext.palette.divider}`,
                                borderRadius: 2,
                                padding: 3,
                                boxShadow: darkModeContext.shadows[1],
                                backgroundColor: darkModeContext.palette.background.paper,
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                color: darkModeContext.palette.text.primary,
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    mb: 1,
                                    fontSize: 14,
                                    color: darkModeContext.palette.text.secondary,
                                    fontWeight: 500
                                }}>
                                <div>
                                    {post.owner}
                                </div>
                                <div
                                    style={{
                                        fontSize: 12,
                                        color: darkModeContext.palette.text.disabled
                                    }}>
                                    {post.date}
                                </div>
                            </Box>
                            <Box
                                sx={{
                                    fontSize: 20,
                                    fontWeight: '700',
                                    mb: 1
                                }}>
                                {post.title}
                            </Box>
                            <Box
                                sx={{
                                    fontSize: 16,
                                    color: darkModeContext.palette.text.primary,
                                    mb: 2
                                }}>
                                {post.content}
                            </Box>
                        </Grid>
                    )}
                    <form onSubmit={handleSubmit(receiveSubmit)} style={{ width: '100%' }}>
                        <TextField
                            fullWidth
                            id="content"
                            label="Write your reply"
                            variant="outlined"
                            multiline
                            minRows={6}
                            {...register("content", { required: true })}
                            sx={{ mb: 3 }}
                        />
                        <Box sx={{ textAlign: 'right' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                endIcon={<SendIcon />}
                                sx={{
                                    textTransform: "none",
                                    fontSize: "0.875rem",
                                    backgroundColor: darkModeContext.palette.primary.main,
                                    color: darkModeContext.palette.primary.contrastText,
                                    "&:hover": {
                                        backgroundColor: darkModeContext.palette.primary.dark,
                                    },
                                }}
                            >
                                Send
                            </Button>
                        </Box>
                    </form>
                </Grid>
            </Box>
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
        </ThemeProvider>
    );
}