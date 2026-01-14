'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { getGroup, getGroupMembers, createExpense, getGroupExpenses, getExpenseSplits, deleteExpense } from '@/lib/db/operations';
import { Group, GroupMember, Expense, ExpenseSplit } from '@/lib/db';
import { Users, Copy, Check, ArrowLeft, Plus, Trash2, Calendar } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { AddExpenseModal } from '@/components/expenses/AddExpenseModal';
import { SettlementsList } from '@/components/settlements/SettlementsList';
import { calculateSettlements, calculateBalancesFromExpenses } from '@/lib/utils/settlements';
import type { Settlement } from '@/lib/utils/settlements';

export default function GroupDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [group, setGroup] = useState<Group | null>(null);
    const [members, setMembers] = useState<GroupMember[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [allSplits, setAllSplits] = useState<ExpenseSplit[]>([]);
    const [settlements, setSettlements] = useState<Settlement[]>([]);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);

    useEffect(() => {
        loadGroupData();
    }, [params.id, user]);

    const loadGroupData = async () => {
        if (!params.id || !user) return;

        setLoading(true);
        const groupData = await getGroup(params.id as string);
        const membersData = await getGroupMembers(params.id as string);
        const expensesData = await getGroupExpenses(params.id as string);

        // Get all expense splits
        const allExpenseSplits: ExpenseSplit[] = [];
        for (const expense of expensesData) {
            const splits = await getExpenseSplits(expense.id);
            allExpenseSplits.push(...splits);
        }

        setGroup(groupData);
        setMembers(membersData);
        setExpenses(expensesData);
        setAllSplits(allExpenseSplits);

        // Calculate settlements
        if (expensesData.length > 0) {
            const balances = await calculateBalancesFromExpenses(expensesData, allExpenseSplits, membersData);
            const calculatedSettlements = calculateSettlements(balances);
            setSettlements(calculatedSettlements);
        } else {
            setSettlements([]);
        }

        setLoading(false);
    };

    const copyInviteCode = () => {
        if (!group) return;
        navigator.clipboard.writeText(group.invite_code);
        setCopied(true);
        toast.success('Invite code copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleAddExpense = async (expenseData: any) => {
        if (!user) return;

        const { expense, error } = await createExpense(user.id, expenseData);

        if (error) {
            toast.error(error);
        } else if (expense) {
            toast.success('Expense added successfully!');
            setExpenses([expense, ...expenses]);
            setShowAddExpenseModal(false);
        }
    };

    const handleDeleteExpense = async (expenseId: string) => {
        if (!user) return;

        if (!confirm('Are you sure you want to delete this expense?')) {
            return;
        }

        const { success, error } = await deleteExpense(user.id, expenseId);

        if (success) {
            toast.success('Expense deleted');
            setExpenses(expenses.filter((e) => e.id !== expenseId));
        } else {
            toast.error(error || 'Failed to delete expense');
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
        }).format(amount / 100);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-vintage-amber text-lg">Loading group...</div>
            </div>
        );
    }

    if (!group) {
        return (
            <div className="max-w-7xl mx-auto">
                <Card className="text-center py-12">
                    <h3 className="text-xl font-semibold text-vintage-black mb-2">Group not found</h3>
                    <p className="text-vintage-black/60 mb-6">
                        This group doesn't exist or you don't have access to it
                    </p>
                    <Link href="/dashboard/groups">
                        <Button>Back to Groups</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    const isAdmin = members.some((m) => m.user_id === user?.id && m.role === 'admin');

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/dashboard/groups"
                    className="inline-flex items-center gap-2 text-vintage-amber hover:text-vintage-amber-dark mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Groups
                </Link>

                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-vintage-amber mb-2">{group.name}</h1>
                        {group.description && (
                            <p className="text-vintage-black/70 text-lg">{group.description}</p>
                        )}
                    </div>
                    <Button onClick={() => setShowAddExpenseModal(true)} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Expense
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Recent Expenses */}
                    <Card>
                        <h2 className="text-2xl font-semibold text-vintage-black mb-4">
                            Recent Expenses
                        </h2>

                        {expenses.length === 0 ? (
                            <div className="text-center py-8 text-vintage-black/60">
                                No expenses yet. Add your first expense to get started!
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {expenses.map((expense) => {
                                    const paidByMember = members.find((m) => m.user_id === expense.paid_by);
                                    const isOwnExpense = expense.created_by === user?.id;

                                    return (
                                        <div
                                            key={expense.id}
                                            className="p-4 bg-vintage-cream/50 rounded-vintage border border-vintage-amber/20 hover:shadow-vintage transition-shadow"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-vintage-black text-lg">
                                                        {expense.title}
                                                    </h3>
                                                    <div className="flex items-center gap-3 text-sm text-vintage-black/60 mt-1">
                                                        <span>Paid by {paidByMember?.name || 'Unknown'}</span>
                                                        {expense.category && (
                                                            <>
                                                                <span>•</span>
                                                                <span>{expense.category}</span>
                                                            </>
                                                        )}
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {format(new Date(expense.date), 'MMM d, yyyy')}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl font-bold text-vintage-amber">
                                                        {formatCurrency(expense.amount)}
                                                    </span>
                                                    {isOwnExpense && (
                                                        <button
                                                            onClick={() => handleDeleteExpense(expense.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-vintage transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-xs text-vintage-black/50">
                                                {expense.split_type === 'equal' ? 'Split equally' : 'Custom split'}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </Card>

                    {/* Settlements */}
                    <Card>
                        <h2 className="text-2xl font-semibold text-vintage-black mb-4">Settlements</h2>
                        <SettlementsList
                            settlements={settlements}
                            currentUserId={user!.id}
                        />
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Invite Code Card */}
                    <Card>
                        <h3 className="text-lg font-semibold text-vintage-black mb-3">Invite Code</h3>
                        <div className="flex items-center gap-2 mb-2">
                            <code className="flex-1 px-4 py-3 bg-vintage-cream rounded-vintage text-2xl font-bold text-vintage-amber text-center border border-vintage-amber/20">
                                {group.invite_code}
                            </code>
                            <Button
                                onClick={copyInviteCode}
                                variant="outline"
                                size="sm"
                                className="p-3"
                            >
                                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            </Button>
                        </div>
                        <p className="text-xs text-vintage-black/60">
                            Share this code with others to invite them to the group
                        </p>
                    </Card>

                    {/* Members Card */}
                    <Card>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-vintage-black">
                                Members ({members.length})
                            </h3>
                            <Users className="w-5 h-5 text-vintage-amber" />
                        </div>
                        <div className="space-y-3">
                            {members.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center justify-between py-2 border-b border-vintage-amber/10 last:border-0"
                                >
                                    <div>
                                        <p className="font-medium text-vintage-black">{member.name}</p>
                                        <p className="text-xs text-vintage-black/60">
                                            {member.role === 'admin' ? 'Admin' : 'Member'} •{' '}
                                            {formatDistanceToNow(new Date(member.joined_at), { addSuffix: true })}
                                        </p>
                                    </div>
                                    {member.user_id === user?.id && (
                                        <span className="text-xs text-vintage-amber">(You)</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Add Expense Modal */}
            {showAddExpenseModal && (
                <AddExpenseModal
                    groupId={group.id}
                    members={members}
                    currentUserId={user!.id}
                    onClose={() => setShowAddExpenseModal(false)}
                    onAdd={handleAddExpense}
                />
            )}
        </div>
    );
}
