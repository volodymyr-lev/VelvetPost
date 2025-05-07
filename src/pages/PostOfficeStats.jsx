import React, { useState, useEffect } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import { Calendar, Filter, Package, TrendingUp, Users, Map, Clock, AlertCircle } from "lucide-react";
import styles from "../styles/PostOfficeStats.module.css";
import { getStatsByPostOfficeId } from "../api/StatsApi";
import _ from "lodash";

export default function PostOfficeStats() {
    const [selectedOffice, setSelectedOffice] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({});

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try{
            const resp = await getStatsByPostOfficeId(JSON.parse(localStorage.getItem("profile")).postOfficeId);
            setStats(resp);
            console.log(resp);
            setLoading(false);
        } catch(error){
            console.error("Error fetching stats: ", error);
        }
    }

    

    // Colors for charts
    const COLORS = ["#a472ff", "#823fff", "#b187ff", "#438bff", "#10b981", "#f59e0b"];

    const groupDailyShipmentsByDay = (dailyShipments) => {
        const grouped = _.groupBy(dailyShipments, 'name');
        
        return Object.keys(grouped).map(date => {
            const entries = grouped[date];
            
            // Сумуємо значення sent і received за цей день
            const totalSent = _.sumBy(entries, 'sent');
            const totalReceived = _.sumBy(entries, 'received');
            
            return {
                date,
                name: date, 
                sent: totalSent,
                received: totalReceived,
                total: totalSent + totalReceived
            };
        });
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingContent}>
                    <div className={styles.spinner}></div>
                    <p className={styles.loadingText}>Завантаження даних...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Статистика поштового відділення</h1>
                <p className={styles.subtitle}>Аналітика та метрики роботи відділення</p>
            </div>

            {/* Filter Controls */}
            <div className={styles.filterRow}>
                <div className={styles.filterCard}>
                    <label className={styles.filterLabel}>
                        <Map size={16} />
                        ID Відділення : <span style={{ color: '#a472ff' }}>{JSON.parse(localStorage.getItem("profile")).postOfficeId}</span>
                    </label>
                </div>
            </div>

            {/* Stats Cards */}
            <div className={styles.statsGrid}>
                <div className={styles.statsCard}>
                    <div className={`${styles.iconContainer} ${styles.primaryIcon}`}>
                        <Package size={24} />
                    </div>
                    <div>
                        <p className={styles.cardLabel}>Всього відправлень</p>
                        <p className={styles.cardValue}>{stats.totalShipments}</p>
                    </div>
                </div>
                <div className={styles.statsCard}>
                    <div className={`${styles.iconContainer} ${styles.highlightIcon}`}>
                        <Users size={24} />
                    </div>
                    <div>
                        <p className={styles.cardLabel}>Клієнтів</p>
                        <p className={styles.cardValue}>{stats.totalClients}</p>
                    </div>
                </div>
                <div className={styles.statsCard}>
                    <div className={`${styles.iconContainer} ${styles.successIcon}`}>
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className={styles.cardLabel}>Співробітників</p>
                        <p className={styles.cardValue}>{stats.totalEmployees}</p>
                    </div>
                </div>
                <div className={styles.statsCard}>
                    <div className={`${styles.iconContainer} ${styles.warningIcon}`}>
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className={styles.cardLabel}>Сер. час доставки</p>
                        <p className={styles.cardValue}>{stats.averageDeliveryTime.toFixed(1)} годин</p>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className={styles.chartsGrid}>
                {/* Daily Shipments Chart */}
                <div className={styles.chartCard}>
                    <h2 className={styles.chartTitle}>Щоденні відправлення</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={groupDailyShipmentsByDay(stats.dailyShipments)}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="name" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#2e2e2e',
                                    border: '1px solid #374151',
                                    borderRadius: '4px',
                                    color: '#f9fafb'
                                }}
                            />
                            <Legend />
                            <Bar dataKey="sent" fill="#a472ff" />
                            <Bar dataKey="received" fill="#438bff" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Parcel Types */}
                <div className={styles.chartCard}>
                    <h2 className={styles.chartTitle}>Типи відправлень</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={stats.shipmentsTypePercentage}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                                {stats.shipmentsTypePercentage.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#2e2e2e',
                                    border: '1px solid #374151',
                                    borderRadius: '4px',
                                    color: '#f9fafb'
                                }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Monthly Trends */}
                <div className={styles.chartCard}>
                    <h2 className={styles.chartTitle}>Місячна динаміка</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                            data={stats.monthlyTrends}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="month" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#2e2e2e',
                                    border: '1px solid #374151',
                                    borderRadius: '4px',
                                    color: '#f9fafb'
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#a472ff"
                                activeDot={{ r: 8 }}
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Delivery Status */}
            <div className={styles.statusCard}>
                <h2 className={styles.statusTitle}>
                    <AlertCircle size={20} className={styles.warningIcon} />
                    Статуси відправлень
                </h2>
                <div className={styles.statusGrid}>
                    {stats.deliveryStatuses.map((status, index) => (
                        <div
                            key={`status-${index}`}
                            className={styles.statusItem}
                        >
                            <span>{status.status}</span>
                            <span
                                className={styles.statusBadge}
                                style={{
                                    backgroundColor: `${COLORS[index % COLORS.length]}20`,
                                    color: COLORS[index % COLORS.length]
                                }}
                            >
                                {status.count}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Office Info */}
            {selectedOffice && (
                <div className={styles.officeCard}>
                    <h2 className={styles.chartTitle}>Інформація про відділення</h2>
                    <div className={styles.officeGrid}>
                        <div className={styles.officeItem}>
                            <p className={styles.officeLabel}>Назва</p>
                            <p className={styles.officeValue}>{selectedOffice.name}</p>
                        </div>
                        <div className={styles.officeItem}>
                            <p className={styles.officeLabel}>Місто</p>
                            <p className={styles.officeValue}>{selectedOffice.city}</p>
                        </div>
                        <div className={styles.officeItem}>
                            <p className={styles.officeLabel}>Адреса</p>
                            <p className={styles.officeValue}>{selectedOffice.address}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
