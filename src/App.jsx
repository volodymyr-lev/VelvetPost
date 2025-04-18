import React from "react"
import {
	BrowserRouter as Router,
	Routes,
	Route
} from 'react-router-dom'
import Home from '../src/pages/Home'
import About from '../src/pages/About'
import Navbar from "./components/Navbar"

function App() {
	return(
		<Router>
			<Navbar/>
			<Routes>
				<Route path="/" element={<Home/>}/>
				<Route path="/about" element={<About/>}/>
			</Routes>
		</Router>
	)
}


export default App;
