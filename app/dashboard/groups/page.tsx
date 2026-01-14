'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { getGroups, createGroup, joinGroup } from '@/lib/db/operations';
import { Group } from '@/lib/db';
import { Users, Plus, UserPlus, Copy, Check, LogIn, QrCode } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Input from '@/components/ui/Input';

export default function GroupsPage() {
    const { user } = useAuth();
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);

    useEffect(() => {
        loadGroups();
    }, [user]);

    const loadGroups = async () => {
        if (!user) return;
        setLoading(true);
        const data = await getGroups(user.id);
        setGroups(data);
        setLoading(false);
    };

    const handleCreateGroup = async (name: string, description: string) => {
        if (!user) return;

        const { group, error } = await createGroup(user.id, user.user_metadata?.name || user.email!, {
            name,
            description,
        });

        if (error) {
            toast.error(error);
        } else if (group) {
            toast.success('Group created successfully!');
            setGroups([...groups, group]);
            setShowCreateModal(false);
        }
    };

    const handleJoinGroup = async (inviteCode: string) => {
        if (!user) return;

        const result = await joinGroup(user.id, user.user_metadata?.name || user.email!, inviteCode);

        if (result.success && result.group) {
            toast.success(`Joined ${result.group.name}!`);
            setGroups([...groups, result.group]);
            setShowJoinModal(false);
        } else {
            toast.error(result.error || 'Failed to join group');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-vintage-amber text-lg">Loading groups...</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-vintage-amber mb-2">My Groups</h1>
                    <p className="text-vintage-black/70">Manage your expense groups</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        onClick={() => setShowJoinModal(true)}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <LogIn className="w-4 h-4" />
                        Join Group
                    </Button>
                    <Button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Create Group
                    </Button>
                </div>
            </div>

            {/* Groups Grid */}
            {groups.length === 0 ? (
                <Card className="text-center py-12">
                    <Users className="w-16 h-16 text-vintage-amber/40 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-vintage-black mb-2">No groups yet</h3>
                    <p className="text-vintage-black/60 mb-6">
                        Create a new group or join an existing one to get started
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Button onClick={() => setShowCreateModal(true)}>Create Group</Button>
                        <Button onClick={() => setShowJoinModal(true)} variant="outline">
                            Join Group
                        </Button>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map((group) => (
                        <Link key={group.id} href={`/dashboard/groups/${group.id}`}>
                            <Card className="hover:shadow-vintage-lg transition-all cursor-pointer h-full">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-vintage-amber/20 rounded-vintage">
                                        <Users className="w-6 h-6 text-vintage-amber" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-vintage-black mb-1">
                                            {group.name}
                                        </h3>
                                        {group.description && (
                                            <p className="text-sm text-vintage-black/60 mb-3">
                                                {group.description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-2 text-xs text-vintage-black/50">
                                            <QrCode className="w-3 h-3" />
                                            <span>{group.invite_code}</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}

            {/* Create Group Modal */}
            {showCreateModal && (
                <CreateGroupModal
                    onClose={() => setShowCreateModal(false)}
                    onCreate={handleCreateGroup}
                />
            )}

            {/* Join Group Modal */}
            {showJoinModal && (
                <JoinGroupModal
                    onClose={() => setShowJoinModal(false)}
                    onJoin={handleJoinGroup}
                />
            )}
        </div>
    );
}

// Create Group Modal Component
function CreateGroupModal({
    onClose,
    onCreate,
}: {
    onClose: () => void;
    onCreate: (name: string, description: string) => void;
}) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error('Group name is required');
            return;
        }
        onCreate(name, description);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
                <h2 className="text-2xl font-bold text-vintage-amber mb-4">Create New Group</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Group Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Weekend Trip"
                        autoFocus
                    />
                    <div>
                        <label className="block text-sm font-medium text-vintage-black mb-1.5">
                            Description (Optional)
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Expenses for our weekend getaway"
                            className="w-full px-4 py-2.5 rounded-vintage bg-white border border-vintage-amber/30 text-vintage-black placeholder:text-vintage-amber/50 focus:outline-none focus:ring-2 focus:ring-vintage-amber focus:border-transparent transition-all duration-200"
                            rows={3}
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button type="button" onClick={onClose} variant="outline" className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1">
                            Create Group
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}

// Join Group Modal Component
function JoinGroupModal({
    onClose,
    onJoin,
}: {
    onClose: () => void;
    onJoin: (code: string) => void;
}) {
    const [inviteCode, setInviteCode] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteCode.trim()) {
            toast.error('Invite code is required');
            return;
        }
        onJoin(inviteCode.toUpperCase());
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
                <h2 className="text-2xl font-bold text-vintage-amber mb-4">Join Group</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Invite Code"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                        placeholder="ABC123"
                        autoFocus
                        maxLength={6}
                    />
                    <p className="text-sm text-vintage-black/60">
                        Enter the 6-character invite code shared by the group admin
                    </p>
                    <div className="flex gap-3">
                        <Button type="button" onClick={onClose} variant="outline" className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1">
                            Join Group
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
