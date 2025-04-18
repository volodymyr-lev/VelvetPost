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

function App() {
	return(
		<Router>
			<Navbar/>
			<Routes>
				<Route path="/" element={<Home/>}/>
				<Route path="/about" element={<About/>}/>
				<Route path="/login" element={<Login/>}/>
				<Route path="/register" element={<Register/>}/>
			</Routes>
		</Router>
	)
}


export default App;
