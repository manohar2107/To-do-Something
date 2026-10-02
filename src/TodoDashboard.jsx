// src/TodoDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useDocument } from './context/DocumentContext';
import { DocumentGrid } from './Component/DocumentGrid';
import { ShareModal } from './Component/ShareModal';
import ToDoInput from './Component/ToDoInput';
import ToDoList from './Component/ToDoList';
import './TodoDashboard.css';

export const TodoDashboard = () => {
  const {
    activeDoc,
    setActiveDoc,
    updateDocumentTitle,
    deleteDocument,
    isOwner,
    canEdit,
  } = useDocument();

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [docTitle, setDocTitle] = useState('');

  useEffect(() => {
    if (activeDoc) {
      setDocTitle(activeDoc.title || '');
    }
  }, [activeDoc]);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    const trimmed = docTitle.trim();
    if (trimmed && trimmed !== activeDoc?.title) {
      updateDocumentTitle(activeDoc._id, trimmed);
    } else {
      setDocTitle(activeDoc?.title || '');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleTitleSubmit();
    if (e.key === 'Escape') {
      setDocTitle(activeDoc?.title || '');
      setIsEditingTitle(false);
    }
  };

  // View 1: Document Grid Overview
  if (!activeDoc) {
    return (
      <div className="workspace-main-container">
        <header className="workspace-view-header">
          <h2>Scheduler'</h2>
          <p className="workspace-view-subtitle">Select an existing jist or create a new </p>
        </header>
        <section className="workspace-grid-section">
          <DocumentGrid />
        </section>
      </div>
    );
  }

  // View 2: Single Workspace Document View
  return (
    <div className="workspace-main-container">
      {/* Top Header Bar */}
      <div className="active-doc-topbar">
        <button
          type="button"
          className="back-workspaces-btn"
          onClick={() => setActiveDoc(null)}
        >
          ← All Jists!!!
        </button>

        {/* Clickable Workspace Title (No Pencil) */}
        <div className="doc-title-wrapper">
          {isEditingTitle && isOwner ? (
            <input
              type="text"
              className="workspace-title-input"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          ) : (
            <h2
              className={`workspace-title-text ${isOwner ? 'clickable' : ''}`}
              onClick={() => isOwner && setIsEditingTitle(true)}
              title={isOwner ? 'Click to rename workspace' : ''}
            >
              {activeDoc.title}
            </h2>
          )}
        </div>

        {/* Share & Delete Action Buttons */}
        <div className="doc-header-actions">
          {isOwner && (
            <>
              <button
                type="button"
                className="action-btn-share"
                onClick={() => setIsShareOpen(true)}
              >
                👥
              </button>
              <button
                type="button"
                className="action-btn-delete"
                title="Delete Workspace"
                onClick={() => {
                  if (window.confirm(`Delete workspace "${activeDoc.title}" and its tasks?`)) {
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

      {/* Viewer Notice */}
      {!canEdit && (
        <div className="viewer-mode-notice">
          👁️️ You are viewing this workspace in Read-Only mode.
        </div>
      )}

      {/* Centered Workflow: Input and Task List */}
      <div className="workspace-content-stack">
        {canEdit && (
          <div className="workspace-card-centered">
            <ToDoInput />
          </div>
        )}
        <div className="workspace-card-centered">
          <ToDoList />
        </div>
      </div>

      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </div>
  );
};