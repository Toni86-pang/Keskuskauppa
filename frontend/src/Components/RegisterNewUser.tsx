import { ChangeEvent, useState } from 'react'
import axios from 'axios'
import { Box, Button, Container, TextField, Typography } from '@mui/material'


export interface User {
    user_id?: number
    name?: string
    username?: string
    password?: string
    email?: string
    phone?: string
    address?: string
    city?: string
}

const initialState: User = {
    name: "",
    username: "",
    password: "",
    email: "",
    phone: "",
    address: "",
    city: ""
}

function RegisterNewUser() {

    const [newUser, setNewUser] = useState<User>(initialState)
    const [userData, setUserData] = useState<User | null>(null)
    const [vPassword, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true)
    const { name, email, username, password, phone, address, city } = newUser

    const registerUser = async () => {



        try {
            const response = await axios.post('/api/users/register', newUser, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (response.status === 200) {
                alert('User registered successfully.')
                setUserData(newUser)
                setNewUser(initialState)
            } else if (response.status === 401) {
                setNewUser(initialState)
                alert('Username already exists.')
            } else {
                setNewUser(initialState)
                throw new Error('Something went wrong!')
            }
        } catch (error) {
            console.error(error)
            alert('Something went wrong!')
        }

    }
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setNewUser(() => ({
            ...newUser, [name]: value
        }))
    }

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newPassword = event.target.value
        setPassword(newPassword)
        setPasswordsMatch(newPassword === confirmPassword)
    }

    const handleConfirmPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newConfirmPassword = event.target.value
        setConfirmPassword(newConfirmPassword)
        setPasswordsMatch(vPassword === newConfirmPassword)
    }
    return (
        <Container sx={{ m: 1 }}>
            <Container>
                <TextField
                    type="text"
                    placeholder="your name"
                    name="name"
                    value={name}
                    onChange={handleInputChange}
                />

                <TextField
                    type="email"
                    placeholder="your email"
                    name="email"
                    value={email}
                    onChange={handleInputChange}
                />

                <TextField
                    type="text"
                    placeholder="enter a username"
                    name="username"
                    value={username}
                    onChange={handleInputChange}
                />

                <TextField
                    type="text"
                    placeholder="enter a phone number"
                    name="phone"
                    value={phone}
                    onChange={handleInputChange}
                />

                <TextField
                    type="text"
                    placeholder="enter a address"
                    name="address"
                    value={address}
                    onChange={handleInputChange}
                />

                <TextField
                    type="text"
                    placeholder="enter a city"
                    name="city"
                    value={city}
                    onChange={handleInputChange}
                />


                <TextField
                    type="password"
                    placeholder="Enter a password"
                    name="password"
                    value={vPassword}
                    onChange={handlePasswordChange}
                    error={!passwordsMatch}
                    helperText={!passwordsMatch ? "Passwords do not match" : ''}
                />
                <TextField
                    type="password"
                    placeholder="Enter the password again"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    error={!passwordsMatch}
                    helperText={!passwordsMatch ? "Passwords do not match" : ''}
                />
            </Container>
            <Container>
                <Button
                    sx={{ mt: 1, bgcolor: "#6096ba" }}
                    variant="contained"
                    onClick={registerUser}>Register</Button>
            </Container>
            <Typography>
                <Box>
                    {userData && (
                        <Box>
                            <Typography>Name: {userData.name}</Typography>
                            <Typography>Email: {userData.email}</Typography>
                            <Typography>Username: {userData.username}</Typography>
                            <Typography>Password: {userData.password}</Typography>
                            <Typography></Typography>
                        </Box>
                    )}
                </Box>
            </Typography>


        </Container >
    )
}

export default RegisterNewUser
