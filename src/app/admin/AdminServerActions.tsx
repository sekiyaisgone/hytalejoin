'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Star, Trash2, ExternalLink, Pencil } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Server } from '@/types';
import Button from '@/components/ui/Button';
import ConfirmModal from '@/components/ui/ConfirmModal';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface AdminServerActionsProps {
  server: Server;
  showViewButton?: boolean;
}

export default function AdminServerActions({ server, showViewButton = true }: AdminServerActionsProps) {
  const router = useRouter();
  const supabase = createClient();

  // Local state to track server status and prevent loops
  const [localStatus, setLocalStatus] = useState(server.status);
  const [localFeatured, setLocalFeatured] = useState(server.is_featured);

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
    try {
      const { error } = await supabase
        .from('servers')
        .update({ status: 'approved' })
        .eq('id', server.id);

      if (error) throw error;

      setLocalStatus('approved');
      toast.success('Server approved!');
      router.refresh();
    } catch (error) {
      console.error('Approve error:', error);
      toast.error('Failed to approve server');
    } finally {
      setIsApproving(false);
    }
  }, [server.id, supabase, router, isApproving]);

  const handleReject = useCallback(async () => {
    if (isRejecting) return;
    setIsRejecting(true);
    try {
      const { error } = await supabase
        .from('servers')
        .update({ status: 'rejected' })
        .eq('id', server.id);

      if (error) throw error;

      setLocalStatus('rejected');
      setShowRejectModal(false);
      toast.success('Server rejected');
      router.refresh();
    } catch (error) {
      console.error('Reject error:', error);
      toast.error('Failed to reject server');
    } finally {
      setIsRejecting(false);
    }
  }, [server.id, supabase, router, isRejecting]);

  const handleToggleFeatured = useCallback(async () => {
    if (isFeaturing) return;
    setIsFeaturing(true);
    const newFeaturedState = !localFeatured;

    try {
      const { error } = await supabase
        .from('servers')
        .update({ is_featured: newFeaturedState })
        .eq('id', server.id);

      if (error) throw error;

      setLocalFeatured(newFeaturedState);
      setShowFeatureModal(false);
      toast.success(newFeaturedState ? 'Server featured!' : 'Server unfeatured');
      router.refresh();
    } catch (error) {
      console.error('Feature error:', error);
      toast.error('Failed to update featured status');
    } finally {
      setIsFeaturing(false);
    }
  }, [server.id, supabase, router, localFeatured, isFeaturing]);

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
      toast.success('Server deleted');
      router.refresh();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete server');
    } finally {
      setIsDeleting(false);
    }
  }, [server.id, supabase, router, isDeleting]);

  const isPending = localStatus === 'pending';
  const isApproved = localStatus === 'approved';
  const isRejected = localStatus === 'rejected';

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {/* Pending Actions */}
        {isPending && (
          <>
            <Button
              variant="primary"
              size="sm"
              onClick={handleApprove}
              isLoading={isApproving}
              disabled={isApproving || isRejecting}
              leftIcon={<CheckCircle className="w-4 h-4" />}
            >
              Approve
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowRejectModal(true)}
              disabled={isApproving || isRejecting}
              leftIcon={<XCircle className="w-4 h-4" />}
            >
              Reject
            </Button>
          </>
        )}

        {/* Approved Actions */}
        {isApproved && (
          <>
            {showViewButton && (
              <Link href={`/servers/${server.id}`}>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<ExternalLink className="w-4 h-4" />}
                >
                  View
                </Button>
              </Link>
            )}
            <Button
              variant={localFeatured ? 'gold-outline' : 'secondary'}
              size="sm"
              onClick={() => setShowFeatureModal(true)}
              disabled={isFeaturing}
              leftIcon={<Star className={`w-4 h-4 ${localFeatured ? 'fill-current' : ''}`} />}
            >
              {localFeatured ? 'Unfeature' : 'Feature'}
            </Button>
          </>
        )}

        {/* Re-approve rejected servers */}
        {isRejected && (
          <Button
            variant="primary"
            size="sm"
            onClick={handleApprove}
            isLoading={isApproving}
            disabled={isApproving}
            leftIcon={<CheckCircle className="w-4 h-4" />}
          >
            Approve
          </Button>
        )}

        {/* Always show Edit and Delete */}
        <Link href={`/servers/edit/${server.id}`}>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Pencil className="w-4 h-4" />}
          >
            Edit
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDeleteModal(true)}
          disabled={isDeleting}
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          leftIcon={<Trash2 className="w-4 h-4" />}
        >
          Delete
        </Button>
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
    </>
  );
}
