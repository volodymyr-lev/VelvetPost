import React, {useContext} from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css"

export default function Navbar(){
    const { isAuthenticated, logout } = useContext(AuthContext);

    return(
        <nav className="navbar">
            <ul className="navbar-links">
                <div className="navbar-left">
                    <li>
                        <NavLink to="/" 
                            className={({isActive})=>isActive?"navbar-item active":"navbar-item"}
                        >
                            Головна
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/about" 
                        className={({isActive})=>isActive?"navbar-item active":"navbar-item"}
                        >
                            Про нас
                        </NavLink>
                    </li>
                </div>

                <div className="navbar-right">
					{isAuthenticated ? (
						<>
							<li>
								<NavLink to="/profile" className={({ isActive }) => isActive ? "navbar-item active" : "navbar-item"}>
									Ваш профіль
								</NavLink>
							</li>
							<li>
								<button className="navbar-item logout-btn" onClick={logout}>
									Вийти
								</button>
							</li>
						</>
					) : (
						<li>
							<NavLink to="/login" className={({ isActive }) => isActive ? "navbar-item active" : "navbar-item"}>
								Увійти
							</NavLink>
						</li>
					)}
				</div>
            </ul>
        </nav>
    )
}