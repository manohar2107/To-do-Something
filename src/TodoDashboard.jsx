import React, { useState } from 'react';
import { useDocument } from './context/DocumentContext';
import { DocumentGrid } from './Component/DocumentGrid';
import { ShareModal } from './Component/ShareModal';
import ToDoInput from './Component/ToDoInput';
import ToDoList from './Component/ToDoList';
import './TodoDashboard.css';

export const TodoDashboard = () => {
  const { activeDoc, setActiveDoc, updateDocumentTitle, deleteDocument, isOwner, canEdit } = useDocument();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [docTitle, setDocTitle] = useState('');

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (docTitle.trim() && docTitle !== activeDoc?.title) {
      updateDocumentTitle(activeDoc._id, docTitle.trim());
    }
  };

  // -------------------------------------------------------------
  // VIEW 1: No workspace active -> Render ONLY the Workspaces Grid
  // -------------------------------------------------------------
  if (!activeDoc) {
    return (
      <div className="workspace-container">
        <header className="workspace-view-header">
          <h2>Your Workspaces</h2>
          <p className="workspace-view-subtitle">Select an existing list or create a new workspace.</p>
        </header>
        <section className="workspace-grid-section">
          <DocumentGrid />
        </section>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: Active workspace selected -> Render ONLY that Document
  // -------------------------------------------------------------
  return (
    <div className="workspace-container">
      {/* Navigation & Document Action Bar */}
      <div className="active-doc-topbar">
        <button
          type="button"
          className="back-workspaces-btn"
          onClick={() => setActiveDoc(null)}
        >
          ← All Workspaces
        </button>

        <div className="doc-title-group">
          {isEditingTitle && isOwner ? (
            <input
              className="inline-doc-title-input"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleBlur()}
              autoFocus
            />
          ) : (
            <h2
              className={`doc-display-title ${isOwner ? 'editable' : ''}`}
              onClick={() => {
                if (isOwner) {
                  setDocTitle(activeDoc.title);
                  setIsEditingTitle(true);
                }
              }}
              title={isOwner ? "Click to rename" : "Workspace Name"}
            >
              {activeDoc.title} {isOwner && <span className="edit-pencil">✏️</span>}
            </h2>
          )}
        </div>

        <div className="doc-header-actions">
          {isOwner && (
            <>
              <button
                type="button"
                className="share-btn-pill"
                onClick={() => setIsShareOpen(true)}
              >
                👥 Share
              </button>
              <button
                type="button"
                className="doc-delete-btn"
                title="Delete Workspace"
                onClick={() => {
                  if (window.confirm(`Delete "${activeDoc.title}" and all its tasks?`)) {
                    deleteDocument(activeDoc._id);
                    setActiveDoc(null);
                  }
                }}
              >
                🗑️
              </button>
            </>
          )}
        </div>
      </div>

      {/* Read-Only Banner for Viewers */}
      {!canEdit && (
        <div className="viewer-mode-notice">
          👁️ You are viewing this workspace in Read-Only mode.
        </div>
      )}

      {/* Active Workspace Task Panel */}
      <div className="active-workspace-layout">
        {canEdit && (
          <aside className="workspace-input-panel">
            <ToDoInput />
          </aside>
        )}
        <main className={`workspace-tasks-panel ${!canEdit ? 'full-width' : ''}`}>
          <ToDoList />
        </main>
      </div>

      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </div>
  );
};