import { ChangeEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Button, Container, TextField } from '@mui/material'

export interface User {
    username: string,
    password: string
}

const initialState: User = {
    username: "",
    password: ""
}

function Login() {
    const [userValues, setUserValues] = useState<User>(initialState)
    const { username, password } = userValues
    const navigate = useNavigate()

    const loginUser = async () => {
        try {
            const response = await axios.post('/api/users/login', userValues, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (response.status === 200) {
                navigate('/')
                alert("You are logged in")
            } else if (response.status === 400) {
                alert("Username or password is incorrect")
            } else if (response.status === 401) {
                alert("Username or password is incorrect")
            } else {
                throw new Error('Something went wrong!')
            }
        } catch (error) {
            console.error(error)
            alert('Something went wrong!')
        }
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setUserValues(() => ({
            ...userValues, [name]: value
        }))
    }

    return (
        <Container sx={{ m: 1 }}>
            <Container>
                <TextField
                    type="text"
                    placeholder="Enter a username"
                    name="username"
                    value={username}
                    onChange={handleInputChange}
                /> <br/>
                <TextField
                    type="password"
                    placeholder="Enter a password"
                    name="password"
                    value={password}
                    onChange={handleInputChange}
                />
            </Container>
            <Container>
                <Button
                    sx={{
                        m: 1,
                        bgcolor: "#6096ba",
                        ":hover": { bgcolor: "darkblue" }
                    }}
                    variant="contained"
                    onClick={loginUser}>Login</Button>
                
            </Container>

        </Container >
    )
}

export default Login
