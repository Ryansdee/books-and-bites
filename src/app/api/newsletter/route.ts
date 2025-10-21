export const dynamic = 'force-dynamic';
// src/app/api/newsletter/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const adminDb = getFirestore();

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const snapshot = await adminDb
      .collection('newsletter')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      return NextResponse.json(
        { error: 'This email is already subscribed' },
        { status: 409 }
      );
    }

    // Save to Firestore
    await adminDb.collection('newsletter').add({
      email,
      subscribedAt: new Date().toISOString(),
      status: 'active',
    });

    // Send welcome email
    const mailOptions = {
      from: `"Books&Bites" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '📚 Welcome to Books&Bites Newsletter!',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background: white;
              }
              .header {
                background: linear-gradient(135deg, #d4739f 0%, #b85c89 100%);
                color: white;
                padding: 40px 20px;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
              }
              .content {
                padding: 40px 30px;
              }
              .content p {
                margin: 0 0 15px 0;
              }
              .content ul {
                padding-left: 20px;
                margin: 20px 0;
              }
              .content li {
                margin: 10px 0;
              }
              .button {
                display: inline-block;
                background: #d4739f;
                color: white;
                padding: 14px 35px;
                text-decoration: none;
                border-radius: 8px;
                margin-top: 25px;
                font-weight: bold;
                font-size: 16px;
              }
              .button:hover {
                background: #b85c89;
              }
              .footer {
                background: #f9f9f9;
                text-align: center;
                padding: 30px 20px;
                border-top: 1px solid #ddd;
                color: #666;
                font-size: 13px;
              }
              .footer p {
                margin: 5px 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to Books&Bites! 📚</h1>
              </div>
              <div class="content">
                <p>Hi there,</p>
                <p>Thank you for subscribing to our newsletter! We're thrilled to have you join our community of book lovers.</p>
                
                <p><strong>Here's what you can expect from us:</strong></p>
                <ul>
                  <li>📖 Weekly book reviews and recommendations</li>
                  <li>✨ Exclusive content and early access to new reviews</li>
                  <li>☕ Book pairing suggestions (books + perfect beverages)</li>
                  <li>💬 Community insights and discussions</li>
                </ul>
                
                <p>Get started by exploring our latest reviews:</p>
                <div style="text-align: center;">
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}" class="button">
                    Explore Reviews
                  </a>
                </div>
                
                <p style="margin-top: 30px;">Happy reading!</p>
                <p><strong>The Books&Bites Team</strong></p>
              </div>
              <div class="footer">
                <p>You're receiving this email because you subscribed to Books&Bites newsletter.</p>
                <p>Books&Bites © 2025 - Made with ♥ for book lovers</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
Welcome to Books&Bites!

Hi there,

Thank you for subscribing to our newsletter! We're thrilled to have you join our community of book lovers.

Here's what you can expect from us:
- Weekly book reviews and recommendations
- Exclusive content and early access to new reviews
- Book pairing suggestions (books + perfect beverages)
- Community insights and discussions

Visit us at: ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}

Happy reading!
The Books&Bites Team

---
You're receiving this email because you subscribed to Books&Bites newsletter.
Books&Bites © 2025 - Made with ♥ for book lovers
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter!' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    );
  }
}