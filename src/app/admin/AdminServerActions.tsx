'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Star, Trash2, ExternalLink } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Server } from '@/types';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface AdminServerActionsProps {
  server: Server;
}

export default function AdminServerActions({ server }: AdminServerActionsProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isFeaturing, setIsFeaturing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const { error } = await supabase
        .from('servers')
        .update({ status: 'approved', updated_at: new Date().toISOString() })
        .eq('id', server.id);

      if (error) throw error;
      toast.success('Server approved!');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Failed to approve server');
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    setIsRejecting(true);
    try {
      const { error } = await supabase
        .from('servers')
        .update({ status: 'rejected', updated_at: new Date().toISOString() })
        .eq('id', server.id);

      if (error) throw error;
      toast.success('Server rejected');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Failed to reject server');
    } finally {
      setIsRejecting(false);
    }
  };

  const handleToggleFeatured = async () => {
    setIsFeaturing(true);
    try {
      const { error } = await supabase
        .from('servers')
        .update({
          is_featured: !server.is_featured,
          updated_at: new Date().toISOString(),
        })
        .eq('id', server.id);

      if (error) throw error;
      toast.success(server.is_featured ? 'Server unfeatured' : 'Server featured!');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update featured status');
    } finally {
      setIsFeaturing(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase.from('servers').delete().eq('id', server.id);

      if (error) throw error;
      toast.success('Server deleted');
      setShowDeleteModal(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete server');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {server.status === 'pending' && (
          <>
            <Button
              variant="primary"
              size="sm"
              onClick={handleApprove}
              isLoading={isApproving}
              leftIcon={<CheckCircle className="w-4 h-4" />}
            >
              Approve
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleReject}
              isLoading={isRejecting}
              leftIcon={<XCircle className="w-4 h-4" />}
            >
              Reject
            </Button>
          </>
        )}
        {server.status === 'approved' && (
          <>
            <Link href={`/servers/${server.id}`}>
              <Button variant="secondary" size="sm" leftIcon={<ExternalLink className="w-4 h-4" />}>
                View
              </Button>
            </Link>
            <Button
              variant={server.is_featured ? 'primary' : 'secondary'}
              size="sm"
              onClick={handleToggleFeatured}
              isLoading={isFeaturing}
              leftIcon={<Star className={`w-4 h-4 ${server.is_featured ? 'fill-current' : ''}`} />}
            >
              {server.is_featured ? 'Unfeature' : 'Feature'}
            </Button>
          </>
        )}
        <Link href={`/servers/edit/${server.id}`}>
          <Button variant="secondary" size="sm">
            Edit
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDeleteModal(true)}
          className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
          leftIcon={<Trash2 className="w-4 h-4" />}
        >
          Delete
        </Button>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Server"
      >
        <div className="space-y-4">
          <p className="text-[#8fa3b8]">
            Are you sure you want to delete{' '}
            <strong className="text-[#e8f0f8]">{server.name}</strong>? This action cannot
            be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>
              Delete Server
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
