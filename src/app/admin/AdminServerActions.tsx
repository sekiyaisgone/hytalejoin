'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Star, Trash2, ExternalLink, Pencil, MoreHorizontal, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Server } from '@/types';
import ConfirmModal from '@/components/ui/ConfirmModal';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface AdminServerActionsProps {
  server: Server;
  showViewButton?: boolean;
  onServerUpdate?: (serverId: string, updates: Partial<Server>) => void;
  onServerDelete?: (serverId: string) => void;
}

export default function AdminServerActions({
  server,
  showViewButton = true,
  onServerUpdate,
  onServerDelete,
}: AdminServerActionsProps) {
  const router = useRouter();
  const supabase = createClient();

  // Local state to track server status (optimistic UI)
  const [localStatus, setLocalStatus] = useState(server.status);
  const [localFeatured, setLocalFeatured] = useState(server.is_featured);
  const [isDeleted, setIsDeleted] = useState(false);

  // Loading states
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isFeaturing, setIsFeaturing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showFeatureModal, setShowFeatureModal] = useState(false);

  const handleApprove = useCallback(async () => {
    if (isApproving) return;
    setIsApproving(true);

    // Optimistic update
    const previousStatus = localStatus;
    setLocalStatus('approved');

    try {
      const { error } = await supabase
        .from('servers')
        .update({ status: 'approved' })
        .eq('id', server.id);

      if (error) throw error;

      toast.success('Server approved!');
      onServerUpdate?.(server.id, { status: 'approved' });

      // Soft refresh without full page reload
      router.refresh();
    } catch (error) {
      // Rollback on error
      setLocalStatus(previousStatus);
      console.error('Approve error:', error);
      toast.error('Failed to approve server');
    } finally {
      setIsApproving(false);
    }
  }, [server.id, supabase, router, isApproving, localStatus, onServerUpdate]);

  const handleReject = useCallback(async () => {
    if (isRejecting) return;
    setIsRejecting(true);

    // Optimistic update
    const previousStatus = localStatus;
    setLocalStatus('rejected');

    try {
      const { error } = await supabase
        .from('servers')
        .update({ status: 'rejected' })
        .eq('id', server.id);

      if (error) throw error;

      setShowRejectModal(false);
      toast.success('Server rejected');
      onServerUpdate?.(server.id, { status: 'rejected' });
      router.refresh();
    } catch (error) {
      // Rollback on error
      setLocalStatus(previousStatus);
      console.error('Reject error:', error);
      toast.error('Failed to reject server');
    } finally {
      setIsRejecting(false);
    }
  }, [server.id, supabase, router, isRejecting, localStatus, onServerUpdate]);

  const handleToggleFeatured = useCallback(async () => {
    if (isFeaturing) return;
    setIsFeaturing(true);

    const newFeaturedState = !localFeatured;

    // Optimistic update
    setLocalFeatured(newFeaturedState);
    setShowFeatureModal(false);

    try {
      const { error } = await supabase
        .from('servers')
        .update({ is_featured: newFeaturedState })
        .eq('id', server.id);

      if (error) throw error;

      toast.success(newFeaturedState ? 'Server featured!' : 'Server unfeatured');
      onServerUpdate?.(server.id, { is_featured: newFeaturedState });

      // Do NOT call router.refresh() here - it causes infinite loops
      // The optimistic update is sufficient
    } catch (error) {
      // Rollback on error
      setLocalFeatured(!newFeaturedState);
      console.error('Feature error:', error);
      toast.error('Failed to update featured status');
    } finally {
      setIsFeaturing(false);
    }
  }, [server.id, supabase, localFeatured, isFeaturing, onServerUpdate]);

  const handleDelete = useCallback(async () => {
    if (isDeleting) return;
    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from('servers')
        .delete()
        .eq('id', server.id);

      if (error) throw error;

      setShowDeleteModal(false);
      setIsDeleted(true);
      toast.success('Server deleted');
      onServerDelete?.(server.id);
      router.refresh();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete server');
    } finally {
      setIsDeleting(false);
    }
  }, [server.id, supabase, router, isDeleting, onServerDelete]);

  // Hide if deleted
  if (isDeleted) return null;

  const isPending = localStatus === 'pending';
  const isApproved = localStatus === 'approved';
  const isRejected = localStatus === 'rejected';

  // Compact icon button style
  const iconBtnStyle = (color: string, bgColor: string) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    background: bgColor,
    color: color,
  });

  // Text button style for primary actions
  const actionBtnStyle = (color: string, bgColor: string, hoverBg: string) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    background: bgColor,
    color: color,
    fontSize: '0.8125rem',
    fontWeight: 500,
  });

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        {/* Pending Actions */}
        {isPending && (
          <>
            <button
              onClick={handleApprove}
              disabled={isApproving || isRejecting}
              style={actionBtnStyle('#22c55e', 'rgba(34, 197, 94, 0.15)', 'rgba(34, 197, 94, 0.25)')}
              title="Approve server"
            >
              {isApproving ? (
                <Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />
              ) : (
                <CheckCircle style={{ width: '14px', height: '14px' }} />
              )}
              Approve
            </button>
            <button
              onClick={() => setShowRejectModal(true)}
              disabled={isApproving || isRejecting}
              style={actionBtnStyle('#ef4444', 'rgba(239, 68, 68, 0.15)', 'rgba(239, 68, 68, 0.25)')}
              title="Reject server"
            >
              <XCircle style={{ width: '14px', height: '14px' }} />
              Reject
            </button>
          </>
        )}

        {/* Approved Actions */}
        {isApproved && (
          <>
            {showViewButton && (
              <Link
                href={`/servers/${server.id}`}
                style={{
                  ...actionBtnStyle('#5b8def', 'rgba(91, 141, 239, 0.15)', 'rgba(91, 141, 239, 0.25)'),
                  textDecoration: 'none',
                }}
                title="View server page"
              >
                <ExternalLink style={{ width: '14px', height: '14px' }} />
                View
              </Link>
            )}
            <button
              onClick={() => setShowFeatureModal(true)}
              disabled={isFeaturing}
              style={actionBtnStyle(
                localFeatured ? '#d4a033' : '#8fa3b8',
                localFeatured ? 'rgba(212, 160, 51, 0.2)' : 'rgba(255,255,255,0.05)',
                localFeatured ? 'rgba(212, 160, 51, 0.3)' : 'rgba(255,255,255,0.1)'
              )}
              title={localFeatured ? 'Remove from featured' : 'Feature server'}
            >
              {isFeaturing ? (
                <Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />
              ) : (
                <Star style={{ width: '14px', height: '14px', fill: localFeatured ? 'currentColor' : 'none' }} />
              )}
              {localFeatured ? 'Featured' : 'Feature'}
            </button>
          </>
        )}

        {/* Re-approve rejected servers */}
        {isRejected && (
          <button
            onClick={handleApprove}
            disabled={isApproving}
            style={actionBtnStyle('#22c55e', 'rgba(34, 197, 94, 0.15)', 'rgba(34, 197, 94, 0.25)')}
            title="Re-approve server"
          >
            {isApproving ? (
              <Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />
            ) : (
              <CheckCircle style={{ width: '14px', height: '14px' }} />
            )}
            Approve
          </button>
        )}

        {/* Divider */}
        <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.08)', margin: '0 2px' }} />

        {/* Always show Edit and Delete */}
        <Link
          href={`/servers/edit/${server.id}`}
          style={{
            ...iconBtnStyle('#8fa3b8', 'rgba(255,255,255,0.05)'),
            textDecoration: 'none',
          }}
          title="Edit server"
        >
          <Pencil style={{ width: '14px', height: '14px' }} />
        </Link>
        <button
          onClick={() => setShowDeleteModal(true)}
          disabled={isDeleting}
          style={iconBtnStyle('#ef4444', 'rgba(239, 68, 68, 0.1)')}
          title="Delete server"
        >
          {isDeleting ? (
            <Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />
          ) : (
            <Trash2 style={{ width: '14px', height: '14px' }} />
          )}
        </button>
      </div>

      {/* Reject Confirmation Modal */}
      <ConfirmModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleReject}
        title="Reject Server"
        message={`Are you sure you want to reject "${server.name}"? The owner will be notified.`}
        confirmText="Reject Server"
        variant="danger"
        isLoading={isRejecting}
      />

      {/* Feature Confirmation Modal */}
      <ConfirmModal
        isOpen={showFeatureModal}
        onClose={() => setShowFeatureModal(false)}
        onConfirm={handleToggleFeatured}
        title={localFeatured ? 'Remove from Featured' : 'Feature Server'}
        message={
          localFeatured
            ? `Remove "${server.name}" from the featured servers list?`
            : `Feature "${server.name}" on the homepage? This will highlight it to all visitors.`
        }
        confirmText={localFeatured ? 'Remove' : 'Feature'}
        variant={localFeatured ? 'warning' : 'success'}
        isLoading={isFeaturing}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Server"
        message={`Are you sure you want to delete "${server.name}"? This action cannot be undone.`}
        confirmText="Delete Server"
        variant="danger"
        isLoading={isDeleting}
      />

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        button:hover:not(:disabled) {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
}
