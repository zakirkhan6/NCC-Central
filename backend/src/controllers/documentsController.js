import { dbStore } from '../store/index.js';

export const getDocuments = (req, res) => {
  const documents = dbStore.getCollection('documents');
  return res.json({ success: true, data: documents });
};

export const createDocument = (req, res) => {
  const { name, category, size } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Document name is required.' });

  const newDoc = {
    id: `doc-${Date.now()}`,
    name,
    category: category || 'General',
    size: size || '1.2 MB',
    uploadedBy: req.user.fullName,
    uploadDate: new Date().toISOString().split('T')[0],
    url: '#'
  };

  dbStore.addItem('documents', newDoc);

  dbStore.addItem('auditLogs', {
    id: `log-${Date.now()}`,
    user: req.user.fullName,
    role: req.user.role,
    action: 'DOCUMENT_UPLOADED',
    resource: `Document (${name})`,
    timestamp: new Date().toISOString(),
    details: `Uploaded document under category ${category}`
  });

  return res.status(201).json({ success: true, message: 'Document added successfully.', data: newDoc });
};

export const deleteDocument = (req, res) => {
  const { id } = req.params;
  dbStore.deleteItem('documents', id);
  return res.json({ success: true, message: 'Document deleted.' });
};
