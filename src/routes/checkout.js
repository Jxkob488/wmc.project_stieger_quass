const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

// POST /api/checkout
// Body: { email: string, cart: [{id,name,price,quantity}], optional: customer info }
router.post('/checkout', async (req, res) => {
  try {
    const { email, cart } = req.body;

    if (!email) return res.status(400).json({ error: 'Email is required' });
    if (!Array.isArray(cart) || cart.length === 0) return res.status(400).json({ error: 'Cart is empty' });

    const total = cart.reduce((s, item) => s + (item.price || 0) * (item.quantity || 1), 0);

    const orderLines = cart.map(item => `- ${item.name} x${item.quantity || 1}: €${((item.price||0) * (item.quantity||1)).toFixed(2)}`).join('\n');

    const subject = `Order confirmation — Total €${total.toFixed(2)}`;
    const text = `Thank you for your order.\n\nYour order:\n${orderLines}\n\nTotal: €${total.toFixed(2)}\n\nWe will process your order soon.`;

    // Simple HTML layout for the order email (kept small and clear)
    const html = `
      <div style="font-family:Arial,sans-serif;color:#222;line-height:1.4">
        <h2 style="color:#333">Bestellbestätigung</h2>
        <p>Vielen Dank für Ihre Bestellung.</p>
        <h3>Ihre Bestellung</h3>
        <ul>
          ${cart.map(item => `<li>${item.name} x${item.quantity || 1} — €${(((item.price||0)*(item.quantity||1))).toFixed(2)}</li>`).join('')}
        </ul>
        <p><strong>Gesamt: €${total.toFixed(2)}</strong></p>
        <p>Wir bearbeiten Ihre Bestellung in Kürze.</p>
        <hr>
        <small>Online Shop</small>
      </div>
    `;

    // Create transporter: use real SMTP if configured, otherwise use Ethereal for testing
    let transporter;
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // fallback to Ethereal test account
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const from = process.env.FROM_EMAIL || 'no-reply@online-shop.test';

    const info = await transporter.sendMail({
      from,
      to: email,
      subject,
      text,
      html,
    });

    const response = { success: true };
    if (nodemailer.getTestMessageUrl && nodemailer.getTestMessageUrl(info)) {
      response.previewUrl = nodemailer.getTestMessageUrl(info);
    }

    res.json(response);
  } catch (err) {
    console.error('Checkout error', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

module.exports = router;
