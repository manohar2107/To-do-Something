import React, { useState } from 'react';
import { useDocument } from '../context/DocumentContext';
import './ShareModal.css';

export const ShareModal = ({ isOpen, onClose }) => {
  const {
    activeDoc,
    shareDocument,
    updateCollaboratorRole,
    removeCollaborator,
    isOwner,
  } = useDocument();

  const [username, setUsername] = useState('');
  const [role, setRole] = useState('editor');
  const [statusMessage, setStatusMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !activeDoc) return null;

  const handleShare = async (e) => {
    e.preventDefault();
    const targetUsername = username.trim();
    if (!targetUsername) return;

    setError(null);
    setStatusMessage(null);
    setLoading(true);

    try {
      await shareDocument(activeDoc._id, targetUsername, role);
      setStatusMessage(`Added "${targetUsername}" as ${role}!`);
      setUsername('');
    } catch (err) {
      setError(err.message || 'Failed to add collaborator');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <h3>Share "{activeDoc.title}"</h3>
            <p className="modal-subtitle">Invite collaborators by entering their username</p>
          </div>
          <button type="button" className="modal-x-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Feedback Banners */}
        {error && <div className="modal-banner error-banner">{error}</div>}
        {statusMessage && <div className="modal-banner success-banner">{statusMessage}</div>}

        {/* Username Text Input (Owner Only) */}
        {isOwner && (
          <form onSubmit={handleShare} className="share-input-row">
            <input
              type="text"
              placeholder="Enter username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="share-input-username"
              required
              autoFocus
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="share-select-role"
            >
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>

            <button
              type="submit"
              className="share-submit-btn"
              disabled={loading || !username.trim()}
            >
              {loading ? 'Adding...' : 'Invite'}
            </button>
          </form>
        )}

        {/* Existing Collaborators List */}
        <div className="collaborators-container">
          <h4 className="collaborators-heading">
            Collaborators ({activeDoc.collaborators?.length || 0})
          </h4>

          <div className="collaborators-list">
            {!activeDoc.collaborators || activeDoc.collaborators.length === 0 ? (
              <p className="no-collab-text">No collaborators yet.</p>
            ) : (
              activeDoc.collaborators.map((c) => {
                const userId = c.user?._id || c.user;
                const displayName = c.user?.username || c.username || 'Collaborator';

                return (
                  <div key={userId} className="collaborator-item">
                    <div className="collab-user-info">
                      <div className="collab-avatar">{displayName[0].toUpperCase()}</div>
                      <span className="collab-name">{displayName}</span>
                    </div>

                    <div className="collab-actions">
                      {isOwner ? (
                        <>
                          <select
                            value={c.role}
                            onChange={(e) =>
                              updateCollaboratorRole(activeDoc._id, userId, e.target.value)
                            }
                            className="collab-role-select"
                          >
                            <option value="editor">Editor</option>
                            <option value="viewer">Viewer</option>
                          </select>
                          <button
                            type="button"
                            className="remove-collab-btn"
                            title="Remove collaborator"
                            onClick={() => removeCollaborator(activeDoc._id, userId)}
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <span className={`collab-role-badge badge-${c.role}`}>
                          {c.role}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button type="button" className="modal-close-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};