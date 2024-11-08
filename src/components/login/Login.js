import React, { useState } from 'react';
import {signInWithPopup} from "firebase/auth";
import { auth,provider } from '../../firebase_config';
import Dashboard from '../dashboard/Dashboard';
function Login() {
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user); // Set the user object on successful login
      console.log("User logged in:", result.user);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {user ? <Dashboard/> : (
        <button onClick={handleLogin} style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#4285F4',
          color: '#fff',
          border: 'none',
          borderRadius: '4px'
        }}>
          Login with Google
        </button>
      )}
    </div>
  );
}

export default Login;
