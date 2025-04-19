import React from "react"
import {
	BrowserRouter as Router,
	Routes,
	Route
} from 'react-router-dom'
import Home from '../src/pages/Home'
import About from '../src/pages/About'
import Login from '../src/pages/Login'
import Register from "../src/pages/Register"
import Navbar from "./components/Navbar"
import Profile from "./pages/Profile"
import PrivateRoute from "./routing/PrivateRoute"
import { AuthProvider } from "./context/AuthContext"

function App() {
	return(
		<AuthProvider>
			<Router>
				<Navbar/>
				<Routes>
					<Route path="/" element={<Home/>}/>
					<Route path="/about" element={<About/>}/>
					<Route path="/login" element={<Login/>}/>
					<Route path="/register" element={<Register/>}/>
					<Route path="/profile" element={
						<PrivateRoute>
							<Profile/>
						</PrivateRoute>
					}/>
				</Routes>
			</Router>
		</AuthProvider>
	)
}


export default App;
