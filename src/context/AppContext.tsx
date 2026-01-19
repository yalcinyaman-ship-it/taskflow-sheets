import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, Note, UserSummary, UserData, FileUploadData, UserStats, PendingTask } from '../types';

// ⚙️ PRODUCTION MODE - Google Sheets'e yazmak için false olmalı!
const DEV_MODE = false;

// 🔴 ÖNEMLİ: Google Apps Script deploy URL'ini buraya yapıştır!
// Deploy > New Deployment > Web App > Copy URL
const GOOGLE_SCRIPT_URL = "BURAYA_GOOGLE_APPS_SCRIPT_URL_YAPISTIR";
const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTDCxzNv6Awsdf3LBysPZfGBAxL5TdzyzaTsqi99H6ChLSGeN2TPNHXzvyph7W9memyuGDUfghLFyJo/pub?gid=0&single=true&output=csv";

// Mock data for development
const MOCK_TASKS: Task[] = [
    {
        is_id: '1001',
        is_basligi: 'Yeni Kitap İncelemesi - Suç ve Ceza',
        is_detayi: 'Dostoyevski\'nin Suç ve Ceza romanının yeni çevirisi için editöryel inceleme yapılacak. Yazım hataları, tutarlılık ve akıcılık kontrolleri gerekiyor.',
        is_atama_tarihi: '2026-01-15',
        atanan_kisi: 'Ayşenur Köse',
        sifre: 'A77K2D',
        ekler: [],
        notes: [
            { id: '1', text: 'İlk 50 sayfa tamamlandı', createdAt: '2026-01-16', createdBy: 'Ayşenur Köse' }
        ],
        status: 'Beklemede'
    },
    {
        is_id: '1002',
        is_basligi: 'Çocuk Kitabı Düzenleme',
        is_detayi: 'Yeni çocuk kitabı serisinin 2. cildinin son kontrollerini yapınız.',
        is_atama_tarihi: '2026-01-10',
        atanan_kisi: 'Burak Genç',
        sifre: 'B54X2L',
        ekler: [],
        notes: [],
        status: 'Tamamlandı'
    },
    {
        is_id: '1003',
        is_basligi: 'Pazarlama Metni Hazırlama',
        is_detayi: 'Yeni çıkan romanlar için sosyal medya paylaşım metinleri hazırlanacak.',
        is_atama_tarihi: '2026-01-18',
        atanan_kisi: 'Pazarlama Birimi',
        sifre: 'P11B7R',
        ekler: [],
        notes: [],
        status: 'Beklemede'
    },
    {
        is_id: '1004',
        is_basligi: 'Tercüme Kontrol - İngilizce Roman',
        is_detayi: 'Bestseller İngilizce romanın Türkçe çevirisinin kalite kontrolü.',
        is_atama_tarihi: '2026-01-12',
        atanan_kisi: 'Ayşenur Köse',
        sifre: 'A77K2D',
        ekler: [],
        notes: [
            { id: '2', text: 'Terminoloji listesi hazırlandı', createdAt: '2026-01-13', createdBy: 'Ayşenur Köse' },
            { id: '3', text: '60% tamamlandı', createdAt: '2026-01-17', createdBy: 'Ayşenur Köse' }
        ],
        status: 'Beklemede'
    }
];

const PREDEFINED_USERS: UserData[] = [
    { name: 'Ayşenur Köse', password: 'A77K2D' },
    { name: 'Burak Genç', password: 'B54X2L' },
    { name: 'Çeşitli İşler', password: 'C44I9S' },
    { name: 'Editörya Asistanları', password: 'E11A9S' },
    { name: 'Feride Bayyiğit', password: 'F91P3Q' },
    { name: 'Gülfem Özer', password: 'G55O2R' },
    { name: 'Hüseyin Genç', password: 'H22G6N' },
    { name: 'Merve Akıcı Almaz', password: 'M33K8J' },
    { name: 'Murat Kaya', password: 'M99K1A' },
    { name: 'Pazarlama Birimi', password: 'P11B7R' },
    { name: 'Saliha Aydın', password: 'S88A5Y' },
    { name: 'Sümeyra İrem Uz', password: 'S44U1Z' },
    { name: 'Yalçın Yaman', password: 'Y72K9M' },
    { name: 'Yusuf Gündüz', password: 'Y55G3U' },
];

interface AppContextType {
    tasks: Task[];
    pendingApprovals: PendingTask[];
    currentUser: string | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (name: string, password: string) => boolean;
    logout: () => void;
    users: UserSummary[];
    allUsersData: UserData[];
    addTask: (title: string, detail: string, assignee: string, files: FileUploadData[]) => Promise<boolean>;
    addNote: (taskId: string, noteText: string) => Promise<void>;
    markTaskAsComplete: (taskId: string) => Promise<boolean>;
    submitTaskForApproval: (task: Omit<PendingTask, 'status'>) => Promise<boolean>;
    approveTask: (taskId: string) => Promise<boolean>;
    rejectTask: (taskId: string, reason: string) => Promise<boolean>;
    getUserStats: (userName: string) => UserStats;
    isLoading: boolean;
    showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

const parseCSVLine = (text: string) => {
    const result = [];
    let start = 0;
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
        if (text[i] === '"') {
            inQuotes = !inQuotes;
        } else if (text[i] === ',' && !inQuotes) {
            let field = text.substring(start, i);
            if (field.startsWith('"') && field.endsWith('"')) {
                field = field.substring(1, field.length - 1).replace(/""/g, '"');
            }
            result.push(field);
            start = i + 1;
        }
    }
    let lastField = text.substring(start);
    if (lastField.startsWith('"') && lastField.endsWith('"')) {
        lastField = lastField.substring(1, lastField.length - 1).replace(/""/g, '"');
    }
    result.push(lastField);
    return result;
};

export const AppProvider = ({ children }: { children?: ReactNode }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [pendingApprovals, setPendingApprovals] = useState<PendingTask[]>([]);
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    const isAdmin = currentUser === 'Admin';

    // Session persistence
    useEffect(() => {
        const storedUser = localStorage.getItem('taskflow_user');
        if (storedUser) {
            const isValid = PREDEFINED_USERS.some(u => u.name === storedUser) || storedUser === 'Admin';
            if (isValid) {
                setCurrentUser(storedUser);
                setIsAuthenticated(true);
            }
        }
    }, []);

    const showToast = (message: string, type: 'success' | 'error' | 'info') => {
        setToastMessage({ message, type });
        setTimeout(() => setToastMessage(null), 4000);
    };

    const fetchTasks = async () => {
        setIsLoading(true);

        // 🔧 Development mode - use mock data
        if (DEV_MODE) {
            await new Promise(resolve => setTimeout(resolve, 500));
            setTasks(MOCK_TASKS);
            setIsLoading(false);
            console.log('🔧 DEV MODE: Using mock data');
            return;
        }

        let success = false;

        // Try Apps Script API with proper CORS
        if (GOOGLE_SCRIPT_URL) {
            try {
                const url = `${GOOGLE_SCRIPT_URL.trim()}?action=getTasks&t=${Date.now()}`;
                const response = await fetch(url, {
                    method: "GET",
                    redirect: 'follow',
                    credentials: 'omit',
                    mode: 'cors', // ✅ FIXED: Changed from 'no-cors'
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result && result.status === 'success') {
                        setTasks(result.data || []);
                        success = true;
                        console.log("✅ Veriler Apps Script API'den başarıyla yüklendi.");
                    }
                } else {
                    console.warn(`Apps Script API yanıt hatası: ${response.status}`);
                }
            } catch (error) {
                console.warn("Apps Script API erişimi başarısız, CSV fallback deneniyor...", error);
            }
        }

        // Fallback to CSV
        if (!success && CSV_URL) {
            try {
                const csvUrl = `${CSV_URL}&t=${Date.now()}`;
                const response = await fetch(csvUrl);
                const csvText = await response.text();

                const lines = csvText.split(/\r\n|\n/).filter(line => line.trim() !== '');
                const dataRows = lines.slice(1);

                const parsedTasks: Task[] = dataRows.map(line => {
                    const cols = parseCSVLine(line);
                    let notes: Note[] = [];
                    try {
                        notes = cols[7] ? JSON.parse(cols[7]) : [];
                    } catch (e) { notes = []; }

                    const ekler = [];
                    if (cols[6]) ekler.push(cols[6]);
                    if (cols[9]) ekler.push(cols[9]);
                    if (cols[10]) ekler.push(cols[10]);

                    let dateStr = cols[3] || '';
                    dateStr = dateStr.replace('T00:00:00.000Z', '');

                    return {
                        is_id: cols[0] || '',
                        is_basligi: cols[1] || '',
                        is_detayi: cols[2] || '',
                        is_atama_tarihi: dateStr,
                        atanan_kisi: cols[4] || '',
                        sifre: cols[5] || '',
                        ekler: ekler,
                        notes: notes,
                        status: (cols[8] === 'Tamamlandı' ? 'Tamamlandı' : 'Beklemede') as any
                    };
                });

                setTasks(parsedTasks);
                console.log("⚠️ Veriler CSV kaynağından yüklendi (fallback).");
            } catch (csvError) {
                console.error("❌ CSV veri çekme hatası:", csvError);
                showToast("Veri yükleme hatası! Lütfen sayfayı yenileyin.", 'error');
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchTasks();

        // ⚠️ Don't auto-refresh in DEV_MODE - it would reset to mock data
        if (!DEV_MODE) {
            const interval = setInterval(fetchTasks, 30000);
            return () => clearInterval(interval);
        }
    }, []);

    const users: UserSummary[] = PREDEFINED_USERS.map(u => {
        return {
            name: u.name,
            taskCount: tasks.filter(t => t.atanan_kisi === u.name && t.status === 'Beklemede').length
        };
    });

    const login = (name: string, password: string): boolean => {
        if (name === 'Admin' && password === '4337') {
            setCurrentUser('Admin');
            setIsAuthenticated(true);
            localStorage.setItem('taskflow_user', 'Admin');
            showToast('Hoş geldin Admin! 🎯', 'success');
            return true;
        }
        const user = PREDEFINED_USERS.find(u => u.name === name);
        if (user && user.password === password) {
            setCurrentUser(name);
            setIsAuthenticated(true);
            localStorage.setItem('taskflow_user', name);
            showToast(`Hoş geldin ${name}! 👋`, 'success');
            return true;
        }
        return false;
    };

    const logout = () => {
        setCurrentUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('taskflow_user');
        showToast('Çıkış yapıldı. Görüşmek üzere! 👋', 'info');
    };

    const addTask = async (title: string, detail: string, assignee: string, files: FileUploadData[]): Promise<boolean> => {
        if (!isAdmin) {
            showToast("❌ Sadece Admin yeni iş ekleyebilir!", 'error');
            return false;
        }

        const userObj = PREDEFINED_USERS.find(u => u.name === assignee);
        const password = userObj ? userObj.password : generateRandomPassword();
        const currentIds = tasks.map(t => parseInt(t.is_id)).filter(n => !isNaN(n));
        const maxId = currentIds.length > 0 ? Math.max(...currentIds) : 999;
        const newId = (maxId + 1).toString();
        const today = new Date().toISOString().split('T')[0];

        const newTask: Task = {
            is_id: newId,
            is_basligi: title,
            is_detayi: detail,
            is_atama_tarihi: today,
            atanan_kisi: assignee,
            sifre: password,
            ekler: [],
            notes: [],
            status: 'Beklemede'
        };

        setTasks(prev => [...prev, newTask]);

        // 🔧 Development mode
        if (DEV_MODE) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            showToast('✅ Görev başarıyla eklendi! (DEV MODE)', 'success');
            return true;
        }

        if (GOOGLE_SCRIPT_URL) {
            try {
                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'cors', // ✅ FIXED: Changed from 'no-cors'
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'addTask',
                        task: newTask,
                        files: files
                    })
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.status === 'success') {
                        showToast('✅ Görev başarıyla eklendi!', 'success');
                        setTimeout(fetchTasks, 2000);
                        return true;
                    } else {
                        throw new Error(result.message || 'Bilinmeyen hata');
                    }
                } else {
                    throw new Error(`HTTP ${response.status}`);
                }
            } catch (e: any) {
                console.error("Kayıt hatası", e);
                showToast(`❌ Kayıt sunucuya iletilemedi: ${e.message}`, 'error');
                return false;
            }
        }
        return false;
    };

    const addNote = async (taskId: string, noteText: string): Promise<void> => {
        const newNote: Note = {
            id: Date.now().toString(),
            text: noteText,
            createdAt: new Date().toLocaleDateString('tr-TR'),
            createdBy: currentUser || 'Anonim'
        };
        setTasks(prev => prev.map(t => t.is_id === taskId ? { ...t, notes: [...t.notes, newNote] } : t));

        // 🔧 Development mode
        if (DEV_MODE) {
            await new Promise(resolve => setTimeout(resolve, 500));
            showToast('📝 Not eklendi! (DEV MODE)', 'success');
            return;
        }

        if (GOOGLE_SCRIPT_URL) {
            try {
                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'addNote', is_id: taskId, note: newNote })
                });

                if (response.ok) {
                    showToast('📝 Not eklendi!', 'success');
                    setTimeout(fetchTasks, 2000);
                }
            } catch (e) {
                console.error(e);
                showToast('⚠️ Not kaydedilemedi', 'error');
            }
        }
    };

    const markTaskAsComplete = async (taskId: string): Promise<boolean> => {
        const task = tasks.find(t => t.is_id === taskId);
        if (!task) return false;

        setTasks(prev => prev.map(t => t.is_id === taskId ? { ...t, status: 'Tamamlandı' } : t));

        // 🔧 Development mode
        if (DEV_MODE) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            showToast('🎉 Görev tamamlandı! Mail gönderildi. (DEV MODE)', 'success');
            return true;
        }

        if (GOOGLE_SCRIPT_URL) {
            try {
                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'completeTask',
                        is_id: taskId,
                        editorName: currentUser,
                        taskTitle: task.is_basligi
                    })
                });

                if (response.ok) {
                    showToast('🎉 Görev tamamlandı! Mail gönderildi.', 'success');
                    setTimeout(fetchTasks, 2000);
                    return true;
                }
            } catch (e) {
                console.error(e);
                showToast('⚠️ Tamamlama kaydedilemedi', 'error');
            }
        }
        return false;
    };

    const submitTaskForApproval = async (task: Omit<PendingTask, 'status'>): Promise<boolean> => {
        const newPendingTask: PendingTask = { ...task, status: 'pending_approval' };
        setPendingApprovals(prev => [...prev, newPendingTask]);

        // 🔧 Development mode
        if (DEV_MODE) {
            await new Promise(resolve => setTimeout(resolve, 800));
            showToast('📤 Görev onaya gönderildi! (DEV MODE)', 'success');
            return true;
        }

        if (GOOGLE_SCRIPT_URL) {
            try {
                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'submitForApproval', task: newPendingTask })
                });

                if (response.ok) {
                    showToast('📤 Görev onaya gönderildi!', 'success');
                    return true;
                }
            } catch (e) {
                console.error(e);
                showToast('⚠️ Onay isteği gönderilemedi', 'error');
            }
        }
        return false;
    };

    const approveTask = async (taskId: string): Promise<boolean> => {
        if (!isAdmin) return false;

        if (GOOGLE_SCRIPT_URL) {
            try {
                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'approveTask', taskId })
                });

                if (response.ok) {
                    showToast('✅ Görev onaylandı!', 'success');
                    setPendingApprovals(prev => prev.filter(t => t.requestedBy !== taskId));
                    setTimeout(fetchTasks, 2000);
                    return true;
                }
            } catch (e) {
                console.error(e);
                showToast('⚠️ Onay işlemi başarısız', 'error');
            }
        }
        return false;
    };

    const rejectTask = async (taskId: string, reason: string): Promise<boolean> => {
        if (!isAdmin) return false;

        if (GOOGLE_SCRIPT_URL) {
            try {
                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'rejectTask', taskId, reason })
                });

                if (response.ok) {
                    showToast('❌ Görev reddedildi.', 'info');
                    setPendingApprovals(prev => prev.filter(t => t.requestedBy !== taskId));
                    return true;
                }
            } catch (e) {
                console.error(e);
                showToast('⚠️ Red işlemi başarısız', 'error');
            }
        }
        return false;
    };

    const getUserStats = (userName: string): UserStats => {
        const userTasks = tasks.filter(t => t.atanan_kisi === userName);
        const totalTasks = userTasks.length;
        const completedTasks = userTasks.filter(t => t.status === 'Tamamlandı').length;
        const pendingTasks = totalTasks - completedTasks;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        return { totalTasks, completedTasks, pendingTasks, completionRate };
    };

    return (
        <AppContext.Provider value={{
            tasks,
            pendingApprovals,
            currentUser,
            isAuthenticated,
            isAdmin,
            login,
            logout,
            users,
            allUsersData: PREDEFINED_USERS,
            addTask,
            addNote,
            markTaskAsComplete,
            submitTaskForApproval,
            approveTask,
            rejectTask,
            getUserStats,
            isLoading,
            showToast
        }}>
            {children}
            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed bottom-8 right-8 z-50 animate-slide-in">
                    <div className={`px-6 py-4 rounded-xl shadow-neumorph ${toastMessage.type === 'success' ? 'bg-green-100 text-green-800' :
                        toastMessage.type === 'error' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                        }`}>
                        {toastMessage.message}
                    </div>
                </div>
            )}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useApp must be used within AppProvider");
    return context;
};
