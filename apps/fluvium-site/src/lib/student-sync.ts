/**
 * Student Sync Utility
 * Links Vendure customers to humility_db Student records
 * Safe: No modifications to Vendure database
 */

import {
  getStudentByVendureCustomerId,
  createStudent,
  type CreateStudentInput,
} from '@repo/db';
import type { Customer } from './vendure/types';

export interface StudentSyncResult {
  student: Awaited<ReturnType<typeof getStudentByVendureCustomerId>>;
  isNewStudent: boolean;
}

/**
 * Get or create a Student record for a Vendure customer
 * This is the bridge between Vendure auth and Humility DB features
 */
export async function syncStudent(vendureCustomer: Customer): Promise<StudentSyncResult> {
  // Try to find existing student
  let student = await getStudentByVendureCustomerId(vendureCustomer.id);

  if (student) {
    return {
      student,
      isNewStudent: false,
    };
  }

  // Create new student record
  const input: CreateStudentInput = {
    vendureCustomerId: vendureCustomer.id,
    email: vendureCustomer.emailAddress,
    firstName: vendureCustomer.firstName || null,
    lastName: vendureCustomer.lastName || null,
    beltRank: 'WHITE', // Default for new students
  };

  student = await createStudent(input);

  return {
    student,
    isNewStudent: true,
  };
}

/**
 * Get Student ID for a Vendure customer
 * Returns null if not found (user hasn't accessed Humility DB yet)
 */
export async function getStudentId(vendureCustomerId: string): Promise<string | null> {
  const student = await getStudentByVendureCustomerId(vendureCustomerId);
  return student?.id || null;
}

/**
 * Ensure a student exists for the given Vendure customer
 * Throws error if customer is not provided
 */
export async function requireStudent(
  vendureCustomer: Customer | null
): Promise<NonNullable<Awaited<ReturnType<typeof getStudentByVendureCustomerId>>>> {
  if (!vendureCustomer) {
    throw new Error('Authentication required');
  }

  const { student } = await syncStudent(vendureCustomer);

  if (!student) {
    throw new Error('Failed to create student record');
  }

  return student;
}
