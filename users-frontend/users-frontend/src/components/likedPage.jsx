import * as React from 'react';
import { deleteReply, useAllLiked } from '../services/postsService';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { DarkModeContext } from '../darkModeContext';
import Box from '@mui/material/Box';
import { ThemeProvider } from '@emotion/react';
import { Grid } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import OutlinedInput from '@mui/material/OutlinedInput';
import { UseSessionStorage } from './loginGrid';
import DeleteIcon from '@mui/icons-material/Delete';
import DangerousIcon from '@mui/icons-material/Dangerous';
import { checkIfLiked, dislikePost, likePost } from '../services/usersService';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

async function initializeIsLiked(userId, posts) {
    const tempIsLiked = {};
    const allIds = new Set();

    posts.forEach(post => {
        allIds.add(post.id);
        if (Array.isArray(post.reply)) {
            post.reply.forEach(reply => allIds.add(reply.id));
        }
    });

    for (const id of allIds) {
        try {
            const postStatus = await checkIfLiked({ userId, postId: id });
            tempIsLiked[id] = postStatus.state;
        } catch {
            tempIsLiked[id] = false;
        }
    }

    return (tempIsLiked);

};


export default function LikedPage() {
    const [darkModeContext] = React.useContext(DarkModeContext);
    const [expandedPosts, setExpandedPosts] = React.useState({});
    const [isLiked, setIsLiked] = React.useState({});
    const navigate = useNavigate();
    const [search, setSearch] = React.useState("")
    const [sessionStorageValue] =
        UseSessionStorage('UserData', { userName: "", id: "", email: "", role: "" });

    const handleChange = (event) => {
        setSearch(event.target.value);
    };

    const goToReply = (id) => {
        let url = "/reply/" + id;
        console.log(url);
        navigate(url);
    };

    const { id: userId } = sessionStorageValue;

    const { data, mutate, isError, isLoading } = useAllLiked(userId);

    const posts = React.useMemo(() => {
        return data?.posts
    }, [data?.posts]);

    React.useEffect(() => {
        initializeIsLiked(userId, posts)
            .then((isLiked) => {
                setIsLiked(isLiked);
            })
            .catch(() => {
                setIsLiked(false);
            });
    }, [userId, posts]);

    const like = React.useCallback((postId) => {
        setIsLiked(prev => ({ ...prev, [postId]: true }));
        const fetchData = {
            userId: userId,
            postId: postId
        }
        likePost(fetchData)
            .then((response) => {
                mutate()
                toast.success(response.msg, {
                    position: "top-right",
                    autoClose: 5000,
                    theme: "colored",
                    transition: Bounce,
                });
            })
            .catch((error) => {
                console.error(error);
                toast.error(error);
            })
    }, [userId, mutate])

    const dislike = React.useCallback((postId) => {
        setIsLiked(prev => ({ ...prev, [postId]: false }));
        const fetchData = {
            userId: userId,
            postId: postId
        }
        dislikePost(fetchData)
            .then((response) => {
                mutate();
                toast.success(response.msg, {
                    position: "top-right",
                    autoClose: 5000,
                    theme: "colored",
                    transition: Bounce,
                });
            })
            .catch((error) => {
                console.error(error);
                toast.error(error);
            })
    }, [mutate, userId])


    const removeReply = React.useCallback((id, owner) => {
        const data = {
            id: id,
            owner: owner,
            pageName: "homePage"
        }
        deleteReply(data)
            .then((response) => {
                toast.success(response.msg, {
                    position: "top-right",
                    autoClose: 5000,
                    theme: "colored",
                    transition: Bounce,
                });
                mutate();
            })
            .catch((error) => {
                console.error(error);
                toast.error(error);
            })
    }, [mutate])

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
                    width: '100vw',
                    minHeight: '100vh',
                    py: 4,
                    px: 2,
                    overflowX: 'hidden',
                    justifyContent: 'center',
                }}
            >
                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    spacing={5}
                    sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}
                >

                    <Grid item sx={{ width: '100%' }}>
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
                                All the posts you liked
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
                    </Grid>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                            mb: 4
                        }}>
                        <TextField
                            onChange={handleChange}
                            placeholder='Search...'
                            overflow="auto"
                            slots={{
                                input: OutlinedInput
                            }}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <SearchIcon />
                                        </InputAdornment>
                                    )
                                }
                            }}
                        >
                        </TextField>
                    </Box>
                    {posts.map(post => (
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
                                flexDirection: 'column',
                                color: darkModeContext.palette.text.primary,
                                display:
                                    !search ||
                                        post.owner.toLowerCase().includes(search.toLowerCase()) ||
                                        post.content.toLowerCase().includes(search.toLowerCase()) ||
                                        post?.title?.toLowerCase()?.includes(search.toLowerCase()) ||
                                        post?.reply?.some((r) => (r.content.toLowerCase().includes(search.toLowerCase())))
                                        ? "flex" : "none"
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    mb: 1, fontSize: 14,
                                    color: darkModeContext.palette.text.secondary,
                                    fontWeight: 500
                                }}>
                                <div>{post.owner}</div>
                                <div style={{
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
                                {post.title ? post.title : "reply"}
                            </Box>

                            <Box
                                sx={{
                                    fontSize: 16,
                                    color: darkModeContext.palette.text.primary,
                                    mb: 2
                                }}>
                                {post.content}
                            </Box>
                            <Box
                                sx={{
                                    fontSize: 16,
                                    color: darkModeContext.palette.text.primary,
                                    mb: 2,
                                    display: "flex"
                                }}
                            >
                                {post.likes} {isLiked[post.id] ? (
                                    <FavoriteIcon
                                        onClick={() => dislike(post.id)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                ) : (
                                    <FavoriteBorderIcon
                                        onClick={() => like(post.id)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                )}
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2
                                }}>
                                <Box
                                    sx={{
                                        display: post.title ? "flex" : "none",
                                        gap: 2
                                    }}>
                                    <button
                                        onClick={() => setExpandedPosts(prev => ({
                                            ...prev,
                                            [post.id]: !prev[post.id]
                                        }))}
                                        style={{
                                            cursor: 'pointer',
                                            padding: '8px 12px',
                                            borderRadius: 4,
                                            border: `1px solid ${darkModeContext.palette.primary.main}`,
                                            backgroundColor: darkModeContext.palette.primary.main,
                                            color: darkModeContext.palette.primary.contrastText,
                                            fontWeight: '600',
                                        }}
                                    >
                                        {expandedPosts[post.id] ? "Hide replies" : "See replies"}
                                    </button>

                                    <button
                                        onClick={() => goToReply(post.id)}
                                        style={{
                                            cursor: 'pointer',
                                            padding: '8px 12px',
                                            borderRadius: 4,
                                            border: `1px solid ${darkModeContext.palette.primary.main}`,
                                            backgroundColor: 'transparent',
                                            color: darkModeContext.palette.primary.main,
                                            fontWeight: '600',
                                        }}
                                    >
                                        Reply
                                    </button>
                                </Box>
                                {expandedPosts[post.id] && Array.isArray(post.reply) && post.reply.length > 0 && (
                                    <Grid container
                                        direction="column"
                                        spacing={2}
                                        sx={{
                                            mt: 2
                                        }}>
                                        {post.reply.map((r, idx) => (
                                            <Grid
                                                item key={idx}
                                                sx={{
                                                    p: 2,
                                                    border: `1px solid ${darkModeContext.palette.divider}`,
                                                    borderRadius: 2,
                                                    backgroundColor: darkModeContext.palette.background.default,
                                                }}>
                                                <Box
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        mb: 1
                                                    }}>{r.owner}
                                                </Box>
                                                <Box
                                                    sx={{
                                                        fontSize: 12,
                                                        color: darkModeContext.palette.text.secondary,
                                                        mb: 1
                                                    }}>
                                                    {r.date}
                                                </Box>
                                                <Box>
                                                    {r.isHidden ? (
                                                        <Box style={{ display: 'flex', alignItems: 'center' }}>
                                                            <DangerousIcon style={{ marginRight: 8 }} />
                                                            This reply was hidden by the post owner
                                                        </Box>
                                                    ) : r.content}
                                                </Box>
                                                <Box
                                                    sx={{
                                                        fontSize: 16,
                                                        color: darkModeContext.palette.text.primary,
                                                        mb: 2,
                                                        display: "flex"
                                                    }}
                                                >
                                                    {r.likes} {isLiked[r.id] ? (
                                                        <FavoriteIcon
                                                            onClick={() => dislike(r.id)}
                                                            style={{ cursor: 'pointer' }}
                                                        />
                                                    ) : (
                                                        <FavoriteBorderIcon
                                                            onClick={() => like(r.id)}
                                                            style={{ cursor: 'pointer' }}
                                                        />
                                                    )}
                                                </Box>
                                                {/* Button to delete the selected reply */}
                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                                    <button
                                                        style={{
                                                            cursor: 'pointer',
                                                            padding: '8px 12px',
                                                            borderRadius: 4,
                                                            border: `1px solid ${darkModeContext.palette.primary.main}`,
                                                            backgroundColor: 'transparent',
                                                            color: darkModeContext.palette.primary.main,
                                                            fontWeight: '600',
                                                            display: r.owner === sessionStorageValue.userName ? 'flex' : 'none',
                                                            alignItems: 'center',
                                                        }}
                                                        onClick={() => removeReply(r.id, post.owner)}
                                                    >
                                                        Delete reply <DeleteIcon style={{ marginLeft: 8 }} />
                                                    </button>
                                                </Box>

                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box >
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
        </ThemeProvider >
    );
}