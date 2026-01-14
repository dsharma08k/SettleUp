'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { GroupMember } from '@/lib/db';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

interface AddExpenseModalProps {
    groupId: string;
    members: GroupMember[];
    currentUserId: string;
    onClose: () => void;
    onAdd: (expenseData: any) => void;
}

export function AddExpenseModal({
    groupId,
    members,
    currentUserId,
    onClose,
    onAdd,
}: AddExpenseModalProps) {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [paidBy, setPaidBy] = useState(currentUserId);
    const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');
    const [customSplits, setCustomSplits] = useState<Record<string, string>>({});

    useEffect(() => {
        // Initialize custom splits with 0 for all members
        const initialSplits: Record<string, string> = {};
        members.forEach((member) => {
            initialSplits[member.user_id] = '0';
        });
        setCustomSplits(initialSplits);
    }, [members]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error('Title is required');
            return;
        }

        const amountValue = parseFloat(amount);
        if (!amountValue || amountValue <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        // Convert to paise (multiply by 100)
        const amountInPaise = Math.round(amountValue * 100);

        let splits: { userId: string; userName: string; amount: number }[] = [];

        if (splitType === 'equal') {
            // Equal split
            const splitAmount = Math.round(amountInPaise / members.length);
            let remainder = amountInPaise - splitAmount * members.length;

            splits = members.map((member, index) => ({
                userId: member.user_id,
                userName: member.name,
                amount: splitAmount + (index === 0 ? remainder : 0), // Add remainder to first person
            }));
        } else {
            // Custom split
            const totalCustom = Object.values(customSplits).reduce(
                (sum, val) => sum + (parseFloat(val) || 0) * 100,
                0
            );

            if (Math.abs(totalCustom - amountInPaise) > 1) {
                // Allow 1 paisa difference due to rounding
                toast.error('Split amounts must equal the total amount');
                return;
            }

            splits = members.map((member) => ({
                userId: member.user_id,
                userName: member.name,
                amount: Math.round((parseFloat(customSplits[member.user_id]) || 0) * 100),
            }));
        }

        onAdd({
            title,
            amount: amountInPaise,
            category,
            groupId,
            paidBy,
            splitType,
            splits,
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
        }).format(amount / 100);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <Card className="w-full max-w-2xl my-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-vintage-amber">Add Expense</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-vintage-amber/10 rounded-vintage transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Dinner at restaurant"
                        autoFocus
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Amount (₹)"
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="500.00"
                        />

                        <div>
                            <label className="block text-sm font-medium text-vintage-black mb-1.5">
                                Category (Optional)
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-vintage bg-white border border-vintage-amber/30 text-vintage-black focus:outline-none focus:ring-2 focus:ring-vintage-amber focus:border-transparent transition-all duration-200"
                            >
                                <option value="">Select category</option>
                                <option value="Food">Food</option>
                                <option value="Transport">Transport</option>
                                <option value="Accommodation">Accommodation</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Shopping">Shopping</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-vintage-black mb-1.5">
                            Paid By
                        </label>
                        <select
                            value={paidBy}
                            onChange={(e) => setPaidBy(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-vintage bg-white border border-vintage-amber/30 text-vintage-black focus:outline-none focus:ring-2 focus:ring-vintage-amber focus:border-transparent transition-all duration-200"
                        >
                            {members.map((member) => (
                                <option key={member.user_id} value={member.user_id}>
                                    {member.name} {member.user_id === currentUserId && '(You)'}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-vintage-black mb-3">
                            Split Method
                        </label>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setSplitType('equal')}
                                className={`flex-1 px-4 py-3 rounded-vintage border transition-colors ${splitType === 'equal'
                                        ? 'bg-vintage-amber text-white border-vintage-amber'
                                        : 'bg-white text-vintage-black border-vintage-amber/30 hover:border-vintage-amber'
                                    }`}
                            >
                                Equal Split
                            </button>
                            <button
                                type="button"
                                onClick={() => setSplitType('custom')}
                                className={`flex-1 px-4 py-3 rounded-vintage border transition-colors ${splitType === 'custom'
                                        ? 'bg-vintage-amber text-white border-vintage-amber'
                                        : 'bg-white text-vintage-black border-vintage-amber/30 hover:border-vintage-amber'
                                    }`}
                            >
                                Custom Split
                            </button>
                        </div>
                    </div>

                    {/* Split Preview */}
                    <div className="bg-vintage-cream/50 rounded-vintage p-4 border border-vintage-amber/20">
                        <h4 className="font-semibold text-vintage-black mb-3">Split Preview</h4>
                        <div className="space-y-2">
                            {splitType === 'equal' ? (
                                members.map((member, index) => {
                                    const amountValue = parseFloat(amount) || 0;
                                    const splitAmount = amountValue / members.length;
                                    return (
                                        <div key={member.user_id} className="flex justify-between text-sm">
                                            <span>{member.name}</span>
                                            <span className="font-medium">
                                                {formatCurrency(Math.round(splitAmount * 100))}
                                            </span>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="space-y-3">
                                    {members.map((member) => (
                                        <div key={member.user_id} className="flex items-center gap-3">
                                            <span className="flex-1 text-sm">{member.name}</span>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={customSplits[member.user_id] || ''}
                                                onChange={(e) =>
                                                    setCustomSplits({
                                                        ...customSplits,
                                                        [member.user_id]: e.target.value,
                                                    })
                                                }
                                                placeholder="0.00"
                                                className="w-32"
                                            />
                                        </div>
                                    ))}
                                    <div className="pt-2 border-t border-vintage-amber/20 flex justify-between text-sm font-semibold">
                                        <span>Total</span>
                                        <span>
                                            {formatCurrency(
                                                Object.values(customSplits).reduce(
                                                    (sum, val) => sum + (parseFloat(val) || 0) * 100,
                                                    0
                                                )
                                            )}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="button" onClick={onClose} variant="outline" className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1">
                            Add Expense
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
