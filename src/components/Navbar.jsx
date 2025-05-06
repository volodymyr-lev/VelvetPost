import React, {useContext} from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css"

export default function Navbar(){
    const { isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();

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
                    {localStorage.getItem("role")==="Admin" &&(
                        <>
                            <li>
                                <NavLink to="/postOffices" 
                                className={({isActive})=>isActive?"navbar-item active":"navbar-item"}
                                >
                                    Відділення
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/terminals" 
                                className={({isActive})=>isActive?"navbar-item active":"navbar-item"}
                                >
                                    Термінали
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/employees" 
                                className={({isActive})=>isActive?"navbar-item active":"navbar-item"}
                                >
                                    Працівники
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/clients" 
                                className={({isActive})=>isActive?"navbar-item active":"navbar-item"}
                                >
                                    Клієнти
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/shipments" 
                                className={({isActive})=>isActive?"navbar-item active":"navbar-item"}
                                >
                                    Відправлення
                                </NavLink>
                            </li>
                        </>
                    )}
                    {localStorage.getItem("role")==="Client" &&(
                        <>
                            <li>
                                <NavLink to="/client-create-shipment" 
                                className={({isActive})=>isActive?"navbar-item active":"navbar-item"}
                                >
                                    Створити відправлення
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/client-my-shipments" 
                                className={({isActive})=>isActive?"navbar-item active":"navbar-item"}
                                >
                                    Мої відправлення
                                </NavLink>
                            </li>
                        </>
                    )}

                    {localStorage.getItem("role")==="PostOfficeEmployee" &&(
                        <>
                            <li>
                                <NavLink to="/postOfficeEmployee-create-shipment" 
                                className={({isActive})=>isActive?"navbar-item active":"navbar-item"}
                                >
                                    Створити відправлення
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/postOfficeEmployee-shipments" 
                                className={({isActive})=>isActive?"navbar-item active":"navbar-item"}
                                >
                                    Перегляд відправлень
                                </NavLink>
                            </li>
                        </>
                    )}
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
								<button className="navbar-item logout-btn" onClick={()=>{
                                    logout();
                                    navigate("/");
                                }}>
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