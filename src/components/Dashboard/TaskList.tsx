import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task } from '../../types';
import NeumorphCard from '../UI/NeumorphCard';
import NeumorphButton from '../UI/NeumorphButton';
import Statistics from './Statistics';
import { FileText, Calendar, User, Plus } from 'lucide-react';
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
                        <NeumorphCard
                            key={task.is_id}
                            className="cursor-pointer hover:shadow-neumorph-sm transition-shadow"
                            onClick={() => onSelectTask(task)}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="font-bold text-lg text-text line-clamp-2">{task.is_basligi}</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${task.status === 'Tamamlandı'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {task.status === 'Tamamlandı' ? '✅' : '⏳'}
                                </span>
                            </div>

                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{task.is_detayi}</p>

                            <div className="space-y-2 text-xs text-gray-500">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{task.is_atama_tarihi}</span>
                                </div>
                                {isAdmin && (
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        <span>{task.atanan_kisi}</span>
                                    </div>
                                )}
                                {task.ekler.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        <span>{task.ekler.length} ek dosya</span>
                                    </div>
                                )}
                            </div>
                        </NeumorphCard>
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
