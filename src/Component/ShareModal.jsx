// src/components/ShareModal.jsx
import React, { useState, useEffect } from 'react';
import { useDocument } from '../context/DocumentContext';
import { useAuth } from '../context/AuthContext';
import './ShareModal.css';

export const ShareModal = ({ isOpen, onClose }) => {
  const { activeDoc, shareDocument, updateCollaboratorRole, removeCollaborator, isOwner } = useDocument();
  const { token } = useAuth();

  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [role, setRole] = useState('editor');
  const [statusMessage, setStatusMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(false);

  // Fetch registered users when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchUsers = async () => {
      setFetchingUsers(true);
      setError(null);
      try {
        const res = await fetch('/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setAvailableUsers(data);
        } else {
          setError(data.error || 'Failed to load user directory');
        }
      } catch (err) {
        setError('Network error loading users');
      } finally {
        setFetchingUsers(false);
      }
    };

    fetchUsers();
  }, [isOpen, token]);

  if (!isOpen || !activeDoc) return null;

  // Filter out users who are already collaborators or owner
  const existingCollabIds = new Set(
    (activeDoc.collaborators || []).map((c) => (c.user?._id || c.user)?.toString())
  );
  const eligibleUsers = availableUsers.filter((u) => !existingCollabIds.has(u._id.toString()));

  const handleShare = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    setError(null);
    setStatusMessage(null);
    setLoading(true);

    try {
      // Find the chosen user object to send username
      const chosen = availableUsers.find((u) => u._id === selectedUser);
      await shareDocument(activeDoc._id, chosen.username, role);
      setStatusMessage(`Added ${chosen.username} as ${role}!`);
      setSelectedUser('');
    } catch (err) {
      setError(err.message || 'Failed to add collaborator');
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
            <p className="modal-subtitle">Add users to collaborate on this workspace</p>
          </div>
          <button type="button" className="modal-x-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Alerts */}
        {error && <div className="modal-banner error-banner">{error}</div>}
        {statusMessage && <div className="modal-banner success-banner">{statusMessage}</div>}

        {/* User Selection Dropdown (Only for Workspace Owner) */}
        {isOwner && (
          <form onSubmit={handleShare} className="share-input-row">
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="share-select-user"
              required
              disabled={fetchingUsers || eligibleUsers.length === 0}
            >
              <option value="">
                {fetchingUsers
                  ? 'Loading users...'
                  : eligibleUsers.length === 0
                  ? 'No more users to add'
                  : 'Select a user to invite...'}
              </option>
              {eligibleUsers.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.username}
                </option>
              ))}
            </select>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="share-select-role"
              disabled={!selectedUser}
            >
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>

            <button
              type="submit"
              className="share-submit-btn"
              disabled={loading || !selectedUser}
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