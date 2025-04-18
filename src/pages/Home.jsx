
import React from "react";
import {PixelArt} from "../components/PixelArt"
import '../styles/Home.css'

export default function Home(){
    return (
        <div className="home">
            <div className="home-left">
                <PixelArt/>
            </div>
            <div className="home-right">
                <h1 className="home-title">Надсилай безпечно</h1>
                <p className="home-subtitle">VelvetPost — це не черговий поштовий сервіс. Ми не граємо вашими посилками в футбол</p>
            </div>
        </div>
    );
}

