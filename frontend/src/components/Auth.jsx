'use client'

import React, { useState } from 'react';
import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { db } from "@/firebase/config";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [anonName, setAnonName] = useState('')
  const [points, setPoints] = useState(0);

  const router = useRouter();

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError(''); // Clear error on mode toggle
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
  
    if (!isLogin) {
      // Registration logic
      try {
        // Check if user already exists
        const usersQuery = query(
          collection(db, 'users'),
          where('username', '==', username)
        );
        const querySnapshot = await getDocs(usersQuery);
  
        if (!querySnapshot.empty) {
          setError('User already exists');
          return;
        }
  
        // Register the new user
        const user = {
          username: username,
          email: email,
          pass: pass,
          anonName,
          userId: Math.random().toString(36).substring(2),
          points: points
        };
  
        await addDoc(collection(db, 'users'), user);
        localStorage.setItem('currentUser', JSON.stringify({ email })); // Save the email
  
        alert('Registered successfully');
        setUsername('');
        setEmail('');
        setPass('');
        router.push('/home'); // Redirect to home
      } catch (error) {
        console.log(error);
        setError('An error occurred during registration');
      }
    } else {
      // Login logic
      try {
        const usersQuery = query(
          collection(db, 'users'),
          where('username', '==', username),
          where('pass', '==', pass)
        );
        const querySnapshot = await getDocs(usersQuery);
  
        if (querySnapshot.empty) {
          setError('Invalid username or password');
          return;
        }
  
        localStorage.setItem('currentUser', JSON.stringify({ email: querySnapshot.docs[0].data().email })); // Save the email
  
        alert('Login successful');
        setUsername('');
        setPass('');
        router.push('/home'); // Redirect to home
      } catch (error) {
        console.log(error);
        setError('An error occurred during login');
      }
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-4 rounded-lg shadow-md">
        <h2 className="text-[3rem] text-yellow-400 tracking-wider font-bold text-center">
          {isLogin ? 'Login' : 'Register'}
        </h2>
        {error && (
          <p className="text-red-500 text-center">{error}</p>
        )}
        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border text-gray-700 border-gray-300 bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 border text-gray-700 border-gray-300 bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border text-gray-700 border-gray-300 bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <button
          onClick={toggleAuthMode}
          className="w-full text-sm text-center text-blue-500 hover:underline"
        >
          {isLogin ? 'Switch to Register' : 'Switch to Login'}
        </button>
      </div>
    </div>
  );
}

export default Auth;