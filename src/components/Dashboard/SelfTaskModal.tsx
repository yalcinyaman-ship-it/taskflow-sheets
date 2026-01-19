import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import NeumorphButton from '../UI/NeumorphButton';
import { X, Send } from 'lucide-react';

interface SelfTaskModalProps {
    onClose: () => void;
}

const SelfTaskModal: React.FC<SelfTaskModalProps> = ({ onClose }) => {
    const { submitTaskForApproval, currentUser } = useApp();
    const [title, setTitle] = useState('');
    const [detail, setDetail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !detail.trim()) {
            alert('Lütfen tüm alanları doldurun!');
            return;
        }

        setIsSubmitting(true);
        const success = await submitTaskForApproval({
            is_basligi: title,
            is_detayi: detail,
            requestedBy: currentUser || '',
            requestedAt: new Date().toLocaleDateString('tr-TR'),
            ekler: []
        });

        setIsSubmitting(false);
        if (success) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-surface p-8 rounded-2xl shadow-neumorph w-full max-w-2xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-text">Kendime Görev Ekle</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Bu istek admin onayına gönderilecek
                        </p>
                    </div>
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

                    <div className="bg-blue-50 p-4 rounded-xl">
                        <p className="text-sm text-blue-700">
                            <strong>ℹ️ Bilgi:</strong> Bu görev eklendiğinde admin onayına gönderilir.
                            Onaylandıktan sonra görev listenizde görünecektir.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 justify-end">
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
                            className="flex items-center gap-2"
                        >
                            <Send className="w-5 h-5" />
                            {isSubmitting ? 'Gönderiliyor...' : 'Onaya Gönder'}
                        </NeumorphButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SelfTaskModal;
