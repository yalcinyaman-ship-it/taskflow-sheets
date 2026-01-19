import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import NeumorphCard from '../UI/NeumorphCard';
import NeumorphButton from '../UI/NeumorphButton';
import { LogOut, Users, Key, FileText } from 'lucide-react';

interface SidebarProps {
    selectedEditor?: string | null;
    onSelectEditor?: (editor: string | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedEditor, onSelectEditor }) => {
    const { currentUser, isAdmin, users, allUsersData, logout, pendingApprovals } = useApp();

    return (
        <aside className="h-full flex flex-col p-6 bg-surface">
            {/* User Info */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gs-gradient flex items-center justify-center text-white font-bold text-xl">
                        {currentUser?.charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold text-text">{currentUser}</p>
                        <p className="text-xs text-gray-500">{isAdmin ? '🎯 Yönetici' : '✏️ Editör'}</p>
                    </div>
                </div>
            </div>

            {/* Admin Section */}
            {isAdmin && (
                <>
                    {/* Pending Approvals */}
                    {pendingApprovals.length > 0 && (
                        <NeumorphCard className="mb-4 bg-yellow-50">
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-5 h-5 text-yellow-600" />
                                <h3 className="font-bold text-yellow-800">Bekleyen Onaylar</h3>
                            </div>
                            <p className="text-sm text-yellow-700">
                                {pendingApprovals.length} görev onay bekliyor
                            </p>
                        </NeumorphCard>
                    )}

                    {/* Team Workload */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Ekip İş Yükü
                        </h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {/* "Tümü" option for admin */}
                            {isAdmin && onSelectEditor && (
                                <button
                                    onClick={() => onSelectEditor(null)}
                                    className={`w-full flex justify-between items-center text-sm py-2 px-3 rounded-lg transition-colors ${selectedEditor === null
                                            ? 'bg-primary text-white'
                                            : 'hover:bg-gray-100'
                                        }`}
                                >
                                    <span className="font-semibold">📋 Tüm Görevler</span>
                                </button>
                            )}

                            {users.map(user => (
                                <button
                                    key={user.name}
                                    onClick={() => isAdmin && onSelectEditor && onSelectEditor(user.name)}
                                    className={`w-full flex justify-between items-center text-sm py-2 px-3 rounded-lg transition-colors ${isAdmin ? 'cursor-pointer hover:bg-gray-100' : ''
                                        } ${selectedEditor === user.name
                                            ? 'bg-primary text-white'
                                            : ''
                                        }`}
                                    disabled={!isAdmin}
                                >
                                    <span className={selectedEditor === user.name ? 'text-white font-semibold' : 'text-gray-700'}>
                                        {user.name}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${selectedEditor === user.name
                                            ? 'bg-white/20 text-white'
                                            : user.taskCount === 0 ? 'bg-green-100 text-green-700' :
                                                user.taskCount <= 3 ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                        }`}>
                                        {user.taskCount}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* User Passwords */}
                    <div className="mb-6">
                        <details className="group">
                            <summary className="text-sm font-semibold text-gray-600 uppercase mb-2 cursor-pointer flex items-center gap-2 hover:text-primary">
                                <Key className="w-4 h-4" />
                                Kullanıcı Şifreleri
                            </summary>
                            <div className="mt-2 space-y-1 text-xs max-h-48 overflow-y-auto">
                                <div className="flex justify-between py-1 font-bold border-b">
                                    <span>Admin:</span>
                                    <span>4337</span>
                                </div>
                                {allUsersData.map(user => (
                                    <div key={user.name} className="flex justify-between py-1">
                                        <span className="text-gray-600">{user.name}:</span>
                                        <span className="font-mono text-gray-800">{user.password}</span>
                                    </div>
                                ))}
                            </div>
                        </details>
                    </div>
                </>
            )}

            {/* Spacer */}
            <div className="flex-1"></div>

            {/* Logout */}
            <NeumorphButton
                variant="danger"
                onClick={logout}
                className="w-full flex items-center justify-center gap-2"
            >
                <LogOut className="w-5 h-5" />
                Çıkış Yap
            </NeumorphButton>

            {/* Footer */}
            <div className="mt-4 text-center">
                <p className="text-xs text-gray-400">TaskFlow v2.0</p>
                <p className="text-xs text-gray-400">Timas Yayınları</p>
            </div>
        </aside>
    );
};

export default Sidebar;
