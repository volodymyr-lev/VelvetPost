import React from 'react';
import { PixelLetter } from '../components/PixelArt';
import '../styles/About.css'

export default function About() {
    const V = [
        [1,1,1,0,0,1,1,1],
        [1,1,1,0,0,1,1,1],
        [1,1,1,0,0,1,1,1],
        [1,1,1,0,0,1,1,1],
        [1,1,1,0,0,1,1,1],
        [1,1,1,0,0,1,1,1],
        [1,1,1,0,0,1,1,1],
        [1,1,1,0,0,1,1,1],
        [1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,0,0],
    ];

    const P = [
        [1,1,1,1,1,1,0,0],
        [1,1,1,1,1,1,1,0],
        [1,1,1,0,0,1,1,1],
        [1,1,1,0,0,1,1,1],
        [1,1,1,0,0,1,1,1],
        [1,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,0,0],
        [1,1,1,0,0,0,0,0],
        [1,1,1,0,0,0,0,0],
        [1,1,1,0,0,0,0,0],
    ];

    return (
        <div className="about">
            <div className="about-side">
                <PixelLetter matrix={V} color="white" />
            </div>
            <div className="about-center">
                <h2 className="about-title">Про VelvetPost</h2>
                <p className="about-text">
                    VelvetPost — це твоя нова улюблена пошта. Ми не просто надсилаємо — ми робимо це безпечно, швидко і з душею.   
                    Від листів до величезних коробок — ми доставимо все, ніби передаємо рідній людині.
                </p>
                <p className="about-text">
                    Нас вибирають за увагу до деталей, за емоцію, яку ми вкладаємо в кожне відправлення. VelvetPost — це пошта з фіолетовим серцем💜.
                </p>
            </div>
            <div className="about-side">
                <PixelLetter matrix={P} color="magenta" />
            </div>
        </div>
    );
}