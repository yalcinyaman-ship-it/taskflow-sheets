import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileUploadData } from '../../types';
import NeumorphCard from '../UI/NeumorphCard';
import NeumorphButton from '../UI/NeumorphButton';
import { X, Upload, FileText } from 'lucide-react';

interface NewTaskModalProps {
    onClose: () => void;
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({ onClose }) => {
    const { addTask, allUsersData } = useApp();
    const [title, setTitle] = useState('');
    const [detail, setDetail] = useState('');
    const [assignee, setAssignee] = useState('');
    const [files, setFiles] = useState<FileUploadData[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);

        selectedFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result as string;
                setFiles(prev => [...prev, {
                    name: file.name,
                    type: file.type,
                    data: base64.split(',')[1] // Remove data:mime;base64, prefix
                }]);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !detail.trim() || !assignee) {
            alert('Lütfen tüm alanları doldurun!');
            return;
        }

        setIsSubmitting(true);
        const success = await addTask(title, detail, assignee, files);
        setIsSubmitting(false);

        if (success) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-surface p-8 rounded-2xl shadow-neumorph w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-text">Yeni Görev Ekle</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 uppercase mb-2">
                            Görev Başlığı
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Örn: Kitap incelemesi"
                            className="w-full bg-surface border-none rounded-xl py-3 px-4 shadow-neumorph-inset focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 uppercase mb-2">
                            Görev Detayı
                        </label>
                        <textarea
                            value={detail}
                            onChange={(e) => setDetail(e.target.value)}
                            placeholder="Görevin detaylarını açıklayın..."
                            rows={5}
                            className="w-full bg-surface border-none rounded-xl py-3 px-4 shadow-neumorph-inset focus:outline-none resize-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 uppercase mb-2">
                            Atanan Kişi
                        </label>
                        <select
                            value={assignee}
                            onChange={(e) => setAssignee(e.target.value)}
                            className="w-full bg-surface border-none rounded-xl py-3 px-4 shadow-neumorph-inset focus:outline-none"
                            required
                        >
                            <option value="">Bir editör seçin...</option>
                            {allUsersData.map(user => (
                                <option key={user.name} value={user.name}>{user.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 uppercase mb-2 flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            Dosya Ekle (İsteğe bağlı)
                        </label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            multiple
                            className="w-full bg-surface border-none rounded-xl py-3 px-4 shadow-neumorph-inset focus:outline-none text-sm"
                        />
                        {files.length > 0 && (
                            <div className="mt-3 space-y-2">
                                <p className="text-xs text-gray-500 font-semibold">Yüklenen Dosyalar ({files.length}):</p>
                                {files.map((file, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-blue-50 p-2 rounded-lg">
                                        <div className="flex items-center gap-2 text-sm text-blue-700">
                                            <FileText className="w-4 h-4" />
                                            <span>{file.name}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setFiles(prev => prev.filter((_, i) => i !== idx))}
                                            className="text-red-500 hover:text-red-700 text-xs px-2"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                        <NeumorphButton
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            İptal
                        </NeumorphButton>
                        <NeumorphButton
                            type="submit"
                            variant="primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Ekleniyor...' : 'Görevi Ekle'}
                        </NeumorphButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewTaskModal;
