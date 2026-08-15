import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { FolderDown, Plus, Download, FileText } from 'lucide-react';

export const DocumentsPage = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Forms & Templates',
    size: '1.5 MB'
  });

  const fetchDocs = async () => {
    try {
      const res = await api.get('/documents');
      if (res.data?.success) setDocuments(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      await api.post('/documents', formData);
      showToast('Document record uploaded to Supabase Storage!', 'success');
      setIsModalOpen(false);
      fetchDocs();
    } catch (err) {
      showToast('Failed to upload document', 'error');
    }
  };

  const isAuthorized = user?.role === 'ADMIN' || user?.role === 'ANO';
  const inputClass = "w-full p-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[#172033] text-xs focus:outline-none focus:ring-2 focus:ring-[#12355B]/20 focus:border-[#12355B]";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#172033]">Document Library & Supabase Storage</h2>
          <p className="text-xs text-[#64748B]">Download camp forms, medical templates, and standing orders</p>
        </div>
        {isAuthorized && (
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Upload Document
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="text-[#12355B] font-bold text-sm">Loading document repository...</div>
        ) : (
          documents.map(doc => (
            <div key={doc.id} className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[#EAF1F8] text-[#12355B]">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#172033]">{doc.name}</h3>
                  <div className="text-[10px] text-[#64748B] mt-0.5">{doc.category} • {doc.size}</div>
                  <div className="text-[9px] text-[#94A3B8] mt-1">Uploaded by: {doc.uploadedBy} on {doc.uploadDate}</div>
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={() => showToast(`Downloading ${doc.name}`, 'info')} className="gap-1">
                <Download className="w-3.5 h-3.5" />
                Download
              </Button>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Document Metadata">
        <form onSubmit={handleUpload} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#172033] mb-1 font-semibold">Document Name *</label>
            <input type="text" value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Camp_Parent_Consent_Form.pdf"
              className={inputClass} required />
          </div>
          <div>
            <label className="block text-[#172033] mb-1 font-semibold">Category</label>
            <input type="text" value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className={inputClass} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Store Document</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
