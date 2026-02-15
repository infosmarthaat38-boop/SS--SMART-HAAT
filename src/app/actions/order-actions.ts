'use server';

import { initializeFirebase } from '@/firebase';
import { collection, doc, runTransaction } from 'firebase/firestore';

/**
 * Server Action to handle order creation with automatic stock management.
 * Optimized for high-speed transactions and 100% data accuracy.
 */
export async function createOrderAndNotify(orderData: any) {
  try {
    const { firestore } = initializeFirebase();
    
    const result = await runTransaction(firestore, async (transaction) => {
      const productRef = doc(firestore, 'products', orderData.productId);
      const productDoc = await transaction.get(productRef);
      
      if (!productDoc.exists()) {
        throw new Error('PRODUCT_NOT_FOUND');
      }
      
      const product = productDoc.data();
      const orderQty = orderData.quantity || 1;
      const currentGlobalStock = product.stockQuantity || 0;
      
      // 1. Check Global Stock
      if (currentGlobalStock < orderQty) {
        throw new Error('OUT_OF_STOCK');
      }
      
      let updateData: any = {
        stockQuantity: currentGlobalStock - orderQty
      };

      // 2. Handle Size-specific Stock if applicable
      if (product.sizeStock && orderData.selectedSize && orderData.selectedSize !== 'N/A') {
        const currentSizeStock = product.sizeStock[orderData.selectedSize] || 0;
        if (currentSizeStock < orderQty) {
          throw new Error('SIZE_OUT_OF_STOCK');
        }
        
        updateData.sizeStock = {
          ...product.sizeStock,
          [orderData.selectedSize]: currentSizeStock - orderQty
        };
      }

      // 3. Update Product Stock
      transaction.update(productRef, updateData);

      // 4. Create Order Record
      const orderRef = doc(collection(firestore, 'orders'));
      transaction.set(orderRef, {
        ...orderData,
        createdAt: new Date().toISOString()
      });

      return { id: orderRef.id };
    });

    return { success: true, id: result.id };
  } catch (error: any) {
    console.error('Order Submission Error:', error);
    return { 
      success: false, 
      error: error.message === 'OUT_OF_STOCK' || error.message === 'SIZE_OUT_OF_STOCK' 
        ? 'STOCK_LIMIT_EXCEEDED' 
        : 'SYSTEM_ERROR' 
    };
  }
}
