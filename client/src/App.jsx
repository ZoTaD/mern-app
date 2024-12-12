import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';
import Home from './components/home';

function App() {
    const [isRegistering, setIsRegistering] = useState(false);

    const handleToggle = () => {
        setIsRegistering(!isRegistering);
    };

    return (
        <Router>
            <div>
                <h1>Aplicación MERN</h1>
                <Routes>
                    {/* Ruta principal */}
                    <Route
                        path="/"
                        element={
                            isRegistering ? (
                                <div>
                                    <Register />
                                    <button onClick={handleToggle}>← Volver al Login</button>
                                </div>
                            ) : (
                                <div>
                                    <Login onSwitchToRegister={handleToggle} />
                                    <button onClick={handleToggle}>Registrarse</button>
                                </div>
                            )
                        }
                    />
                    {/* Ruta para el Home */}
                    <Route path="/home" element={<Home />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
