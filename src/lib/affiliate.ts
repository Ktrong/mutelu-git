import prisma from '@/lib/prisma';

/**
 * Distributes commission to uplines when an order is completed.
 * @param {string} orderId - ID of the customOrder or order
 * @param {string} affiliateCode - The code used in the order
 * @param {number} totalAmount - The total amount paid
 */
export async function distributeCommission(orderId: string, affiliateCode: string, totalAmount: number) {
    if (!affiliateCode || totalAmount <= 0) return;

    try {
        // Find the owner of the code
        const affiliate = await prisma.affiliateCode.findUnique({
            where: { code: affiliateCode },
            include: { user: true }
        });

        if (!affiliate || !affiliate.user) return;

        // Fetch all commission rates
        const rates = await prisma.commissionRate.findMany({
            orderBy: { level: 'asc' }
        });

        if (rates.length === 0) {
            console.log("No commission rates configured. Skipping distribution.");
            return;
        }

        let currentUser: any = affiliate.user;
        let currentLevel = 1;

        // Traverse upline
        while (currentUser && currentLevel <= rates.length) {
            const levelRate = rates.find(r => r.level === currentLevel);
            if (!levelRate || levelRate.percentage <= 0) {
                // If there's no rate for this level or it's 0, skip
                break;
            }

            const commissionAmount = (totalAmount * levelRate.percentage) / 100;

            if (commissionAmount > 0) {
                // We use a transaction to ensure atomic updates
                await prisma.$transaction([
                    prisma.commissionTransaction.create({
                        data: {
                            userId: currentUser.id,
                            fromCustomOrderId: orderId, // assuming CustomOrder here
                            amount: commissionAmount,
                            level: currentLevel,
                        }
                    }),
                    prisma.user.update({
                        where: { id: currentUser.id },
                        data: { commissionBalance: { increment: commissionAmount } }
                    })
                ]);
            }

            // Move up to the referrer
            if (currentUser.referrerId) {
                currentUser = await prisma.user.findUnique({
                    where: { id: currentUser.referrerId }
                });
                currentLevel++;
            } else {
                break; // No more upline
            }
        }
    } catch (error) {
        console.error("Error distributing commission:", error);
    }
}
