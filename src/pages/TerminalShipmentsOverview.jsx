import React from "react";
import styles from "../styles/TerminalShipmentsOverview.module.css";

export default function TerminalShipmentsOverview(){
    return(
        <div className={styles.container}>
            <h1>Огляд відправлень термінала</h1>
            <p>Ця сторінка надає огляд усіх відправлень, які проходять через термінал.</p>
        </div>
    )
}