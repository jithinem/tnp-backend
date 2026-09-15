import prisma from '@/shared/prisma';

/**
 * For lead create/update: `undefined` means omit field, `null` clear / no link,
 * positive id must reference a non-deleted customer.
 */
const resolveLeadCustomerId = async (
  customerId: number | null | undefined
): Promise<number | null | undefined> => {
  if (customerId === undefined) return undefined;
  if (customerId === null) return null;
  const customer = await prisma.customer.findFirst({
    where: { id: customerId, is_deleted: false },
    select: { id: true },
  });
  if (!customer) throw new Error('Customer not found');
  return customer.id;
};

export { resolveLeadCustomerId };
