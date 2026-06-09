import Stripe from 'stripe'
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' })

export const PLANS = {
  free: { name: 'Gratuit', price: 0, maxProperties: 1, maxUnits: 3, priceId: null },
  starter: { name: 'Débutant', price: 29, maxProperties: 3, maxUnits: 15, priceId: process.env.STRIPE_STARTER_PRICE_ID },
  pro: { name: 'Pro', price: 79, maxProperties: 999, maxUnits: 999, priceId: process.env.STRIPE_PRO_PRICE_ID },
}
