import * as React from 'react';
import Box from '@mui/material/Box';
import { styled, ThemeProvider } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Home from '@mui/icons-material/Home';
import AccountCircle from '@mui/icons-material/AccountCircle';
import DarkMode from '@mui/icons-material/DarkMode';
import LightMode from '@mui/icons-material/LightMode';
import { useNavigate } from 'react-router-dom';
import { changeReplyStatus, deletePost, deleteReply, usePostsByOwner } from '../services/postsService';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { DarkModeContext } from '../darkModeContext';
import { darkTheme, lightTheme } from '../theme';
import Logout from '@mui/icons-material/LogOut'
import PostAddIcon from '@mui/icons-material/PostAdd';
import ViewListIcon from '@mui/icons-material/ViewList';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import { UseSessionStorage } from './loginGrid';
import DeleteIcon from '@mui/icons-material/Delete';
import { checkIfLiked, deleteUser, dislikePost, likePost } from '../services/usersService';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import { Context } from '../context';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DangerousIcon from '@mui/icons-material/Dangerous';
import VisibilityIcon from '@mui/icons-material/Visibility';
import HistoryIcon from '@mui/icons-material/History';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

const FireNav = styled(List)({
    '& .MuiListItemButton-root': {
        paddingLeft: 24,
        paddingRight: 24,
    },
    '& .MuiListItemIcon-root': {
        minWidth: 0,
        marginRight: 16,
    },
    '& .MuiSvgIcon-root': {
        fontSize: 20,
    },
});

export default function UserPage() {
    const [open, setOpen] = React.useState(true);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [darkModeContext, setdarkModeContext] = React.useContext(DarkModeContext);
    const [isDarkMode, setIsDarkMode] = React.useState(darkModeContext.palette.mode === 'dark');
    const [expandedPosts, setExpandedPosts] = React.useState({});
    const [idToDelete, setIdToDelete] = React.useState(null);
    const [search, setSearch] = React.useState("")
    const [openConfirm, setOpenConfirm] = React.useState(false);
    const [postIdToDelete, setPostIdToDelete] = React.useState(null);

    // const [posts, setPosts] = React.useState([{
    //     id: "",
    //     author: '',
    //     date: '',
    //     title: '',
    //     content: ''
    // }]);
    const navigate = useNavigate();
    const [sessionStorageValue] =
        UseSessionStorage('UserData', { userName: "", id: "", email: "", role: "" });
    const [context, setContext] = React.useContext(Context)
    const [isLiked, setIsLiked] = React.useState({});

    const { userName, id: userId } = sessionStorageValue;
    const request = { owner: userName };
    const { data, mutate, isError, isLoading } = usePostsByOwner(request);

    const posts = React.useMemo(() => {
        return data?.post
    }, [data?.post]);

    // Sets the search value to whatever is typed in the text field
    const handleChange = (event) => {
        setSearch(event.target.value);
    };

    // Toggles between dark and light theme
    const toggleThemeIcon = () => {
        const nextIsDark = !isDarkMode;
        setIsDarkMode(nextIsDark);
        setdarkModeContext(nextIsDark ? darkTheme : lightTheme);
    };

    // Navigates to the login page
    const goToLogin = () => {
        navigate("/login");
    };

    // Navigates to the page displaying all users' fetchData
    const editAll = () => {
        setOpen(false);
        navigate("/usersData", { replace: true });
    };

    // Navigates to the page for editing the user's own account
    const editSelf = () => {
        setOpen(false);
        navigate("/updateUser", { replace: true });
    };

    // Navigates to the post creation page
    const goToPostPage = () => {
        setOpen(false);
        navigate("/post", { replace: true });
    };

    const goToRepliesHistory = () => {
        setOpen(false);
        navigate("/repliesHistory", { replace: true });
    };

    const goToLikedPage = () => {
        setOpen(false);
        navigate("/allLiked", { replace: true });
    };

    // Navigates to the page displaying all posts
    const goToHomePage = () => {
        setOpen(false);
        navigate("/homePage", { replace: true });
    };

    // Stores the ID of the user to be deleted and opens the confirmation dialog
    const handleClickOpen = React.useCallback((id) => {
        setIdToDelete(id);
        setDialogOpen(true);
    }, []);

    // Closes the confirmation dialog and resets the ID of the user to be deleted
    const handleClose = () => {
        setDialogOpen(false);
        setIdToDelete(null);
    };

    // Defines the icon list for the options menu
    const fetchData = [
        { icon: <EditIcon />, label: 'Edit account', onClick: editSelf },
        { icon: <ViewListIcon />, label: 'Edit all accounts', onClick: editAll },
        { icon: <PostAddIcon />, label: 'Post something', onClick: goToPostPage },
        { icon: <FavoriteIcon />, label: 'See liked posts', onClick: goToLikedPage },
        { icon: <HistoryIcon />, label: 'Replies history', onClick: goToRepliesHistory },
        { icon: <Logout />, label: 'Logout', onClick: goToLogin },
        { icon: <DeleteIcon />, label: 'Delete account', onClick: () => handleClickOpen(sessionStorageValue?.id) }
    ];

    // Filters out the "Edit all accounts" option if the user is not a manager
    const filteredData = fetchData.filter(item => {
        if (item.label === 'Edit all accounts') {
            return sessionStorageValue?.role === 'manager';
        }
        return true;
    });

    // Navigates to the reply page for a specific post
    const goToReply = (id) => {
        const url = "/reply/" + id;
        navigate(url, { replace: true });
    };
    // Initializes the isLiked state for all the posts and replies
    const initializeIsLiked = async (userId, posts) => {
        const tempIsLiked = {};

        for (const post of posts) {
            try {
                const fetchData = {
                    userId: userId,
                    postId: post.id
                };

                const status = await checkIfLiked(fetchData);
                tempIsLiked[post.id] = status.state;

                for (const reply of post.reply) {
                    try {
                        const fetchData = {
                            userId: userId,
                            postId: reply.id
                        };

                        const status = await checkIfLiked(fetchData);
                        tempIsLiked[reply.id] = status.state;

                    } catch (err) {
                        console.error("Error while checking", reply.id, err);
                        tempIsLiked[reply.id] = false;
                    }
                }

            } catch (err) {
                console.error("Error while checking", post.id, err);
                tempIsLiked[post.id] = false;
            }
        }
        setIsLiked(tempIsLiked);
    };
    ;





    // Loads user posts when the page is first rendered or when the theme changes
    React.useEffect(() => {

        setdarkModeContext(isDarkMode ? darkTheme : lightTheme);

        initializeIsLiked(userId, data?.post);

    }, [isDarkMode, userId, setdarkModeContext, data?.post]);


    // Defines the defaul user needed if the user deletes the account
    const defaultUser = {
        userName: "",
        id: "",
        email: "",
        role: ""
    };

    // Deletes the current user when the corresponding dialog button is pressed
    const handleConfirmDelete = () => {
        if (idToDelete === null) return;

        setOpen(false);

        deleteUser(idToDelete) // Sends a request to delete the user
            .then((msg) => {
                toast.success(msg, {
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
                setContext(defaultUser); // Resets the user context to default, clearing session storage when navigating to the login page
                navigate("/login");
            })
            .catch((error) => {
                toast.error("Error during fetchData gathering");
                console.error(error);
            });

        setIdToDelete(null);
    };

    // Sets the ID of the post to be deleted and opens the confirmation dialog
    const confirmDelete = (id) => {
        setPostIdToDelete(id);
        setOpenConfirm(true);
    }

    // Deletes the selected post when the corresponding dialog button is pressed
    const handleDelete = React.useCallback(() => {
        if (!postIdToDelete) return;

        const fetchData = {
            owner: userName,
            id: postIdToDelete
        };

        deletePost(fetchData)
            .then((response) => {
                toast.success(response.msg, {
                    position: "top-right",
                    autoClose: 5000,
                    theme: "colored",
                    transition: Bounce,
                });
                mutate(); // Updates the posts list with the newly fetched one
            })
            .catch((error) => {
                console.error(error);
                toast.error(error);
            })
            .finally(() => {
                // Closes the confirmation dialog and resets the post ID
                setOpenConfirm(false);
                setPostIdToDelete(null);
            });
    }, [mutate, postIdToDelete, userName]);

    // Changes the visibility status of a reply
    const changeVisibility = React.useCallback((id, owner) => {
        const fetchData = {
            id: id,
            owner: owner
        }
        changeReplyStatus(fetchData)
            .then((response) => {
                toast.success(response.msg, {
                    position: "top-right",
                    autoClose: 5000,
                    theme: "colored",
                    transition: Bounce,
                });
                mutate(); // Updates the posts list with the newly fetched one
            })
            .catch((error) => {
                console.error(error);
                toast.error(error);
            })
    }, [mutate])

    // deletes the selected reoky
    const removeReply = React.useCallback((id, owner) => {
        const fetchData = {
            id: id,
            owner: owner,
            pageName: "userPage"
        }
        deleteReply(fetchData)
            .then((response) => {
                toast.success(response.msg, {
                    position: "top-right",
                    autoClose: 5000,
                    theme: "colored",
                    transition: Bounce,
                });
                mutate(); // Updates the posts list with the newly fetched one
            })
            .catch((error) => {
                console.error(error);
                toast.error(error);
            })
    }, [mutate])

    const like = React.useCallback((postId) => {
        // Logica per aggiungere like al post
        setIsLiked(prev => ({ ...prev, [postId]: true }));
        const fetchData = {
            userId: sessionStorageValue.id,
            postId: postId
        }
        likePost(fetchData)
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
    }, [mutate, sessionStorageValue.id])

    const dislike = React.useCallback((postId) => {
        // Logica per aggiungere like al post
        setIsLiked(prev => ({ ...prev, [postId]: false }));
        const fetchData = {
            userId: sessionStorageValue.id,
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
    }, [mutate, sessionStorageValue.id])


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
        // Sets the theme based on the current context
        <ThemeProvider theme={darkModeContext}>
            {/* Main container for the entire UI */}
            <Box
                sx={{
                    display: 'flex',
                    height: '100vh',
                    width: '100vw'
                }}>
                <Paper
                    elevation={0}
                    sx={{
                        width: 400,
                        height: '100%'
                    }}>
                    {/* Custom side menu */}
                    <FireNav
                        component="nav"
                        disablePadding>
                        {/* Top part of the menu displaying the username */}
                        <ListItemButton
                            component="a"
                            href="#customized-list">
                            <ListItemIcon
                                sx={{
                                    fontSize: 20
                                }}>
                                <AccountCircle
                                    style={{
                                        scale: "150%"
                                    }} />
                            </ListItemIcon>
                            <ListItemText
                                sx={{
                                    my: 0
                                }}
                                primary={userName || 'User'}
                                slotProps={{
                                    primary: {
                                        fontSize: 20,
                                        fontWeight: 'medium',
                                        letterSpacing: 0,
                                    }
                                }}
                            />
                        </ListItemButton>
                        <Divider />
                        {/* Button to navigate to the home page */}
                        <ListItem
                            component="div"
                            disablePadding>
                            <ListItemButton
                                sx={{
                                    height: 56
                                }}
                                onClick={goToHomePage}>
                                <ListItemIcon>
                                    <Home color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Home page"
                                    slotProps={{
                                        primary: {
                                            color: 'primary',
                                            fontWeight: 'medium',
                                            variant: 'body2',
                                        }
                                    }}
                                />
                            </ListItemButton>
                            {/* Icon for toggling between dark and light mode */}
                            <Tooltip title={isDarkMode ? "Dark Mode" : "Light Mode"}>
                                <IconButton
                                    size="large"
                                    onClick={toggleThemeIcon}
                                    sx={{
                                        position: 'relative',
                                        width: 40,
                                        height: 40,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        '& .dark-icon, & .light-icon': {
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            transition: 'opacity 0.3s ease',
                                        },
                                        '& .dark-icon': {
                                            opacity: isDarkMode ? 1 : 0,
                                        },
                                        '& .light-icon': {
                                            opacity: isDarkMode ? 0 : 1,
                                        },
                                    }}
                                >
                                    <DarkMode className="dark-icon" />
                                    <LightMode className="light-icon" />
                                </IconButton>
                            </Tooltip>
                        </ListItem>
                        <Divider />
                        {/* Box containing the options in the side menu */}
                        <Box
                            sx={{
                                bgcolor: open ? darkModeContext.palette.text.tertiary : null,
                                pb: open ? 2 : 0,
                            }}
                        >
                            {/* Toggle button that opens or closes the options list */}
                            <ListItemButton
                                alignItems="flex-start"
                                onClick={() => setOpen(!open)}
                                sx={{
                                    px: 3,
                                    pt: 2.5,
                                    pb: open ? 0 : 2.5,
                                }}
                            >
                                {/* Menu title with description and dynamic color based on open state */}
                                <ListItemText
                                    primary="Options"
                                    secondary="Edit account, Post something, Logout"
                                    slotProps={{
                                        primary: {
                                            fontSize: 15,
                                            fontWeight: 'medium',
                                            lineHeight: '20px',
                                            mb: '2px',
                                        },
                                        secondary: {
                                            noWrap: true,
                                            fontSize: 12,
                                            lineHeight: '16px',
                                            color: open
                                                ? 'rgba(0,0,0,0)'
                                                : darkModeContext.palette.primary,
                                        }
                                    }}
                                    sx={{ my: 0 }}
                                />
                                {/* List of all options with their icons and onClick handlers */}
                            </ListItemButton>
                            {open && filteredData.map((item) => (
                                <ListItemButton
                                    key={item.label}
                                    onClick={item.onClick}
                                    sx={{
                                        py: 0,
                                        minHeight: 32,
                                        color: darkModeContext.palette.primary,
                                    }}
                                >
                                    <ListItemIcon sx={{ color: 'inherit' }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.label}
                                        slotProps={{
                                            primary: {
                                                fontSize: 14,
                                                fontWeight: 'medium'
                                            }
                                        }}
                                    />
                                </ListItemButton>
                            ))}
                        </Box>
                    </FireNav>
                </Paper>
                {/* Box containing the right section of the UI */}
                <Box
                    sx={{
                        flex: 1,
                        bgcolor: darkModeContext.palette.background.default,
                        color: darkModeContext.palette.text.primary,
                        p: 4,
                        overflow: 'auto'
                    }}
                >
                    {/* Greeting text displayed at the top */}
                    <h1>
                        Hi, {userName || 'user'}!
                    </h1>
                    <h2>
                        Here are all your posts
                    </h2>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 24,
                            padding: 20
                        }}>
                        {/* Container box for the search text field */}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '100%',
                                mb: 4
                            }}>
                            {/* Search text field with a lens icon at the end, updates search state on change */}
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
                            />
                            {/* Container for the grid displaying all user posts */}
                        </Box>
                        {posts.map(post => (
                            {/* Grid item for each post, filtered based on the search text */ },
                            < Grid
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
                                            post.title.toLowerCase().includes(search.toLowerCase()) ||
                                            post.reply.some((r) => (r.content.toLowerCase().includes(search.toLowerCase())))
                                            ? "flex" : "none"
                                }}
                            >
                                {/* Container for the post's owner and date */}
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
                                {/* Container for the post's title */}
                                <Box
                                    sx={{
                                        fontSize: 20,
                                        fontWeight: '700',
                                        mb: 1
                                    }}>
                                    {post.title}
                                </Box>
                                {/* Container for the post's content */}
                                <Box
                                    sx={{
                                        fontSize: 16,
                                        color: darkModeContext.palette.text.primary,
                                        mb: 2
                                    }}>
                                    {post.content}
                                </Box>
                                {/* Container for the post's likes that change depending on the isLiked state */}
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
                                {/* Container for replies toggle, reply button, delete button, and replies list */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2
                                    }}>
                                    {/* Container for replies toggle and reply button */}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: 2
                                        }}>
                                        {/* Button toggling the visibility of replies */}
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
                                            {/* Text changes based on replies visibility state */}
                                            {expandedPosts[post.id] ? "Hide replies" : "See replies"}
                                        </button>
                                        {/* Button to navigate to the reply page with the post's ID */}
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
                                        {/* Button to open delete confirmation for the post */}
                                        <button
                                            onClick={() => confirmDelete(post.id)}
                                            style={{
                                                cursor: 'pointer',
                                                padding: '8px 12px',
                                                borderRadius: 4,
                                                border: `1px solid ${darkModeContext.palette.primary.main}`,
                                                backgroundColor: 'transparent',
                                                color: darkModeContext.palette.primary.main,
                                                fontWeight: '600',
                                                display: 'flex',
                                                alignItems: 'center',
                                                marginLeft: 'auto',
                                            }}
                                        >
                                            Delete post
                                            <RemoveCircleIcon style={{ marginLeft: 8 }} />
                                        </button>
                                    </Box>
                                    {/* If the post is expanded and has a non-empty reply array, creates a container for the replies grid */}
                                    {expandedPosts[post.id] && Array.isArray(post.reply) && post.reply.length > 0 && (
                                        <Grid container
                                            direction="column"
                                            spacing={2}
                                            sx={{ mt: 2 }}>
                                            {/* Maps over the reply array to render each reply */}
                                            {post.reply.map((r, idx) => (
                                                <Grid
                                                    item key={idx}
                                                    sx={{
                                                        p: 2,
                                                        border: `1px solid ${darkModeContext.palette.divider}`,
                                                        borderRadius: 2,
                                                        backgroundColor: darkModeContext.palette.background.default,
                                                    }}>
                                                    {/* Container for the reply's owner */}
                                                    <Box sx={{ fontWeight: 'bold', mb: 1 }}>
                                                        {r.owner}
                                                    </Box>
                                                    {/* Container for the reply's date */}
                                                    <Box
                                                        sx={{
                                                            fontSize: 12,
                                                            color: darkModeContext.palette.text.secondary,
                                                            mb: 1
                                                        }}>
                                                        {r.date}
                                                    </Box>
                                                    {/* Container for the reply's content that canghes depending on the isHideen property */}
                                                    <Box>{r.isHidden ? (
                                                        <Box style={{ display: 'flex', alignItems: 'center' }}>
                                                            <DangerousIcon style={{ marginRight: 8 }} />
                                                            This reply was hidden by the post owner
                                                        </Box>
                                                    ) : r.content}</Box>
                                                    {/* Container for the post's likes that change depending on the isLiked state */}
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
                                                    {/* Container for the hide reply and delete reaply buttons */}
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            flexDirection: 'row',
                                                            gap: 2
                                                        }}>
                                                        {/* Button to hide the selected reply that canghes depending on the isHideen property */}
                                                        <button
                                                            style={{
                                                                cursor: 'pointer',
                                                                padding: '8px 12px',
                                                                borderRadius: 4,
                                                                border: `1px solid ${darkModeContext.palette.primary.main}`,
                                                                backgroundColor: 'transparent',
                                                                color: darkModeContext.palette.primary.main,
                                                                fontWeight: '600',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                marginLeft: 'auto',
                                                            }}
                                                            onClick={() => changeVisibility(r.id, post.owner)}
                                                        >
                                                            {r.isHidden ? (
                                                                <>
                                                                    Show reply <VisibilityIcon style={{ marginLeft: 8 }} />
                                                                </>
                                                            ) : (
                                                                <>
                                                                    Hide reply <VisibilityOffIcon style={{ marginLeft: 8 }} />
                                                                </>
                                                            )}
                                                        </button>
                                                        {/* Button to delete the selected reply */}
                                                        <button
                                                            style={{
                                                                cursor: 'pointer',
                                                                padding: '8px 12px',
                                                                borderRadius: 4,
                                                                border: `1px solid ${darkModeContext.palette.primary.main}`,
                                                                backgroundColor: 'transparent',
                                                                color: darkModeContext.palette.primary.main,
                                                                fontWeight: '600',
                                                                display: r.owner === userName ? 'flex' : "none",
                                                                alignItems: 'center',
                                                                marginLeft: 'auto',
                                                                margin: 2
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
                    </div>
                </Box>
                {/* Container for the toast messages*/}
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
                {/* Dialog for account deletion*/}
                <Dialog
                    open={dialogOpen}
                    onClose={handleClose}
                    aria-labelledby="Delete aler"
                    aria-describedby="Delete aler-description"
                >
                    <DialogTitle id="Delete aler">
                        {"Delete alert"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="Delete aler-description">
                            You are going to permanently delete this user account.
                            Are you sure?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            I changed my mind
                        </Button>
                        <Button onClick={handleConfirmDelete} color="error" autoFocus>
                            Delete account
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Dialog for post deletion*/}
                <Dialog
                    open={openConfirm}
                    onClose={() => setOpenConfirm(false)}
                    aria-labelledby="DeletePost aler"
                    aria-describedby="DeletePost aler-description"
                >
                    <DialogTitle id="DeletePost aler">
                        {"Confirm post deletion"}
                    </DialogTitle>
                    <DialogContent>
                        You are going to permanently delete this post.
                        Are you sure?
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenConfirm(false)} color="primary">
                            I changed my mind
                        </Button>
                        <Button onClick={handleDelete} color="error" autoFocus>
                            Delete post
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </ThemeProvider >
    );
}