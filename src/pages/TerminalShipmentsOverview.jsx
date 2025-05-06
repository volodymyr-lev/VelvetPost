import React, { useState, useEffect } from "react";
import { 
LineChart, Line, BarChart, Bar, PieChart, Pie, 
XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
ResponsiveContainer, Cell, RadarChart, Radar, 
PolarGrid, PolarAngleAxis, PolarRadiusAxis,
AreaChart, Area, ScatterChart, Scatter, ComposedChart
} from "recharts";
import styles from "../styles/TerminalShipmentsOverview.module.css";
import { getTermianlOvewiew } from "../api/terminalsApi";


const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a472ff'];
const STATUS_COLORS = {
    "Очікує отримувача": "#a472ff",
    "В дорозі": "#ffc658",
    "Доставлено": "#82ca9d",
    "Очікує відправки": "#ff8042"
};

export default function TerminalShipmentsOverview() {

    const [terminalData, setTerminalData] = useState(null);
    const [shipmentData, setShipmentData] = useState(null);
    const [shipmentTypeData, setShipmentTypeData] = useState(null);
    const [statusData, setStatusData] = useState(null);
    const [selectedOffice, setSelectedOffice] = useState(null);
    const [timeDistribution, setTimeDistribution] = useState(null);
    const [deliveryTargets, setDeliveryTargets] = useState(null);
    const [parcelAnalysis, setParcelAnalysis] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try{
            fetchOverviewData(JSON.parse(localStorage.getItem("profile")).terminalId);
        } catch(error) {
            console.error("Помилка при отриманні даних термінала:", error);
        }

    }, []);

    const fetchOverviewData = async (terminalId) => {
        try{
            const o = await getTermianlOvewiew(terminalId);
            await setTerminalData(o.terminalData);
            await setShipmentData(o.shipmentData);
            await setShipmentTypeData(o.shipmentTypeData);
            await setStatusData(o.statusData);
            await setTimeDistribution(o.timeDistribution);
            await setDeliveryTargets(o.deliveryTargets);
            await setParcelAnalysis(o.parcelAnalysis);

            console.log("Термінал: ", o);
            await setLoading(false);
        } catch(error) {
            console.error("Помилка при отриманні даних термінала:", error);
        }
    }

    if (loading) {
        return <div className={styles.loading}>Завантаження...</div>;
    }

    return (
        <div className={styles.container}>
        <header className={styles.header}>
            <h1 className={styles.title}>Огляд термінала {terminalData.name}</h1>
            <p className={styles.subtitle}>{terminalData.address}, {terminalData.city} • Тип: {terminalData.type}</p>
        </header>

        {/* Основні показники */}
        <div className={styles.statsGrid}>
            <div className={styles.statCard}>
            <h3 className={styles.statLabel}>Всього відділень</h3>
            <p className={styles.statValue}>{terminalData.postOffices.length}</p>
            </div>
            <div className={styles.statCard}>
            <h3 className={styles.statLabel}>Загальний обіг посилок</h3>
            <p className={styles.statValue}>
                {shipmentData.reduce((sum, day) => sum + day.incoming + day.outgoing, 0)}
            </p>
            </div>
            <div className={styles.statCard}>
            <h3 className={styles.statLabel}>Вхідні посилки</h3>
            <p className={`${styles.statValue} ${styles.incomingValue}`}>
                {shipmentData.reduce((sum, day) => sum + day.incoming, 0)}
            </p>
            </div>
            <div className={styles.statCard}>
            <h3 className={styles.statLabel}>Вихідні посилки</h3>
            <p className={`${styles.statValue} ${styles.outgoingValue}`}>
                {shipmentData.reduce((sum, day) => sum + day.outgoing, 0)}
            </p>
            </div>
        </div>

        {/* Графік динаміки посилок */}
        <div className={styles.chartCard}>
            <h2 className={styles.chartTitle}>Динаміка посилок за останній тиждень</h2>
            <ResponsiveContainer width="100%" height={300}>
            <LineChart data={shipmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#2e2e2e', borderColor: '#374151' }} />
                <Legend />
                <Line 
                type="monotone" 
                dataKey="incoming" 
                name="Вхідні" 
                stroke="#8884d8" 
                strokeWidth={2} 
                activeDot={{ r: 8 }} 
                />
                <Line 
                type="monotone" 
                dataKey="outgoing" 
                name="Вихідні" 
                stroke="#82ca9d" 
                strokeWidth={2} 
                />
            </LineChart>
            </ResponsiveContainer>
        </div>

        {/* Розподіл за типами та статусами */}
        <div className={styles.chartsGrid}>
            <div className={styles.chartCard}>
            <h2 className={styles.chartTitle}>Розподіл за типами посилок</h2>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                <Pie
                    data={shipmentTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                    {shipmentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
                </PieChart>
            </ResponsiveContainer>
            </div>

            <div className={styles.chartCard}>
            <h2 className={styles.chartTitle}>Статуси посилок</h2>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                    {statusData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={STATUS_COLORS[entry.name]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
                </PieChart>
            </ResponsiveContainer>
            </div>
        </div>

        {/* Відомості про відділення */}
        <div className={styles.officesSection}>
            <h2 className={styles.sectionTitle}>Відділення терміналу</h2>
            
            <div className={styles.officesList}>
            {terminalData.postOffices.map(office => (
                <div 
                key={office.id} 
                className={`${styles.officeCard} ${selectedOffice === office.id ? styles.selectedOffice : ''}`}
                onClick={() => setSelectedOffice(office.id === selectedOffice ? null : office.id)}
                >
                <h3 className={styles.officeName}>{office.name}</h3>
                <p className={styles.officeAddress}>{office.address}</p>
                <p className={styles.officePhone}>{office.phoneNumber}</p>
                </div>
            ))}
            </div>
        </div>

        <h2 className={styles.mainSectionTitle}>Розширена аналітика</h2>

        {/* Розподіл за часом доби (Областна діаграма) */}
        <div className={styles.chartCard}>
            <h2 className={styles.chartTitle}>Розподіл відправлень за часом дня</h2>
            <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timeDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#2e2e2e', borderColor: '#374151' }} />
                <Legend />
                <Area 
                    type="monotone" 
                    dataKey="sent" 
                    stackId="1" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.6}
                />
                <Area 
                    type="monotone" 
                    dataKey="received" 
                    stackId="1" 
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                    fillOpacity={0.6}
                />
            </AreaChart>
            </ResponsiveContainer>
        </div>

        {/* План vs Факт (Комбінована діаграма) */}
        <div className={styles.chartCard}>
            <h2 className={styles.chartTitle}>План vs Факт відправлень</h2>
            <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={deliveryTargets}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#2e2e2e', borderColor: '#374151' }} />
                <Legend />
                <Bar dataKey="plan" fill="#ffc658" barSize={20} />
                <Line 
                type="monotone" 
                dataKey="fact" 
                stroke="#ff7300" 
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
                />
            </ComposedChart>
            </ResponsiveContainer>
        </div>

        {/* Аналіз посилок (Діаграма розсіювання) */}
        <div className={styles.chartCard}>
            <h2 className={styles.chartTitle}>Аналіз вартості відносно ваги</h2>
            <ResponsiveContainer width="100%" height={350}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis 
                dataKey="weight" 
                name="Вага (кг)" 
                stroke="#9ca3af"
                label={{ value: 'Вага (кг)', position: 'insideBottomRight', offset: -5, fill: '#9ca3af' }} 
                />
                <YAxis 
                dataKey="price" 
                name="Вартість (грн)" 
                stroke="#9ca3af"
                label={{ value: 'Вартість (грн)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} 
                />
                <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: '#2e2e2e', borderColor: '#374151' }}
                formatter={(value, name, props) => [value, name]}
                labelFormatter={(value) => `Посилка #${value}`}
                />
                <Scatter 
                name="Посилки" 
                data={parcelAnalysis} 
                fill="#a472ff"
                >
                {parcelAnalysis.map((entry, index) => {
                    let color;
                    switch(entry.type) {
                        case "Лист": color = "#8884d8"; break;
                        case "Секограма": color = "#82ca9d"; break;
                        case "Бандероль": color = "#ffc658"; break;
                        case "Посилка": color = "#ff7300"; break;
                    default: color = "#a472ff";
                    }
                    return <Cell key={`cell-${index}`} fill={color} />;
                })}
                </Scatter>
                <Legend formatter={(value, entry) => "Посилки за типом"} />
            </ScatterChart>
            </ResponsiveContainer>
            <div className={styles.scatterLegend}>
            <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{backgroundColor: "#8884d8"}}></span>
                <span>Лист</span>
            </div>
            <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{backgroundColor: "#82ca9d"}}></span>
                <span>Секограма</span>
            </div>
            <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{backgroundColor: "#ffc658"}}></span>
                <span>Бандероль</span>
            </div>
            <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{backgroundColor: "#ff7300"}}></span>
                <span>Посилка</span>
            </div>
            </div>
        </div>
        </div>
    );
}