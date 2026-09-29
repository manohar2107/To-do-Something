import React, { useState } from 'react';
import { useDocument } from '../context/DocumentContext';

export const DocumentSidebar = () => {
  const { documents, activeDoc, setActiveDoc, createDocument } = useDocument();
  const [newTitle, setNewTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await createDocument(newTitle.trim());
    setNewTitle('');
    setIsCreating(false);
  };

  return (
    <aside className="doc-sidebar">
      <div className="sidebar-header">
        <h4>Ambigous Chick-Docs</h4>
        <button className="new-doc-btn" onClick={() => setIsCreating((prev) => !prev)}>
          +
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="create-doc-inline">
          <input
            type="text"
            placeholder="List Na-Me..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            autoFocus
          />
          <button type="submit">Add</button>
        </form>
      )}

      <div className="doc-grid">
    {documents.map((doc) => {
    const isActive = activeDoc?._id === doc._id;

    return (
      <div
        key={doc._id}
        className={`doc-card-page ${isActive ? 'active' : ''}`}
        onClick={() => setActiveDoc(doc)}
      >
        {/* Miniature Document Sheet */}
        <div className="doc-sheet">
          {/* Top Folded Dog-Ear Corner */}
          <div className="doc-corner-fold" />

          {/* Miniature simulated document text lines */}
          <div className="doc-sheet-preview">
            <span className="skeleton-line title-line" />
            <span className="skeleton-line" />
            <span className="skeleton-line" />
            <span className="skeleton-line short-line" />
          </div>

          {/* Shared indicator pill */}
          {doc.collaborators?.length > 0 && (
            <div
              className="doc-shared-badge"
              title={`Shared with ${doc.collaborators.length} collaborator(s)`}
            >
              👥
            </div>
          )}
        </div>

        {/* Document Title */}
        <div className="doc-card-info">
          <span className="doc-card-title" title={doc.title}>
            {doc.title}
          </span>
        </div>
      </div>
    );
  })}
</div>
    </aside>
  );
};