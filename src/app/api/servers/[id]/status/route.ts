import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import * as net from 'net';

// Simple TCP ping to check if server is reachable
async function checkServerStatus(host: string, port: number, timeout: number = 5000): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();

    socket.setTimeout(timeout);

    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });

    socket.on('error', () => {
      socket.destroy();
      resolve(false);
    });

    try {
      socket.connect(port, host);
    } catch {
      resolve(false);
    }
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Get server details
    const { data: server, error } = await supabase
      .from('servers')
      .select('ip_address, port, is_online')
      .eq('id', id)
      .single();

    if (error || !server) {
      return NextResponse.json({ error: 'Server not found' }, { status: 404 });
    }

    // Check if server is online using TCP ping
    const isOnline = await checkServerStatus(server.ip_address, server.port || 5520);

    // Update the is_online status in the database if it changed
    if (server.is_online !== isOnline) {
      await supabase
        .from('servers')
        .update({
          is_online: isOnline,
          last_checked: new Date().toISOString()
        })
        .eq('id', id);
    }

    return NextResponse.json({
      isOnline,
      lastChecked: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error checking server status:', error);
    return NextResponse.json({ error: 'Failed to check status' }, { status: 500 });
  }
}
