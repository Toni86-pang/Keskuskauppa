import { useState, MouseEvent } from 'react'

import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Menu,
    MenuItem
}
    from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'


const Navbar = () => {



    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    const open = Boolean(anchorEl)


    const handleClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }



    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ bgcolor: "#6096ba" }}>
                <Toolbar>
                    <IconButton
                        onClick={handleClick}
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{
                            mr: 2,
                            ":hover": { bgcolor: "darkblue" }
                        }}
                    >
                        <MenuIcon />

                    </IconButton>

                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={handleClose}><Button href='/'>Etusivu</Button></MenuItem>
                        <MenuItem onClick={handleClose}><Button href='/product'>Astiat</Button></MenuItem>
                        <MenuItem onClick={handleClose}><Button href='/product'>Eläimet</Button></MenuItem>
                        <MenuItem onClick={handleClose}><Button href='/product'>Astiat</Button></MenuItem>




                    </Menu>


                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Keskuskauppa
                    </Typography>
                    <Button
                        href='/register'
                        color="inherit">Register</Button> <Button
                            href='/login'
                            color="inherit">Login</Button>
                </Toolbar>
            </AppBar>


        </Box>
    )
}

export default Navbar