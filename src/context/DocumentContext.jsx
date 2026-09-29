// client/src/context/DocumentContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export const DocumentContext = createContext();

export const DocumentProvider = ({ children }) => {
    const {user}=useAuth();
  const { token } = useAuth();
  const [documents, setDocuments] = useState([]);
  
  // Verify this exact line:
  const [activeDoc, setActiveDoc] = useState(null); 
  const [loadingDocs, setLoadingDocs] = useState(true);

  const currentRole = (() => {
  if (!activeDoc || !user) return 'viewer';
  const userId = user.id || user._id;
  const ownerId = activeDoc.owner?._id || activeDoc.owner;

  if (ownerId && ownerId.toString() === userId?.toString()) {
    return 'owner';
  }
  const collab = activeDoc.collaborators?.find((c) => {
    const cId = c.user?._id || c.user?.id || c.user;
    return cId?.toString() === userId?.toString();
  });
  return collab ? collab.role : 'viewer';
})();

const isOwner = currentRole === 'owner';
const canEdit = currentRole === 'owner' || currentRole === 'editor';

  const fetchDocuments = async () => {
    if (!token) return;
    try {
      setLoadingDocs(true);
      const res = await fetch('/api/documents', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        setDocuments(data);
        // Line 25: Call setActiveDoc
        if (data.length > 0) {
          setActiveDoc(data[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [token]);

  const createDocument = async (title = 'Untitled List') => {
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        window.location.reload();
        return null;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create document');

      setDocuments((prev) => [data, ...prev]);
      setActiveDoc(data);
      return data;
    } catch (err) {
      console.error('Document creation failed:', err.message);
      return null;
    }
  };

  const updateDocumentTitle = async (docId, title) => {
    try {
      const res = await fetch(`/api/documents/${docId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      });
      if (res.ok) {
        setDocuments((prev) =>
          prev.map((d) => (d._id === docId ? { ...d, title } : d))
        );
        if (activeDoc?._id === docId) {
          setActiveDoc((prev) => ({ ...prev, title }));
        }
      }
    } catch (err) {
      console.error('Failed to rename document:', err);
    }
  };

  const deleteDocument = async (docId) => {
    try {
      const res = await fetch(`/api/documents/${docId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const remaining = documents.filter((d) => d._id !== docId);
        setDocuments(remaining);
        setActiveDoc(remaining[0] || null);
      }
    } catch (err) {
      console.error('Failed to delete document:', err);
    }
  };

  const shareDocument = async (docId, username, role = 'editor') => {
    const res = await fetch(`/api/documents/${docId}/share`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username, role }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to share document');

    setDocuments((prev) =>
      prev.map((d) => (d._id === docId ? { ...d, collaborators: data.collaborators } : d))
    );
    if (activeDoc?._id === docId) {
      setActiveDoc((prev) => ({ ...prev, collaborators: data.collaborators }));
    }
    return data;
  };

  const updateCollaboratorRole = async (docId, userId, newRole) => {
  try {
    const res = await fetch(`/api/documents/${docId}/collaborators/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role: newRole }),
    });
    const updatedDoc = await res.json();
    if (res.ok) {
      setDocuments((prev) => prev.map((d) => (d._id === docId ? updatedDoc : d)));
      if (activeDoc?._id === docId) setActiveDoc(updatedDoc);
    }
  } catch (err) {
    console.error('Failed to update collaborator role:', err);
  }
};

const removeCollaborator = async (docId, userId) => {
  try {
    const res = await fetch(`/api/documents/${docId}/collaborators/${userId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const updatedDoc = await res.json();
    if (res.ok) {
      setDocuments((prev) => prev.map((d) => (d._id === docId ? updatedDoc : d)));
      if (activeDoc?._id === docId) setActiveDoc(updatedDoc);
    }
  } catch (err) {
    console.error('Failed to remove collaborator:', err);
  }
};

  return (
    <DocumentContext.Provider
      value={{
        documents,
        activeDoc,
        setActiveDoc,
        loadingDocs,
        createDocument,
        updateDocumentTitle,
        deleteDocument,
        shareDocument,
        updateCollaboratorRole,
        removeCollaborator,
        isOwner,
        canEdit
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocument = () => useContext(DocumentContext);