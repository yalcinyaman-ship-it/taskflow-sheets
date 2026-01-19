import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import Login from './components/Login/Login';
import Sidebar from './components/Dashboard/Sidebar';
import TaskList from './components/Dashboard/TaskList';
import TaskDetail from './components/Dashboard/TaskDetail';
import NewTaskModal from './components/Dashboard/NewTaskModal';
import { Task } from './types';
import NeumorphButton from './components/UI/NeumorphButton';
import { Plus, Menu, X } from 'lucide-react';

const App: React.FC = () => {
    const { isAuthenticated, isAdmin } = useApp();
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [selectedEditor, setSelectedEditor] = useState<string | null>(null); // For filtering by editor

    if (!isAuthenticated) {
        return <Login />;
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-background overflow-hidden">

            {/* Mobile Header */}
            <div className="md:hidden flex justify-between items-center p-4 bg-surface shadow-sm z-20">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gs-gradient rounded-full"></div>
                    <h1 className="font-bold text-lg text-primary">TaskFlow</h1>
                </div>
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar - Mobile Responsive */}
            <div className={`
        fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 md:relative md:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        w-64 bg-surface shadow-neumorph
      `}
            >
                <Sidebar
                    selectedEditor={selectedEditor}
                    onSelectEditor={setSelectedEditor}
                />
            </div>

            {/* Overlay for mobile sidebar */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-20 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                ></div>
            )}

            {/* Main Content */}
            <main className="flex-1 h-screen overflow-y-auto relative p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-text mb-1">İş Listesi</h2>
                            <p className="text-sm text-gray-500">
                                {isAdmin ? '🎯 Tüm personel iş yönetimi (Admin)' : '✏️ Size atanan görevler'}
                            </p>
                        </div>

                        {isAdmin && (
                            <NeumorphButton
                                onClick={() => setIsNewTaskModalOpen(true)}
                                variant="primary"
                                className="flex items-center gap-2 text-sm px-6 py-3"
                            >
                                <Plus size={18} />
                                <span>Yeni İş Ekle</span>
                            </NeumorphButton>
                        )}
                    </div>

                    <TaskList
                        onSelectTask={setSelectedTask}
                        selectedEditor={selectedEditor}
                    />
                </div>
            </main>

            {/* Modals */}
            {selectedTask && (
                <TaskDetail
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                />
            )}

            {isNewTaskModalOpen && (
                <NewTaskModal onClose={() => setIsNewTaskModalOpen(false)} />
            )}
        </div>
    );
};

export default App;
