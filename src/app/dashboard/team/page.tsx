'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Users, Mail, Shield, UserPlus, Loader2, CheckCircle2, XCircle, Trash2, ShieldCheck, UserCheck } from 'lucide-react';
import { inviteWorker, getFarmMembers, deleteMember, deleteInvitation } from '@/lib/actions/staff-actions';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';

export default function TeamPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviting, setIsInviting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number, type: 'member' | 'invite' } | null>(null);

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    setIsLoading(true);
    try {
      const data = await getFarmMembers() as any;
      if (data) {
        setMembers(data.members || []);
        setInvitations(data.invitations || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsInviting(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const role = formData.get('role') as any;

    try {
      const result = await inviteWorker({ email, role });
      if (result.success) {
        setMessage({ type: 'success', text: `Invitation sent to ${email}!` });
        e.currentTarget.reset();
        await loadTeam();
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to send invitation.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setIsInviting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsLoading(true);
    try {
      if (deleteTarget.type === 'member') {
        await deleteMember(deleteTarget.id);
      } else {
        await deleteInvitation(deleteTarget.id);
      }
      setDeleteTarget(null);
      await loadTeam();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const configs: any = {
      OWNER: { class: 'bg-purple-50 text-purple-700 border-purple-100', icon: ShieldCheck },
      MANAGER: { class: 'bg-blue-50 text-blue-700 border-blue-100', icon: Shield },
      WORKER: { class: 'bg-green-50 text-green-700 border-green-100', icon: UserCheck }
    };
    const config = configs[role] || { class: 'bg-gray-50 text-gray-700 border-gray-100', icon: Users };
    const Icon = config.icon;
    return (
      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-1 ${config.class}`}>
        <Icon className="w-3 h-3" />
        {role}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 py-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Team Management</h2>
          <p className="text-gray-500 mt-1">Manage your farm staff and permissions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-2xl border-none shadow-xl shadow-gray-200/50">
            <CardHeader className="bg-gray-50/50 rounded-t-2xl border-b border-gray-100">
              <CardTitle className="flex items-center text-gray-800">
                <Users className="w-5 h-5 mr-3 text-green-700" />
                Active Members
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {isLoading && members.length === 0 ? (
                <div className="flex justify-center p-20"><Loader2 className="animate-spin h-10 w-10 text-green-800" /></div>
              ) : members.length === 0 ? (
                <div className="text-center py-20 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-400 font-medium italic">No staff members found.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {members.map((member) => (
                    <div key={member.id} className="p-4 rounded-2xl border border-gray-100 bg-white hover:border-green-100 hover:shadow-lg transition-all flex items-center justify-between group">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-green-950 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-green-900/10">
                          {(member.user.firstname?.charAt(0) || member.user.surname?.charAt(0) || 'U').toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">
                            {member.user.firstname} {member.user.surname}
                          </p>
                          <p className="text-xs text-gray-400 font-medium">{member.user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {getRoleBadge(member.role)}
                        {member.role !== 'OWNER' && (
                          <button 
                            onClick={() => setDeleteTarget({ id: member.id, type: 'member' })}
                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-none shadow-xl shadow-gray-200/50">
            <CardHeader className="bg-gray-50/50 rounded-t-2xl border-b border-gray-100">
              <CardTitle className="flex items-center text-gray-800">
                <Mail className="w-5 h-5 mr-3 text-amber-600" />
                Pending Invitations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {isLoading && invitations.length === 0 ? (
                <div className="flex justify-center p-12"><Loader2 className="animate-spin text-amber-600" /></div>
              ) : invitations.length === 0 ? (
                <div className="text-center py-12 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
                  <Mail className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 font-medium italic text-sm">No pending invitations.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {invitations.map((invite) => (
                    <div key={invite.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/30 flex items-center justify-between group">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{invite.email}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Sent {new Date(invite.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getRoleBadge(invite.role)}
                        <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-1 rounded-full font-black uppercase tracking-widest border border-amber-100">Pending</span>
                        <button 
                          onClick={() => setDeleteTarget({ id: invite.id, type: 'invite' })}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-2xl border-none shadow-xl shadow-gray-200/50 bg-green-950 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <UserPlus className="w-32 h-32" />
            </div>
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center">
                Invite Staff
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <form onSubmit={handleInvite} className="space-y-4">
                {message && (
                  <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
                    message.type === 'success' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    {message.text}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-green-300 mb-2">Email Address</label>
                  <input 
                    name="email"
                    type="email" 
                    required
                    placeholder="staff@example.com"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none placeholder:text-white/30 text-white font-medium" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-green-300 mb-2">Assign Role</label>
                  <select 
                    name="role"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-white font-medium cursor-pointer"
                  >
                    <option value="WORKER" className="text-gray-900">Worker</option>
                    <option value="MANAGER" className="text-gray-900">Manager</option>
                  </select>
                </div>
                <Button 
                  type="submit" 
                  disabled={isInviting}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-green-950 font-black py-4 rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98]"
                >
                  {isInviting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Invitation'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-none shadow-xl shadow-gray-200/50 bg-white p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="font-black text-gray-900 italic tracking-tight">Role Permissions</h4>
            </div>
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="font-black text-[10px] uppercase tracking-widest text-blue-600 mb-1">Manager</p>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">Full visibility of all farm operations and logs. Can manage staff, inventory, and sales.</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="font-black text-[10px] uppercase tracking-widest text-green-600 mb-1">Worker</p>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">Limited to data entry (feeding, mortality logs). Can only view their own activity records.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Dialog 
        isOpen={!!deleteTarget} 
        onOpenChange={(open) => !open && setDeleteTarget(null)} 
        title={`Revoke ${deleteTarget?.type === 'member' ? 'Access' : 'Invitation'}`}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to {deleteTarget?.type === 'member' ? 'remove this member from the farm' : 'cancel this invitation'}? 
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Keep</Button>
            <Button variant="danger" onClick={handleDelete} isLoading={isLoading}>
              Confirm Revoke
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
