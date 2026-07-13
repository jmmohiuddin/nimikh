/**
 * Client testimonials shown on the homepage. Real quotes only; if a
 * client hasn't signed off on their name being used, use their role and
 * industry ("Founder, Series-A SaaS") — see ADR-05 for the
 * no-fabrication policy.
 */
export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initial: string;
  gradient: string;
  delayClass?: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      'Nimikh built our entire e-commerce store from scratch in just 3 weeks. The quality blew us away — and sales went up 180% in the first month after launch.',
    name: 'Rahim Chowdhury',
    role: 'Founder, Dhaka Threads',
    initial: 'R',
    gradient: 'linear-gradient(135deg,#5e6ad2,#7c3aed)',
  },
  {
    quote:
      "We needed affordable video content for our Facebook ads. Nimikh matched us with a local creator within 48 hours. The content performed better than anything we'd made before.",
    name: 'Fatima Begum',
    role: 'Marketing Manager, NutriBoost BD',
    initial: 'F',
    gradient: 'linear-gradient(135deg,#0ea5e9,#5e6ad2)',
    delayClass: 'd1',
  },
  {
    quote:
      "Their Google Ads team took our cost-per-lead from ৳450 down to ৳120. That's not marketing — that's magic. Nimikh is now our long-term growth partner.",
    name: 'Tanvir Ahmed',
    role: 'CEO, SkyTech Solutions',
    initial: 'T',
    gradient: 'linear-gradient(135deg,#10b981,#0ea5e9)',
    delayClass: 'd2',
  },
];
