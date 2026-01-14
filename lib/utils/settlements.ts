// Settlement calculation utilities

interface Balance {
    userId: string;
    userName: string;
    balance: number; // positive = owed to them, negative = they owe
}

interface Settlement {
    from: string;
    fromName: string;
    to: string;
    toName: string;
    amount: number;
}

export type { Settlement };

/**
 * Calculate optimal settlements using greedy algorithm
 * This minimizes the number of transactions needed
 */
export function calculateSettlements(balances: Balance[]): Settlement[] {
    const settlements: Settlement[] = [];

    // Create working copy
    const workingBalances = balances.map((b) => ({ ...b }));

    // Sort: debtors (negative) first, then creditors (positive)
    workingBalances.sort((a, b) => a.balance - b.balance);

    let left = 0; // Points to person who owes most
    let right = workingBalances.length - 1; // Points to person who is owed most

    while (left < right) {
        const debtor = workingBalances[left];
        const creditor = workingBalances[right];

        // Skip if debtor has paid everything
        if (debtor.balance >= 0) {
            left++;
            continue;
        }

        // Skip if creditor has been paid everything
        if (creditor.balance <= 0) {
            right--;
            continue;
        }

        // Calculate settlement amount
        const debtAmount = Math.abs(debtor.balance);
        const creditAmount = creditor.balance;
        const settlementAmount = Math.min(debtAmount, creditAmount);

        // Create settlement
        settlements.push({
            from: debtor.userId,
            fromName: debtor.userName,
            to: creditor.userId,
            toName: creditor.userName,
            amount: settlementAmount,
        });

        // Update balances
        debtor.balance += settlementAmount;
        creditor.balance -= settlementAmount;

        // Move pointers if balance is settled
        if (debtor.balance === 0) left++;
        if (creditor.balance === 0) right--;
    }

    return settlements;
}

/**
 * Calculate balances from expenses for a group
 */
export async function calculateBalancesFromExpenses(
    expenses: any[],
    splits: any[],
    members: any[]
): Promise<Balance[]> {
    const balanceMap: Record<string, { name: string; balance: number }> = {};

    // Initialize all members with 0 balance
    members.forEach((member) => {
        balanceMap[member.user_id] = {
            name: member.name,
            balance: 0,
        };
    });

    // Process each expense
    expenses.forEach((expense) => {
        // Get splits for this expense
        const expenseSplits = splits.filter((s) => s.expense_id === expense.id);

        expenseSplits.forEach((split) => {
            if (!balanceMap[split.user_id]) return;

            // If this person paid the expense, they are owed
            if (split.user_id === expense.paid_by) {
                // They paid the full amount but only owe their split
                balanceMap[split.user_id].balance += expense.amount - split.amount;
            } else {
                // They owe their split amount
                balanceMap[split.user_id].balance -= split.amount;
            }
        });
    });

    // Convert to array
    return Object.entries(balanceMap).map(([userId, data]) => ({
        userId,
        userName: data.name,
        balance: data.balance,
    }));
}
