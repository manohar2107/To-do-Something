import React, { useState } from 'react';
import { useDocument } from '../context/DocumentContext';
import './ShareModal.css';

export const ShareModal = ({ isOpen, onClose }) => {
  const { activeDoc, shareDocument,updateCollaboratorRole, removeCollaborator } = useDocument();
  const [invitee, setInvitee] = useState('');
  const [role, setRole] = useState('editor');
  const [statusMessage, setStatusMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !activeDoc) return null;

  const handleShare = async (e) => {
    e.preventDefault();
    if (!invitee.trim()) return;

    setError(null);
    setStatusMessage(null);
    setLoading(true);

    try {
      await shareDocument(activeDoc._id, invitee.trim(), role);
      setStatusMessage(`Shared successfully with ${invitee.trim()}!`);
      setInvitee('');
    } catch (err) {
      setError(err.message || 'Failed to share document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <h3>Share "{activeDoc.title}"</h3>
            <p className="modal-subtitle">Collaborate with other users by username</p>
          </div>
          <button type="button" className="modal-x-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Alerts */}
        {error && <div className="modal-banner error-banner">{error}</div>}
        {statusMessage && <div className="modal-banner success-banner">{statusMessage}</div>}

        {/* Input Form */}
        <form onSubmit={handleShare} className="share-input-row">
          <input
            type="text"
            placeholder="Username (e.g. beta_tester)"
            value={invitee}
            onChange={(e) => setInvitee(e.target.value)}
            required
            autoFocus
          />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
          <button type="submit" className="share-submit-btn" disabled={loading}>
            {loading ? 'Adding...' : 'Invite'}
          </button>
        </form>

        {/* Collaborators List */}
        <div className="collaborators-container">
          <h4 className="collaborators-heading">
            Current Collaborators ({activeDoc.collaborators?.length || 0})
          </h4>

          <div className="collaborators-list">
            {activeDoc.collaborators?.length === 0 ? (
                <p className="no-collab-text">No collaborators yet.</p>
            ) : (
                activeDoc.collaborators?.map((c) => {
                const userId = c.user?._id || c.user;
                const userName = c.user?.username || 'Collaborator';

                return (
                    <div key={userId} className="collaborator-item">
                    <div className="collab-user-info">
                        <div className="collab-avatar">{userName[0].toUpperCase()}</div>
                        <span className="collab-name">{userName}</span>
                    </div>

                    <div className="collab-actions">
                        <select
                        value={c.role}
                        onChange={(e) => updateCollaboratorRole(activeDoc._id, userId, e.target.value)}
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