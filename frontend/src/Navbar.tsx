import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Button,
    IconButton
}
    from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
const Navbar = () => {

    {
        return (
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" sx={{ bgcolor: "#6096ba" }}>
                    <Toolbar>
                        <IconButton
                            href='/'
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Keskuskauppa
                        </Typography>
                        <Button
                            href='/register'
                            color="inherit">Register</Button>
                    </Toolbar>
                </AppBar>
            </Box>
        )
    }
}
export default Navbar