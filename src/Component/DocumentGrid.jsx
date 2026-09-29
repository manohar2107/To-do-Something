// client/src/components/DocumentGrid.jsx
import React, { useState } from 'react';
import { useDocument } from '../context/DocumentContext';
import './DocumentGrid.css';

export const DocumentGrid = () => {
  const { documents, activeDoc, setActiveDoc, createDocument } = useDocument();
  const [isCreating, setIsCreating] = useState(false);
  const [titleInput, setTitleInput] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!titleInput.trim()) return;
    await createDocument(titleInput.trim());
    setTitleInput('');
    setIsCreating(false);
  };

  return (
    <div className="doc-grid-container">
      <div className="doc-cards-grid">
        {/* 1. Dynamic "Add Document" Action Card */}
        <div className="doc-tile add-tile-card">
          {isCreating ? (
            <form onSubmit={handleCreate} className="add-tile-form">
              <input
                type="text"
                placeholder="List name..."
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setIsCreating(false);
                }}
              />
              <div className="add-tile-actions">
                <button type="submit" className="tile-confirm-btn">Create</button>
                <button type="button" className="tile-cancel-btn" onClick={() => setIsCreating(false)}>✕</button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              className="add-tile-trigger"
              onClick={() => setIsCreating(true)}
            >
              <div className="add-icon-circle">+</div>
              <span className="add-tile-label">New List</span>
            </button>
          )}
        </div>

        {/* 2. User Document Tiles */}
        {documents.map((doc) => {
          const isActive = activeDoc?._id === doc._id;
          const isShared = doc.collaborators?.length > 0;

          return (
            <div
              key={doc._id}
              className={`doc-tile ${isActive ? 'active-tile' : ''}`}
              onClick={() => setActiveDoc(doc)}
            >
              <div className="doc-tile-top">
                <span className="doc-tile-icon">📄</span>
                {isShared && (
                  <span className="shared-pill" title={`Shared with ${doc.collaborators.length} user(s)`}>
                    👥 {doc.collaborators.length}
                  </span>
                )}
              </div>

              <div className="doc-tile-body">
                <h4 className="doc-tile-title" title={doc.title}>
                  {doc.title}
                </h4>
                <p className="doc-tile-meta">
                  {doc.tasks ? `${doc.tasks.length} items` : 'Workspace'}
                </p>
              </div>

              <div className="doc-tile-bar" />
            </div>
          );
        })}
      </div>
    </div>
  );
};