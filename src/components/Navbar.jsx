import { Link, NavLink } from "react-router-dom";
import "../styles/Navbar.css"

export default function Navbar(){
    return(
        <nav className="navbar">
            <ul className="navbar-links">
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
            </ul>
        </nav>
    )
}