import { db, Group, GroupMember, Expense, ExpenseSplit } from './index';
import { v4 as uuidv4 } from 'uuid';

// Generate a random 6-character invite code
function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// ============== GROUP OPERATIONS ==============

export async function createGroup(
  userId: string,
  userName: string,
  groupData: { name: string; description?: string }
): Promise<{ group: Group; error: null } | { group: null; error: string }> {
  try {
    const inviteCode = generateInviteCode();
    const now = new Date().toISOString();

    const group: Group = {
      id: uuidv4(),
      name: groupData.name,
      description: groupData.description || '',
      invite_code: inviteCode,
      created_by: userId,
      created_at: now,
      updated_at: now,
      last_modified_at: now,
    };

    await db.groups.add(group);

    const member: GroupMember = {
      id: uuidv4(),
      group_id: group.id,
      user_id: userId,
      name: userName,
      role: 'admin',
      joined_at: now,
      last_modified_at: now,
    };

    await db.group_members.add(member);

    await addToSyncQueue(userId, 'groups', 'insert', group.id, group);
    await addToSyncQueue(userId, 'group_members', 'insert', member.id, member);

    return { group, error: null };
  } catch (error: any) {
    console.error('Error creating group:', error);
    return { group: null, error: error.message || 'Failed to create group' };
  }
}

export async function getGroups(userId: string): Promise<Group[]> {
  try {
    const memberships = await db.group_members
      .where('user_id')
      .equals(userId)
      .toArray();

    const groupIds = memberships.map((m) => m.group_id);
    const groups = await db.groups.where('id').anyOf(groupIds).toArray();

    return groups;
  } catch (error) {
    console.error('Error fetching groups:', error);
    return [];
  }
}

export async function getGroup(groupId: string): Promise<Group | null> {
  try {
    return (await db.groups.get(groupId)) || null;
  } catch (error) {
    console.error('Error fetching group:', error);
    return null;
  }
}

export async function joinGroup(
  userId: string,
  userName: string,
  inviteCode: string
): Promise<{ success: boolean; error?: string; group?: Group }> {
  try {
    const group = await db.groups.where('invite_code').equals(inviteCode).first();

    if (!group) {
      return { success: false, error: 'Invalid invite code' };
    }

    const existing = await db.group_members
      .where(['group_id', 'user_id'])
      .equals([group.id, userId])
      .first();

    if (existing) {
      return { success: false, error: 'Already a member of this group' };
    }

    const now = new Date().toISOString();
    const member: GroupMember = {
      id: uuidv4(),
      group_id: group.id,
      user_id: userId,
      name: userName,
      role: 'member',
      joined_at: now,
      last_modified_at: now,
    };

    await db.group_members.add(member);
    await addToSyncQueue(userId, 'group_members', 'insert', member.id, member);

    return { success: true, group };
  } catch (error: any) {
    console.error('Error joining group:', error);
    return { success: false, error: error.message || 'Failed to join group' };
  }
}

export async function getGroupMembers(groupId: string): Promise<GroupMember[]> {
  try {
    return await db.group_members.where('group_id').equals(groupId).toArray();
  } catch (error) {
    console.error('Error fetching group members:', error);
    return [];
  }
}

// ============== EXPENSE OPERATIONS ==============

interface CreateExpenseData {
  title: string;
  amount: number; // in paise
  category?: string;
  groupId: string;
  paidBy: string;
  splitType: 'equal' | 'custom';
  splits: { userId: string; userName: string; amount: number }[];
}

export async function createExpense(
  userId: string,
  expenseData: CreateExpenseData
): Promise<{ expense: Expense; error: null } | { expense: null; error: string }> {
  try {
    const now = new Date().toISOString();

    const expense: Expense = {
      id: uuidv4(),
      title: expenseData.title,
      amount: expenseData.amount,
      currency: 'INR',
      category: expenseData.category || null,
      paid_by: expenseData.paidBy,
      date: now,
      group_id: expenseData.groupId,
      split_type: expenseData.splitType,
      created_by: userId,
      created_at: now,
      last_modified_at: now,
    };

    await db.expenses.add(expense);

    // Add expense splits
    for (const split of expenseData.splits) {
      const expenseSplit: ExpenseSplit = {
        id: uuidv4(),
        expense_id: expense.id,
        user_id: split.userId,
        user_name: split.userName,
        amount: split.amount,
        is_paid: split.userId === expenseData.paidBy, // Mark as paid if user is the payer
        last_modified_at: now,
      };

      await db.expense_splits.add(expenseSplit);
      await addToSyncQueue(userId, 'expense_splits', 'insert', expenseSplit.id, expenseSplit);
    }

    await addToSyncQueue(userId, 'expenses', 'insert', expense.id, expense);

    return { expense, error: null };
  } catch (error: any) {
    console.error('Error creating expense:', error);
    return { expense: null, error: error.message || 'Failed to create expense' };
  }
}

export async function getGroupExpenses(groupId: string): Promise<Expense[]> {
  try {
    return await db.expenses
      .where('group_id')
      .equals(groupId)
      .reverse()
      .sortBy('date');
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return [];
  }
}

export async function getExpense(expenseId: string): Promise<Expense | null> {
  try {
    return (await db.expenses.get(expenseId)) || null;
  } catch (error) {
    console.error('Error fetching expense:', error);
    return null;
  }
}

export async function getExpenseSplits(expenseId: string): Promise<ExpenseSplit[]> {
  try {
    return await db.expense_splits.where('expense_id').equals(expenseId).toArray();
  } catch (error) {
    console.error('Error fetching expense splits:', error);
    return [];
  }
}

export async function deleteExpense(
  userId: string,
  expenseId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Delete expense splits first
    await db.expense_splits.where('expense_id').equals(expenseId).delete();

    // Delete expense
    await db.expenses.delete(expenseId);

    // Add to sync queue
    await addToSyncQueue(userId, 'expenses', 'delete', expenseId, { id: expenseId });

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting expense:', error);
    return { success: false, error: error.message || 'Failed to delete expense' };
  }
}

// Helper function to add to sync queue
async function addToSyncQueue(
  userId: string,
  tableName: string,
  operation: 'insert' | 'update' | 'delete',
  recordId: string,
  data: any
) {
  try {
    await db.sync_queue.add({
      id: uuidv4(),
      user_id: userId,
      table_name: tableName,
      operation,
      record_id: recordId,
      data,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error adding to sync queue:', error);
  }
}
