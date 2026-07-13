import type { Metadata } from 'next';
import Link from 'next/link';
import { Accordion } from '../(shared)/Accordion';
import { JsonLd } from '../(shared)/JsonLd';
import { faqPage, graph } from '@/lib/schema';
import { absoluteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Frequently asked questions about Nimikh’s services, pricing, the creator marketplace, escrow, and how we work.',
  alternates: { canonical: absoluteUrl('/faq') },
};

const sections = [
  {
    id: 'general', label: 'General',
    faqs: [
      { question: 'What is Nimikh and what do you do?', answer: 'Nimikh is a digital growth agency based in Dhaka, Bangladesh. We provide three core services: software development (websites, e-commerce stores, web apps), growth marketing (paid ads, SEO, social media), and a creator marketplace that connects small businesses with affordable local creative talent. Our goal is to be the one agency that handles everything your business needs to grow online.' },
      { question: 'Do you work with businesses outside Dhaka or Bangladesh?', answer: "Yes. We're a remote-first agency and work with clients across Bangladesh and internationally. All project management, communication, and delivery is handled digitally. International clients can pay via Stripe, Payoneer, or Wise." },
      { question: 'How quickly can you start my project?', answer: "Most projects start within 1–2 weeks of agreeing on scope and receiving the initial deposit. We'll confirm the exact start date and timeline during the discovery call or proposal stage." },
      { question: 'What languages do you work in?', answer: 'We work fluently in both Bangla and English. All deliverables — websites, ad copy, content — can be produced in either or both languages depending on your target audience.' },
      { question: "What if I'm not happy with the work?", answer: "We don't consider a project done until you're satisfied. Every engagement includes a defined number of revision rounds, and we address feedback promptly. For marketplace orders, escrow protects your funds until you approve the final deliverable." },
    ],
  },
  {
    id: 'software', label: 'Software Development',
    faqs: [
      { question: 'How long does it take to build a website?', answer: "A standard 5-page business website takes 2–3 weeks. An e-commerce store takes 4–6 weeks depending on complexity. Custom web applications typically take 8–16 weeks. We'll give you a precise timeline in your proposal." },
      { question: 'What technology do you use to build websites?', answer: 'We primarily use Next.js (React) for the frontend and Node.js or Go for the backend. For simpler business websites, we may use WordPress depending on your maintenance needs. All our builds use modern, well-supported technology stacks that are easy to maintain and hand over to your team if needed.' },
      { question: 'Do you integrate bKash, Nagad, and local courier APIs?', answer: "Yes, this is a speciality of ours. We've integrated bKash and Nagad payment gateways into dozens of e-commerce projects, and we have ready-made integrations for Pathao, Steadfast, and RedX courier APIs to automate order fulfilment." },
      { question: 'Will I own the code and website after delivery?', answer: 'Absolutely. Upon final payment, all intellectual property — code, designs, assets — transfers to you completely. We provide full source code and documentation.' },
      { question: 'Do you provide hosting and maintenance?', answer: 'We can deploy and manage hosting on your behalf (typically on Vercel or AWS), and we offer monthly maintenance retainers for updates, backups, and technical support. Alternatively, we can hand everything over and you manage it yourself.' },
    ],
  },
  {
    id: 'marketing', label: 'Growth Marketing',
    faqs: [
      { question: 'Is there a minimum ad spend requirement?', answer: "We recommend a minimum of ৳10,000/month in ad spend to generate meaningful data and results. Ad spend is billed separately — directly to your Meta or Google account — so you're always in control of your budget." },
      { question: 'How do you report on campaign performance?', answer: "All clients get access to a shared dashboard showing real-time performance data. We also send weekly or monthly reports (depending on your package) with plain-English explanations of what's working, what we're changing, and what we expect next." },
      { question: 'Can I cancel the marketing retainer anytime?', answer: "Yes. Our retainers are month-to-month with no lock-in. We just ask for 30 days' notice so we can wrap up campaigns cleanly and hand everything over. We don't believe in trapping clients — we keep your business by getting results, not by contracts." },
      { question: 'How long before I start seeing results from SEO?', answer: "SEO is a long-term investment. Most clients see meaningful organic ranking improvements within 3–6 months, with compounding growth after that. We'll set realistic expectations in the kickoff call based on your current site health and competition." },
    ],
  },
  {
    id: 'marketplace', label: 'Creator Marketplace',
    faqs: [
      { question: 'How do I hire a creator?', answer: "Browse our marketplace and filter by skill, budget, and availability. When you find a creator you like, send them a brief describing your project. They'll respond within 24 hours. Once you agree on scope and price, we set up the escrow and they get started." },
      { question: "What's the minimum budget for a marketplace order?", answer: 'The minimum order through our marketplace is ৳3,000. This ensures creators are compensated fairly for their time and skill.' },
      { question: 'Can creators ship physical products for review?', answer: 'Yes. If your campaign involves a physical product (like a food item, clothing, or gadget), we handle the logistics. We book a courier pickup from your location and ship the product to the creator. The shipping cost is added to the project budget.' },
      { question: 'How many revision rounds do I get?', answer: 'Standard marketplace orders include one round of revisions. If you need more, you can purchase additional revision rounds at an agreed rate. Revisions must be requested within 48 hours of receiving the initial delivery.' },
      { question: 'What types of content can I order?', answer: 'You can order short-form videos (Reels, TikToks, YouTube Shorts), graphic design (logos, social media assets, banners), motion graphics (animated ads, logo reveals), photography (product, lifestyle), and copywriting (ad copy, captions, blog posts) in Bangla or English.' },
    ],
  },
  {
    id: 'payments', label: 'Payments & Escrow',
    faqs: [
      { question: 'What payment methods do you accept?', answer: "For local clients we accept bKash, Nagad, and bank transfer (BRAC, Dutch-Bangla, etc.). For international clients we accept Stripe, Payoneer, and Wise transfers. We'll confirm the best method for your situation during the proposal stage." },
      { question: 'How does escrow work exactly?', answer: "When you place a marketplace order, you pay the agreed amount upfront into our escrow system. The funds are held securely and are not released to the creator until you explicitly approve the final deliverable. If the creator doesn't deliver or the work doesn't meet the agreed brief, we mediate and can issue a partial or full refund depending on the situation." },
      { question: 'Do you offer instalment payments for larger projects?', answer: 'Yes. For projects over ৳50,000 we typically split payments into milestones: 40% to start, 40% at midpoint review, and 20% on final delivery. This structure protects both parties and keeps the project moving.' },
      { question: 'Are there any hidden fees?', answer: "No hidden fees. The price in your proposal is the price you pay. The only additional costs are ad spend (billed directly to your accounts) and any optional extras like domain registration or third-party software subscriptions — which we'll always disclose upfront." },
    ],
  },
  {
    id: 'creators', label: 'For Creators',
    faqs: [
      { question: 'How do I apply to join the Nimikh marketplace?', answer: 'Fill out the creator application form on our contact page and select "Join as Creator." We\'ll review your portfolio within 5 business days. If approved, you\'ll receive access to your creator dashboard where you can set up your profile, rates, and availability.' },
      { question: 'What percentage does Nimikh take from my earnings?', answer: 'Nimikh charges a 20% platform commission on all marketplace orders. So if a business pays ৳10,000 for a project, you receive ৳8,000. This covers platform operations, client acquisition, payment processing, and escrow management.' },
      { question: 'How and when do I get paid?', answer: "Payments are disbursed via bKash or Nagad within 24 hours of the client approving your delivery. For larger orders (over ৳25,000), we can also transfer to your bank account. You'll receive an earnings summary in your creator dashboard." },
      { question: 'What types of creators do you accept?', answer: 'We accept video editors, short-form content creators, graphic designers, motion graphics artists, photographers, and copywriters. You should have a portfolio demonstrating real, completed work. We review quality, communication, and reliability before approving applications.' },
      { question: 'Can I set my own rates?', answer: 'Yes. You set your own base rates for your services. You can also negotiate project-specific pricing with clients directly through the platform. We only require a minimum of ৳3,000 per order.' },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      {/* FAQPage schema built from the same array the accordions render (NIM-016). */}
      <JsonLd data={graph(faqPage(sections.flatMap((s) => s.faqs), absoluteUrl('/faq')))} />
      <section className="page-hero">
        <div className="blob-container" aria-hidden="true">
          <div className="blob blob-1" style={{ opacity: .06 }} />
        </div>
        <div className="container page-hero-content">
          <div className="section-label fade-in">
            <span className="section-label-line" />
            <span className="section-label-text">FAQ</span>
          </div>
          <h1 className="text-display fade-up d1" style={{ maxWidth: 600 }}>
            Questions? <span className="text-indigo">We&apos;ve got answers.</span>
          </h1>
          <p className="text-body mt-16 fade-up d2" style={{ maxWidth: 440, fontSize: '1.05rem' }}>
            Everything you need to know about working with Nimikh — our services, pricing,
            the marketplace, and how we protect your investment.
          </p>
        </div>
      </section>

      <section className="section" style={{ borderTop: '1px solid var(--border-hairline)' }}>
        <div className="container">
          <div className="faq-layout">
            <aside style={{ position: 'sticky', top: 100 }} className="faq-sidebar fade-in">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {sections.map((s) => (
                  <a key={s.id} href={`#${s.id}`} className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start', padding: '8px 12px' }}>
                    {s.label}
                  </a>
                ))}
              </div>
            </aside>

            <div className="fade-up">
              {sections.map((s, i) => (
                <div key={s.id} id={s.id} style={{ marginBottom: i === sections.length - 1 ? 0 : 'var(--space-48)' }}>
                  <div className="section-label" style={{ marginBottom: 'var(--space-24)' }}>
                    <span className="section-label-line" />
                    <span className="section-label-text">{s.label}</span>
                  </div>
                  <Accordion items={s.faqs} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ borderTop: '1px solid var(--border-hairline)' }}>
        <div className="container">
          <div className="cta-block fade-up" style={{ padding: 'var(--space-48)' }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--space-16)' }} aria-hidden="true">💬</div>
              <h2 className="text-h2 mb-12">Still have questions?</h2>
              <p className="text-body mb-32" style={{ maxWidth: 400, margin: '0 auto var(--space-32)' }}>
                Our team is happy to chat. Send us a message and we&apos;ll respond within a
                few hours.
              </p>
              <Link href="/contact" className="btn btn-primary btn-lg">Contact Us →</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
