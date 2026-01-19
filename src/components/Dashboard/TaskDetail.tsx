import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task } from '../../types';
import NeumorphCard from '../UI/NeumorphCard';
import NeumorphButton from '../UI/NeumorphButton';
import { X, Calendar, User, FileText, MessageSquare, CheckCircle, Send } from 'lucide-react';

interface TaskDetailProps {
    task: Task;
    onClose: () => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ task, onClose }) => {
    const { addNote, markTaskAsComplete, currentUser, isAdmin } = useApp();
    const [noteText, setNoteText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const canComplete = task.status === 'Beklemede' && (
        currentUser === task.atanan_kisi || isAdmin
    );

    const handleAddNote = async () => {
        if (!noteText.trim()) return;
        setIsSubmitting(true);
        await addNote(task.is_id, noteText);
        setNoteText('');
        setIsSubmitting(false);
    };

    const handleComplete = async () => {
        if (!confirm('Bu görevi tamamlandı olarak işaretlemek istediğinize emin misiniz?')) return;
        setIsSubmitting(true);
        await markTaskAsComplete(task.is_id);
        setIsSubmitting(false);
        setTimeout(onClose, 1500); // Close modal after success
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <NeumorphCard className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-bold text-text">{task.is_basligi}</h2>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${task.status === 'Tamamlandı'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                {task.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500">Görev ID: #{task.is_id}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Details */}
                <div className="space-y-4 mb-6">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Açıklama</h3>
                        <p className="text-gray-700 bg-gray-50 p-4 rounded-xl">{task.is_detayi}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Atama Tarihi</p>
                                <p className="font-medium">{task.is_atama_tarihi}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <User className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Atanan Kişi</p>
                                <p className="font-medium">{task.atanan_kisi}</p>
                            </div>
                        </div>
                    </div>

                    {/* Attachments */}
                    {task.ekler.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Ekler ({task.ekler.length})
                            </h3>
                            <div className="space-y-2">
                                {task.ekler.map((ek, idx) => (
                                    <a
                                        key={idx}
                                        href={ek}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-blue-700 text-sm"
                                    >
                                        📎 Ek Dosya {idx + 1}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Notes Section */}
                <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        Notlar ({task.notes.length})
                    </h3>

                    {/* Existing notes */}
                    <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                        {task.notes.length === 0 ? (
                            <p className="text-gray-400 text-sm italic">Henüz not eklenmemiş.</p>
                        ) : (
                            task.notes.map(note => (
                                <div key={note.id} className="bg-gray-50 p-3 rounded-xl">
                                    <p className="text-sm text-gray-700 mb-1">{note.text}</p>
                                    <p className="text-xs text-gray-500">
                                        {note.createdBy} • {note.createdAt}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Add note */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="Yeni bir not ekle..."
                            className="flex-1 bg-surface border-none rounded-xl py-3 px-4 shadow-neumorph-inset focus:outline-none"
                            onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
                        />
                        <NeumorphButton
                            variant="primary"
                            onClick={handleAddNote}
                            disabled={isSubmitting || !noteText.trim()}
                            className="px-6"
                        >
                            <Send className="w-5 h-5" />
                        </NeumorphButton>
                    </div>
                </div>

                {/* Actions */}
                {canComplete && (
                    <div className="border-t border-gray-200 pt-6 mt-6">
                        <NeumorphButton
                            variant="primary"
                            onClick={handleComplete}
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center gap-2 py-4 text-lg font-bold bg-green-500 hover:bg-green-600"
                        >
                            <CheckCircle className="w-6 h-6" />
                            {isSubmitting ? 'Tamamlanıyor...' : 'Görevi Tamamla 🎉'}
                        </NeumorphButton>
                        <p className="text-xs text-gray-500 text-center mt-2">
                            Tamamlandı olarak işaretlendiğinde yalcinyaman@timas.com.tr adresine mail gönderilir.
                        </p>
                    </div>
                )}

                {task.status === 'Tamamlandı' && (
                    <div className="bg-green-50 p-4 rounded-xl mt-4">
                        <p className="text-green-700 font-medium text-center">
                            ✅ Bu görev tamamlandı!
                        </p>
                    </div>
                )}
            </NeumorphCard>
        </div>
    );
};

export default TaskDetail;
