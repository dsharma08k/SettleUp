'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { Card } from '@/components/ui/Card';
import { db } from '@/lib/db';
import { Wallet, TrendingUp, TrendingDown, Users } from 'lucide-react';

interface DashboardStats {
    totalOwed: number; // Amount others owe you
    totalOwing: number; // Amount you owe others
    groupsCount: number;
    recentExpensesCount: number;
}

export default function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats>({
        totalOwed: 0,
        totalOwing: 0,
        groupsCount: 0,
        recentExpensesCount: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, [user]);

    const loadStats = async () => {
        if (!user) return;

        try {
            // Get groups count
            const groupsCount = await db.group_members
                .where('user_id')
                .equals(user.id)
                .count();

            // Get user's groups
            const userGroups = await db.group_members
                .where('user_id')
                .equals(user.id)
                .toArray();

            const groupIds = userGroups.map((gm) => gm.group_id);

            // Get expenses from user's groups
            const expenses = await db.expenses
                .where('group_id')
                .anyOf(groupIds)
                .toArray();

            // Get expense splits
            const splits = await db.expense_splits.toArray();

            // Calculate amounts owed and owing
            let totalOwed = 0;
            let totalOwing = 0;

            for (const split of splits) {
                if (split.user_id === user.id && !split.is_paid) {
                    // Find the expense
                    const expense = expenses.find((e) => e.id === split.expense_id);
                    if (expense) {
                        if (expense.paid_by === user.id) {
                            // You paid, so this split is owed to you
                            totalOwed += split.amount;
                        } else {
                            // Someone else paid, so you owe this
                            totalOwing += split.amount;
                        }
                    }
                }
            }

            setStats({
                totalOwed,
                totalOwing,
                groupsCount,
                recentExpensesCount: expenses.length,
            });
        } catch (error) {
            console.error('Failed to load stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
        }).format(amount / 100); // Convert paise to rupees
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-vintage-amber text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-vintage-amber mb-2">
                    Welcome Back, {user?.user_metadata?.name || 'Friend'}!
                </h1>
                <p className="text-vintage-black/70">
                    Here's your expense overview
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Owed to You */}
                <Card className="hover:shadow-vintage-lg transition-shadow">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-vintage-black/60 mb-1">You're Owed</p>
                            <p className="text-3xl font-bold text-green-600">
                                {formatCurrency(stats.totalOwed)}
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-vintage">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </Card>

                {/* Total You Owe */}
                <Card className="hover:shadow-vintage-lg transition-shadow">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-vintage-black/60 mb-1">You Owe</p>
                            <p className="text-3xl font-bold text-red-600">
                                {formatCurrency(stats.totalOwing)}
                            </p>
                        </div>
                        <div className="p-3 bg-red-100 rounded-vintage">
                            <TrendingDown className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </Card>

                {/* Total Groups */}
                <Card className="hover:shadow-vintage-lg transition-shadow">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-vintage-black/60 mb-1">Groups</p>
                            <p className="text-3xl font-bold text-vintage-amber">
                                {stats.groupsCount}
                            </p>
                        </div>
                        <div className="p-3 bg-vintage-amber/20 rounded-vintage">
                            <Users className="w-6 h-6 text-vintage-amber" />
                        </div>
                    </div>
                </Card>

                {/* Total Expenses */}
                <Card className="hover:shadow-vintage-lg transition-shadow">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-vintage-black/60 mb-1">Expenses</p>
                            <p className="text-3xl font-bold text-vintage-black">
                                {stats.recentExpensesCount}
                            </p>
                        </div>
                        <div className="p-3 bg-vintage-cream rounded-vintage border border-vintage-amber/20">
                            <Wallet className="w-6 h-6 text-vintage-black" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <h3 className="text-xl font-semibold text-vintage-black mb-4">
                        Recent Activity
                    </h3>
                    <p className="text-vintage-black/60">
                        {stats.recentExpensesCount > 0
                            ? 'Your recent expenses will appear here'
                            : 'No expenses yet. Create a group to get started!'}
                    </p>
                </Card>

                <Card>
                    <h3 className="text-xl font-semibold text-vintage-black mb-4">
                        Quick Actions
                    </h3>
                    <div className="space-y-3">
                        <a
                            href="/dashboard/groups"
                            className="block px-4 py-3 bg-vintage-amber hover:bg-vintage-amber-dark text-white rounded-vintage transition-colors text-center font-medium"
                        >
                            View Groups
                        </a>
                        <a
                            href="/dashboard/groups/new"
                            className="block px-4 py-3 bg-vintage-cream hover:bg-vintage-amber-light border border-vintage-amber text-vintage-black rounded-vintage transition-colors text-center font-medium"
                        >
                            Create New Group
                        </a>
                    </div>
                </Card>
            </div>
        </div>
    );
}
