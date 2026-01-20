'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';

interface DeleteServerButtonProps {
  serverId: string;
  serverName: string;
}

export default function DeleteServerButton({ serverId, serverName }: DeleteServerButtonProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const { error } = await supabase.from('servers').delete().eq('id', serverId);

      if (error) {
        throw error;
      }

      toast.success('Server deleted successfully');
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Error deleting server:', error);
      toast.error('Failed to delete server');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
      >
        <Trash2 className="w-4 h-4" />
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Delete Server">
        <div className="space-y-4">
          <p className="text-[#8fa3b8]">
            Are you sure you want to delete{' '}
            <strong className="text-[#e8f0f8]">{serverName}</strong>? This action cannot
            be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
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
