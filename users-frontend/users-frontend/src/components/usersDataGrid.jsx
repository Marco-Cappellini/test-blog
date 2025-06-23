import Box from "@mui/material/Box";
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Bounce, toast, ToastContainer } from "react-toastify";
import { deleteUser, useAllUsers } from "../services/usersService";
import Typography from "@mui/material/Typography";
import { useCallback, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import EditIcon from '@mui/icons-material/Edit';
import { DarkModeContext } from "../darkModeContext";
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import { ThemeProvider } from "@emotion/react";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";


export default function UsersDataGrid() {
    const [theme] = useContext(DarkModeContext);
    const [open, setOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);

    const navigate = useNavigate();

    const { data, mutate, isError, isLoading } = useAllUsers();

    const users = useMemo(() => {
        return data
    }, [data]);


    const handleClickOpen = useCallback((id) => {
        setIdToDelete(id);
        setOpen(true);
    }, []);

    const handleClose = () => {
        setOpen(false);
        setIdToDelete(null);
    };

    const handleConfirmDelete = () => {
        if (idToDelete === null) return;
        setOpen(false);
        deleteUser(idToDelete)
            .then((msg) => {
                console.log(msg)
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
                mutate();
            })
            .catch((error) => {
                toast.error("Error during data gathering");
                console.error(error);
            });

        setIdToDelete(null);
    };

    const editUser = useCallback((id) => {
        const url = "/editById/" + id;
        navigate(url);
    }, [navigate]);

    const deleteFunction = useCallback((id) => {
        handleClickOpen(id);
    }, [handleClickOpen]);

    const columns = [
        { field: "id", headerName: "ID", width: 290 },
        { field: "userName", headerName: "Username", width: 130, editable: true },
        { field: "email", headerName: "Email", width: 200, editable: true },
        { field: "fullName", headerName: "Full Name", width: 190, editable: true },
        { field: "role", headerName: "Role", width: 100, editable: true },
        {
            field: "edit",
            headerName: "Edit",
            width: 70,
            type: 'actions',
            getActions: ({ id }) => [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit"
                    onClick={() => editUser(id)}
                    showInMenu={false}
                    key="edit"
                />
            ],
        },
        {
            field: "delete",
            headerName: "Delete",
            width: 70,
            type: 'actions',
            getActions: ({ id }) => [
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={() => deleteFunction(id)}
                    showInMenu={false}
                    key="delete"
                />
            ],
        }
    ];

    const handleGoBack = useCallback(() => {
        navigate("/userPage");
    }, [navigate]);


    if (isError) {
        return (
            <ThemeProvider theme={theme}>
                <Alert severity='error'>Failed to load posts.</Alert>
            </ThemeProvider>
        )
    }

    if (isLoading) {
        return (
            <ThemeProvider theme={theme}>
                <CircularProgress />
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
                    maxWidth: 1000,
                    height: 642,
                    backgroundColor: theme.palette.background.paper,
                    p: 4,
                    borderRadius: 3,
                    boxShadow: 3,
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                }}
            >
                <Typography
                    variant="h6"
                    fontWeight="bold"
                    fontSize="1.5rem"
                    align="center"
                    sx={{
                        color: theme.palette.text.primary,
                        mb: 2
                    }}
                >
                    USERS DATA
                </Typography>

                <Box
                    sx={{
                        width: "100%",
                        maxWidth: 1000,
                        height: 600,
                        backgroundColor: "#fff",
                        boxShadow: 3,
                        display: "flex",
                        overflow: "auto",
                    }}>
                    <DataGrid
                        rows={users}
                        columns={columns}
                        slotProps={{
                            columnsPanel: {
                                sx: {
                                    color: theme.palette.primary.main,
                                    backgroundColor: theme.palette.background.paper,
                                },
                            },
                        }}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 8,
                                },
                            },
                        }}
                        pageSizeOptions={[8, 10, users.length]}
                        disableRowSelectionOnClick
                    />
                </Box>
                <Button
                    onClick={handleGoBack}
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
                            color: theme.palette.text.primary
                        },
                    }}
                >
                    GO BACK TO YOUR ACCOUNT
                </Button>
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
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Delete alert"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        You are going to permanently delete this user account.
                        Are you sure?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>I changed my mind</Button>
                    <Button onClick={handleConfirmDelete} autoFocus>
                        I'm sure
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}