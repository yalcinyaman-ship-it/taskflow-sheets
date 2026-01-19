import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task } from '../../types';
import NeumorphCard from '../UI/NeumorphCard';
import NeumorphButton from '../UI/NeumorphButton';
import Statistics from './Statistics';
import { FileText, Plus } from 'lucide-react';
import SelfTaskModal from './SelfTaskModal';

interface TaskListProps {
    onSelectTask: (task: Task) => void;
    selectedEditor?: string | null;
}

const TaskList: React.FC<TaskListProps> = ({ onSelectTask, selectedEditor }) => {
    const { tasks, currentUser, isAdmin } = useApp();
    const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
    const [isSelfTaskModalOpen, setIsSelfTaskModalOpen] = useState(false);

    // Filter by selected editor (admin) or current user (editor)
    let userTasks = isAdmin ? tasks : tasks.filter(t => t.atanan_kisi === currentUser);

    // If admin selected a specific editor, filter for that editor (only)
    if (isAdmin && selectedEditor) {
        userTasks = tasks.filter(t => t.atanan_kisi === selectedEditor);
    }

    const filteredTasks = userTasks.filter(t =>
        activeTab === 'active' ? t.status === 'Beklemede' : t.status === 'Tamamlandı'
    );

    return (
        <div>
            <Statistics />

            {/* Tab Navigation + Self-task button */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col gap-2">
                    {isAdmin && selectedEditor && (
                        <p className="text-sm text-gray-600">
                            🔍 Filtreleniyor: <span className="font-semibold text-primary">{selectedEditor}</span>
                        </p>
                    )}
                    <div className="flex gap-2">
                        <NeumorphButton
                            variant={activeTab === 'active' ? 'primary' : 'secondary'}
                            onClick={() => setActiveTab('active')}
                            className="px-6 py-2"
                        >
                            Aktif Görevler ({userTasks.filter(t => t.status === 'Beklemede').length})
                        </NeumorphButton>
                        <NeumorphButton
                            variant={activeTab === 'completed' ? 'primary' : 'secondary'}
                            onClick={() => setActiveTab('completed')}
                            className="px-6 py-2"
                        >
                            Tamamlananlar ({userTasks.filter(t => t.status === 'Tamamlandı').length})
                        </NeumorphButton>
                    </div>
                </div>

                {/* Self-task button for editors */}
                {!isAdmin && (
                    <NeumorphButton
                        variant="secondary"
                        onClick={() => setIsSelfTaskModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2"
                    >
                        <Plus size={18} />
                        Kendime İş Ekle
                    </NeumorphButton>
                )}
            </div>

            {/* Task Grid */}
            {filteredTasks.length === 0 ? (
                <NeumorphCard className="text-center py-12">
                    <p className="text-gray-400 text-lg">
                        {activeTab === 'active' ? '🎉 Harika! Şu an aktif görevin yok.' : '📋 Henüz tamamlanmış görev yok.'}
                    </p>
                </NeumorphCard>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTasks.map(task => (
                        <div
                            key={task.is_id}
                            onClick={() => onSelectTask(task)}
                            className="cursor-pointer"
                        >
                            <NeumorphCard className="hover:shadow-neumorph-lg transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-text mb-1">{task.is_basligi}</h3>
                                        <p className="text-sm text-gray-600 line-clamp-2">{task.is_detayi}</p>
                                    </div>
                                    <span className={`ml-3 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${task.status === 'Tamamlandı'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {task.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span>📅 {task.is_atama_tarihi}</span>
                                    <span>👤 {task.atanan_kisi}</span>
                                    {task.notes.length > 0 && <span>💬 {task.notes.length}</span>}
                                    {task.ekler.length > 0 && (
                                        <span className="flex items-center gap-1">
                                            <FileText className="w-3 h-3" />
                                            {task.ekler.length}
                                        </span>
                                    )}
                                </div>
                            </NeumorphCard>
                        </div>
                    ))}
                </div>
            )}

            {/* Self Task Modal */}
            {isSelfTaskModalOpen && (
                <SelfTaskModal onClose={() => setIsSelfTaskModalOpen(false)} />
            )}
        </div>
    );
};

export default TaskList;
