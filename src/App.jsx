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
import PostOffices from "./pages/PostOffices"
import Terminals from "./pages/Terminals"
import Employees from "./pages/Employees"
import Clients from "./pages/Clients"
import Shipments from "./pages/Shipments"
import ClientCreateShipment from "./pages/ClientCreateShipment"
import ClientMyShipments from "./pages/ClientMyShipments"
import PostOfficeEmployeeCreateShipment from "./pages/PostOfficeEmployeeCreateShipment"
import PostOfficeEmployeeShipments from "./pages/PostOfficeEmployeeShipments"
import PostOfficeStats from "./pages/PostOfficeStats"
import TerminalEmployeeProfile from "./components/TerminalEmployeeProfile"
import TerminalShipmentsOverview from "./pages/TerminalShipmentsOverview"

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
						<PrivateRoute allowedRoles={["Admin","Client","PostOfficeEmployee","TerminalEmployee"]}>
							<Profile/>
						</PrivateRoute>
					}/>
					<Route path="/postOffices" element={
						<PrivateRoute allowedRoles={["Admin"]}>
							<PostOffices/>
						</PrivateRoute>
					}/>
					<Route path="/terminals" element={
						<PrivateRoute allowedRoles={["Admin"]}>
							<Terminals/>
						</PrivateRoute>
					}/>
					<Route path="/employees" element={
						<PrivateRoute allowedRoles={["Admin"]}>
							<Employees/>
						</PrivateRoute>
					}/>
					<Route path="/clients" element={
						<PrivateRoute allowedRoles={["Admin"]}>
							<Clients/>
						</PrivateRoute>
					}/>
					<Route path="/shipments" element={
						<PrivateRoute allowedRoles={["Admin"]}>
							<Shipments/>
						</PrivateRoute>
					}/>
					<Route path="/client-create-shipment" element={
						<PrivateRoute allowedRoles={["Client"]}>
							<ClientCreateShipment/>
						</PrivateRoute>
					}/>
					<Route path="/client-my-shipments" element={
						<PrivateRoute allowedRoles={["Client"]}>
							<ClientMyShipments/>
						</PrivateRoute>
					}/>
					<Route path="/postOfficeEmployee-create-shipment" element={
						<PrivateRoute allowedRoles={["PostOfficeEmployee"]}>
							<PostOfficeEmployeeCreateShipment/>
						</PrivateRoute>
					}/>
					<Route path="/postOfficeEmployee-shipments" element={
						<PrivateRoute allowedRoles={["PostOfficeEmployee"]}>
							<PostOfficeEmployeeShipments/>
						</PrivateRoute>
					}/>
					<Route path="/postOfficeStats" element={
						<PrivateRoute allowedRoles={["PostOfficeEmployee"]}>
							<PostOfficeStats/>
						</PrivateRoute>
					}/>
					<Route path="/terminalShipmentsOverview" element={
						<PrivateRoute allowedRoles={["TerminalEmployee"]}>
							<TerminalShipmentsOverview/>
						</PrivateRoute>
					}/>
				</Routes>
			</Router>
		</AuthProvider>
	)
}


export default App;
