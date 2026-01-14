import { Settlement } from '@/lib/utils/settlements';
import { ArrowRight } from 'lucide-react';

interface SettlementsListProps {
    settlements: Settlement[];
    currentUserId: string;
    onMarkAsPaid?: (settlement: Settlement) => void;
}

export function SettlementsList({
    settlements,
    currentUserId,
    onMarkAsPaid,
}: SettlementsListProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
        }).format(amount / 100);
    };

    if (settlements.length === 0) {
        return (
            <div className="text-center py-8 text-vintage-black/60">
                <p className="mb-2">🎉 All settled up!</p>
                <p className="text-sm">No pending settlements in this group</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {settlements.map((settlement, index) => {
                const isInvolved = settlement.from === currentUserId || settlement.to === currentUserId;
                const isPayer = settlement.from === currentUserId;

                return (
                    <div
                        key={index}
                        className={`p-4 rounded-vintage border transition-all ${isInvolved
                                ? 'bg-vintage-amber/10 border-vintage-amber shadow-vintage'
                                : 'bg-white border-vintage-amber/20'
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex-1 flex items-center gap-3">
                                <div className="text-center">
                                    <p className="font-medium text-vintage-black">
                                        {settlement.fromName}
                                        {settlement.from === currentUserId && (
                                            <span className="text-xs text-vintage-amber ml-1">(You)</span>
                                        )}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 text-vintage-amber">
                                    <ArrowRight className="w-5 h-5" />
                                    <span className="text-xl font-bold">
                                        {formatCurrency(settlement.amount)}
                                    </span>
                                    <ArrowRight className="w-5 h-5" />
                                </div>

                                <div className="text-center">
                                    <p className="font-medium text-vintage-black">
                                        {settlement.toName}
                                        {settlement.to === currentUserId && (
                                            <span className="text-xs text-vintage-amber ml-1">(You)</span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            {isInvolved && onMarkAsPaid && (
                                <button
                                    onClick={() => onMarkAsPaid(settlement)}
                                    className="px-4 py-2 bg-vintage-amber hover:bg-vintage-amber-dark text-white rounded-vintage text-sm font-medium transition-colors"
                                >
                                    {isPayer ? 'Mark as Paid' : 'Confirm Received'}
                                </button>
                            )}
                        </div>

                        {isPayer && (
                            <p className="text-xs text-vintage-black/60 mt-2">
                                You need to pay {settlement.toName}
                            </p>
                        )}
                        {settlement.to === currentUserId && (
                            <p className="text-xs text-vintage-black/60 mt-2">
                                {settlement.fromName} needs to pay you
                            </p>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
