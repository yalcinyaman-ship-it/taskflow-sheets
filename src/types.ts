export interface Note {
    id: string;
    text: string;
    createdAt: string;
    createdBy: string;
}

export interface Task {
    is_id: string;
    is_basligi: string;
    is_detayi: string;
    is_atama_tarihi: string;
    atanan_kisi: string;
    sifre: string;
    ekler: string[];
    notes: Note[];
    status: 'Beklemede' | 'Tamamlandı';
}

export interface UserSummary {
    name: string;
    taskCount: number;
}

export interface UserData {
    name: string;
    password: string;
}

export interface FileUploadData {
    name: string;
    type: string;
    data: string; // Base64
}

export interface UserStats {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    completionRate: number;
}

export interface PendingTask {
    is_basligi: string;
    is_detayi: string;
    requestedBy: string;
    requestedAt: string;
    status: 'pending_approval';
    ekler: string[];
}
