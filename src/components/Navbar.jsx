import { Link, NavLink } from "react-router-dom";
import "../styles/Navbar.css"

export default function Navbar(){
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
                    <li>
                        <NavLink to="/login" 
                        className={({isActive})=>isActive?"navbar-item active":"navbar-item"}
                        >
                            Увійти
                        </NavLink>
                    </li>
                </div>
            </ul>
        </nav>
    )
}