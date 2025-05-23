import React, { useState } from "react";
import "../styles/AdminProfile.css";
import { PixelLetter } from "./PixelArt";
import { DumpDb } from "../api/DumpDb";

export default function AdminProfile({ profile }) {
    const [isLoading, setIsLoading] = useState(false);

    const V = [
        [1,1,1,0,0,1,1,1],
        [1,1,1,0,0,1,1,1],
        [1,1,1,0,0,1,1,1],
        [1,1,1,0,0,1,1,1],
        [1,1,1,0,0,1,1,1],
        [1,1,1,0,0,1,1,1],
        [1,1,1,0,0,1,1,1],
        [1,1,1,0,0,1,1,1],
        [1,1,1,1,1,1,1,0],
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


    const handleDownload = async () => {
        setIsLoading(true);

        try {            
          
            const response = await DumpDb();

            if(response === null) {
                console.error("Failed to fetch the database dump.");
                setIsLoading(false);
                return;
            }

            const blob = response.data;
            
            const url = window.URL.createObjectURL(blob);
            

            const link = document.createElement('a');
            const filename = `velvet_post_db_export_${new Date().toISOString().split('T')[0]}.json`;
            
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            
            // Clean up
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);
            
            console.log("Download completed!");
        } catch (err) {
            console.error("Error downloading database:", err);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="admin-container">
            <h2 style={{color: '#fff'}}>Вітання,
                <span style={{color: '#a472ff'}}> {profile.email}</span>
            </h2>

            <div className="admin-guide">
                <h3>🛡️ Пам’ятка для Адміністратора Системи</h3>

                <h4>🔐 Аутентифікація</h4>
                <p>Завжди перевіряй, що ти залогінений як адмін. Адмінські дії доступні тільки користувачам з роллю <strong>Admin</strong>. Не діліться токенами чи паролями з іншими.</p>

                <h4>🧑‍💻 Управління Користувачами</h4>
                <ul>
                    <li>Можеш переглядати список усіх користувачів.</li>
                    <li>Видалення користувача — <strong>незворотна дія</strong>.</li>
                </ul>

                <h4>🏤 Поштові Відділення</h4>
                <ul>
                    <li>Створення нового відділення потребує: назви, міста, адреси, координат (широта і довгота).</li>
                    <li>Усі зміни до відділень відображаються на карті у реальному часі.</li>
                    <li>Видалення відділення автоматично прибирає його з мапи.</li>
                </ul>

                <h4>⚙️ Системні Налаштування</h4>
                <ul>
                    <li><code>.env</code> файл <strong>не має потрапляти в репозиторій</strong>.</li>
                    <li>API ключі зберігати тільки в <code>.env</code>.</li>
                    <li>Періодично перевіряй лог-файли (якщо є), щоб виявляти підозрілу активність.</li>
                </ul>

                <h4>📦 Бекапи</h4>
                <ul>
                    <li>Регулярно роби бекап бази даних.</li>
                    <li>Зберігай останній бекап локально або в хмарі (але не в репозиторії!).</li>
                </ul>

                <h4>🚨 Інциденти</h4>
                <ul>
                    <li>Якщо стався баг чи злам:
                        <ul>
                            <li>Перевір логи.</li>
                            <li>Заблокуй підозрілий акаунт.</li>
                            <li>Повідом розробника (або сам себе, якщо ти й є розробник 😄).</li>
                        </ul>
                    </li>
                </ul>

                <h4>🧼 Чистка Системи</h4>
                <ul>
                    <li>Раз на місяць переглядай неактивні акаунти.</li>
                    <li>Видаляй тестові дані, які більше не потрібні.</li>
                    <li>Стеж за актуальністю відділень.</li>
                </ul>
            </div>

            <button 
                className="admin-download" 
                onClick={handleDownload}
                disabled={isLoading}
            >
                {isLoading ? (
                    <span className="loading-spinner"></span>
                ) : (
                    <ion-icon name="download-outline"></ion-icon>
                )}
                {isLoading ? 'Завантаження...' : 'Завантажити дані'}
            </button>
        </div>
    );
}
