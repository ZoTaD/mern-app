import React from 'react';
import Login from './components/login';
import Register from './components/register';

function App() {
    // Con el useState, se crea un estado para saber si el usuario está registrándose o no
    const [isRegistering, setIsRegistering] = React.useState(false);

    const handleToggle = () => {
        setIsRegistering(!isRegistering);
    }

    return (
        <div>
            <h1>Aplicacion MERN</h1>
            {/* Un if de toda la vida */}
            {isRegistering ? (
                <div>
                    <Register />
                    <button onClick={handleToggle}>← Volver al Login</button>
                </div>
            ) : (
                <div>
                    <Login />
                    <button onClick={handleToggle}>Registrarse</button>
                </div>
            )}
        </div>
    );
}

export default App;

// import React from 'react';

// function App() {
//     return (
//         <div>
//             <h1>Prueba de App.jsx</h1>
//         </div>
//     );
// }

// export default App;