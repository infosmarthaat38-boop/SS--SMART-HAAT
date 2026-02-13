
'use server';

import { Resend } from 'resend';
import { initializeFirebase } from '@/firebase';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';

/**
 * Server Action to handle order creation and send email notifications.
 * Offloads heavy processing from the client for 100% speed.
 */
export async function createOrderAndNotify(orderData: any) {
  try {
    const { firestore } = initializeFirebase();
    
    // 1. Save order to Firestore
    const docRef = await addDoc(collection(firestore, 'orders'), {
      ...orderData,
      createdAt: new Date().toISOString()
    });

    // 2. Fetch admin email from settings
    const settingsSnap = await getDoc(doc(firestore, 'settings', 'site-config'));
    const settings = settingsSnap.exists() ? settingsSnap.data() : null;
    const adminEmail = settings?.email;

    // 3. Send Email Notification if API key is present
    if (adminEmail && process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        await resend.emails.send({
          from: 'SS SMART HAAT <onboarding@resend.dev>', // Default Resend test sender
          to: adminEmail,
          subject: `NEW ORDER: ${orderData.productName}`,
          html: `
            <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
              <h2 style="color: #01a3a4; border-bottom: 2px solid #01a3a4; padding-bottom: 10px; text-transform: uppercase;">New Order Received</h2>
              <p style="font-size: 14px;"><strong>Customer:</strong> ${orderData.customerName}</p>
              <p style="font-size: 14px;"><strong>Phone:</strong> ${orderData.customerPhone}</p>
              <p style="font-size: 14px;"><strong>Address:</strong> ${orderData.customerAddress}</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
              <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #01a3a4;">
                <p style="margin: 0; font-size: 16px;"><strong>Product:</strong> ${orderData.productName}</p>
                <p style="margin: 5px 0; font-size: 14px;"><strong>Quantity:</strong> ${orderData.quantity}</p>
                <p style="margin: 5px 0; font-size: 14px;"><strong>Size:</strong> ${orderData.selectedSize}</p>
                <p style="margin: 5px 0; font-size: 16px; color: #01a3a4;"><strong>Total Price:</strong> ৳${(orderData.productPrice * orderData.quantity).toLocaleString()}</p>
              </div>
              <p style="font-size: 10px; color: #888; margin-top: 30px; text-align: center;">Order ID: ${docRef.id}</p>
            </div>
          `
        });
      } catch (emailErr) {
        console.error('Email Dispatch Error:', emailErr);
        // We still return success because the order is saved in Firestore
      }
    } else {
      console.warn('Email notification skipped: Admin email or RESEND_API_KEY missing.');
    }

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Order Submission Error:', error);
    return { success: false, error: 'SYSTEM_ERROR' };
  }
}
