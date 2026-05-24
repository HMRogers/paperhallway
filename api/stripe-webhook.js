import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const config = { api: { bodyParser: false } };

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const customerEmail = session.customer_email || session.customer_details?.email;
    const stripeCustomerId = session.customer;
    const subscriptionId = session.subscription;

    if (customerEmail) {
      await supabase
        .from('profiles')
        .update({
          is_subscribed: true,
          stripe_customer_id: stripeCustomerId,
          subscription_id: subscriptionId,
          updated_at: new Date().toISOString()
        })
        .eq('email', customerEmail);
    }
  }

  if (event.type === 'customer.subscription.deleted' || event.type === 'customer.subscription.canceled') {
    const subscription = event.data.object;
    const stripeCustomerId = subscription.customer;

    await supabase
      .from('profiles')
      .update({
        is_subscribed: false,
        subscription_id: null,
        updated_at: new Date().toISOString()
      })
      .eq('stripe_customer_id', stripeCustomerId);
  }

  res.status(200).json({ received: true });
}
