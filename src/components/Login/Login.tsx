import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Neomorph from '../UI/NeumorphCard';
import NeumorphButton from '../UI/NeumorphButton';
import { Zap, Shield, Trophy } from 'lucide-react';

const Login = () => {
    const { users, login } = useApp();
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) {
            setError('Lütfen bir kullanıcı seçin.');
            return;
        }
        const success = login(selectedUser, password);
        if (!success) {
            setError('Hatalı şifre veya kullanıcı adı.');
            setPassword('');
        }
    };

    // Particle background
    const particles = Array.from({ length: 20 }, (_, i) => (
        <div
            key={i}
            className="particle"
            style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${8 + Math.random() * 4}s`
            }}
        />
    ));

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-background via-surface to-gray-300">
            {/* Particle background */}
            <div className="absolute inset-0 pointer-events-none">
                {particles}
            </div>

            {/* Hero section */}
            <div className="relative z-10">
                {/* Top banner with Galatasaray theme */}
                <div className="h-4 bg-gs-gradient"></div>

                {/* Main content */}
                <div className="container mx-auto px-4 py-8">
                    <div className="grid md:grid-cols-2 gap-8 items-center min-h-[calc(100vh-4rem)]">

                        {/* Left side - Hero imagery */}
                        <div className="hidden md:flex flex-col items-center justify-center space-y-6 animate-float">
                            <img
                                src="/marvel-heroes.png"
                                alt="Marvel Heroes"
                                className="w-full max-w-lg rounded-3xl shadow-2xl"
                            />
                            <div className="text-center">
                                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gs-gradient mb-2">
                                    HER GÖREV BİR KAHRMANLIK HİKAYESİDİR
                                </h2>
                                <p className="text-gray-600 text-lg font-medium">
                                    Ekibinle güçlü kal, görevlerini tamamla! 💪
                                </p>
                            </div>

                            {/* Galatasaray badge */}
                            <div className="flex items-center gap-4 p-4 glass rounded-2xl animate-pulse-glow">
                                <img
                                    src="/galatasaray-logo.png"
                                    alt="Galatasaray"
                                    className="w-16 h-16 rounded-full"
                                />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">Powered by</p>
                                    <p className="font-bold text-lg text-text">Galatasaray S.K.</p>
                                </div>
                            </div>
                        </div>

                        {/* Right side - Login form */}
                        <div className="flex items-center justify-center">
                            <Neomorph className="w-full max-w-md mx-auto relative">
                                {/* Accent bar */}
                                <div className="absolute top-0 left-0 w-full h-2 bg-gs-gradient rounded-t-2xl"></div>

                                {/* Header */}
                                <div className="mb-8 text-center pt-4">
                                    <div className="flex items-center justify-center gap-3 mb-4">
                                        <Shield className="w-10 h-10 text-primary" />
                                        <h1 className="text-4xl font-black text-text tracking-tight">TaskFlow</h1>
                                        <Zap className="w-10 h-10 text-gs-yellow" />
                                    </div>
                                    <p className="text-gray-500 text-sm font-medium">Editör Yönetim Sistemi</p>
                                    <p className="text-xs text-gray-400 mt-2 flex items-center justify-center gap-2">
                                        <Trophy className="w-4 h-4" />
                                        Her görev bir zafer!
                                    </p>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleLogin} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                                            Kullanıcı Seçin
                                        </label>
                                        <select
                                            value={selectedUser}
                                            onChange={(e) => { setSelectedUser(e.target.value); setError(''); }}
                                            className="w-full bg-surface border-none rounded-xl py-4 px-5 shadow-neumorph-inset focus:outline-none focus:shadow-neumorph transition-shadow text-text font-medium"
                                        >
                                            <option value="" disabled>Bir isim seçin...</option>
                                            <option value="Admin" className="font-bold">🎯 Admin (Yönetici)</option>
                                            <optgroup label="Editörler" className="font-medium">
                                                {users.map(u => (
                                                    <option key={u.name} value={u.name}>
                                                        {u.name} {u.taskCount > 0 && `(${u.taskCount} görev)`}
                                                    </option>
                                                ))}
                                            </optgroup>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                                            Şifre
                                        </label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                            placeholder="••••••"
                                            className="w-full bg-surface border-none rounded-xl py-4 px-5 shadow-neumorph-inset focus:outline-none focus:shadow-neumorph transition-shadow text-text font-medium"
                                        />
                                    </div>

                                    {error && (
                                        <div className="text-red-500 text-sm text-center bg-red-50 py-3 px-4 rounded-xl font-medium">
                                            ⚠️ {error}
                                        </div>
                                    )}

                                    <NeumorphButton
                                        type="submit"
                                        variant="primary"
                                        className="w-full text-lg font-bold py-4"
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            <Zap className="w-5 h-5" />
                                            Göreve Başla!
                                        </span>
                                    </NeumorphButton>
                                </form>

                                {/* Footer */}
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <p className="text-center text-xs text-gray-400">
                                        TaskFlow v2.0 • Timas Yayınları
                                    </p>
                                </div>
                            </Neomorph>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
