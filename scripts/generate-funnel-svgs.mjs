#!/usr/bin/env node
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const funnelDiagrams = [
  {
    name: '01-basic-funnel',
    title: '01 - Basic Funnel (Simple 4-stage)',
    diagram: `funnel title Sales Pipeline
    "Leads" : 1000
    "Qualified" : 500
    "Proposal" : 200
    "Closed" : 50`
  },
  {
    name: '02-funnel-with-data',
    title: '02 - Funnel with Data Values Displayed',
    diagram: `funnel showData
    title User Acquisition Funnel
    "Impressions" : 100000
    "Clicks" : 10000
    "Registrations" : 1000
    "Activations" : 500
    "Retained" : 250`
  },
  {
    name: '03-ecommerce-funnel',
    title: '03 - E-commerce Conversion Funnel',
    diagram: `funnel showData
    title E-commerce Conversion
    "Product Views" : 50000
    "Add to Cart" : 5000
    "Checkout Started" : 2000
    "Payment Completed" : 1500`
  },
  {
    name: '04-custom-colors',
    title: '04 - Funnel with Custom Colors',
    diagram: `funnel title Marketing Campaign
    "Awareness" : 10000
    [color: "#FF6B6B"]
    "Interest" : 5000
    [color: "#4ECDC4"]
    "Consideration" : 2000
    [color: "#45B7D1"]
    "Conversion" : 500
    [color: "#96CEB4"]`
  },
  {
    name: '05-stage-notes',
    title: '05 - Funnel with Stage Notes',
    diagram: `funnel title Customer Journey
    "Awareness" : 5000
    desc "Customer discovers the brand"
    desc "Through marketing channels"
    "Interest" : 2000
    desc "Customer shows interest"
    desc "Engages with content"
    "Decision" : 500
    desc "Customer makes purchase"`
  },
  {
    name: '06-custom-numbers',
    title: '06 - Funnel with Custom Stage Numbers',
    diagram: `funnel title Product Development
    "Planning" : 100
    [number: "A1"]
    "Design" : 80
    [number: "B2"]
    "Development" : 60
    [number: "C3"]
    "Testing" : 40
    [number: "D4"]
    "Launch" : 20
    [number: "E5"]`
  },
  {
    name: '07-complete-features',
    title: '07 - Complete Funnel with All Features',
    diagram: `funnel showData
    title Complete Sales Funnel
    "Lead Generation" : 1000
    desc "Marketing campaigns drive traffic"
    desc "Multiple channels: SEO, Ads, Social"
    [color: "#FF6B6B"]
    [number: "01"]
    "Lead Qualification" : 500
    desc "Sales team reviews leads"
    [color: "#4ECDC4"]
    [number: "02"]
    "Proposal" : 200
    desc "Custom solutions presented"
    [color: "#45B7D1"]
    [number: "03"]
    "Closed Won" : 100
    desc "Contract signed"
    [color: "#96CEB4"]
    [number: "04"]`
  },
  {
    name: '08-recruitment-funnel',
    title: '08 - Recruitment Hiring Funnel',
    diagram: `funnel title Hiring Process
    "Applications" : 500
    "Phone Screens" : 100
    "Technical Interviews" : 50
    "On-site Interviews" : 25
    "Offers" : 10
    "Acceptances" : 8`
  },
  {
    name: '09-multi-stage-funnel',
    title: '09 - Large Multi-Stage Funnel (8 stages)',
    diagram: `funnel showData
    title Multi-Stage Process
    "Stage 1" : 10000
    "Stage 2" : 8500
    "Stage 3" : 7000
    "Stage 4" : 5500
    "Stage 5" : 4000
    "Stage 6" : 2800
    "Stage 7" : 1500
    "Stage 8" : 800`
  },
  {
    name: '10-marketing-campaign',
    title: '10 - Marketing Campaign Funnel',
    diagram: `funnel title Marketing ROI
    "Impressions" : 500000
    "Clicks" : 25000
    "Landing Page Views" : 20000
    "Form Submissions" : 5000
    "Qualified Leads" : 1200
    "Sales Opportunities" : 400
    "Closed Deals" : 100`
  },
  {
    name: '11-simple-conversion',
    title: '11 - Simple 3-Stage Conversion',
    diagram: `funnel showData
    title Simple Conversion
    "Visitors" : 1000
    "Sign-ups" : 300
    "Purchases" : 75`
  },
  {
    name: '12-saas-subscription',
    title: '12 - SaaS Subscription Funnel',
    diagram: `funnel showData
    title SaaS Subscription Journey
    "Free Trial Start" : 5000
    [color: "#3498db"]
    "Product Adoption" : 3000
    [color: "#2ecc71"]
    "Paid Conversion" : 1000
    [color: "#f39c12"]
    "Annual Upgrade" : 300
    [color: "#e74c3c"]`
  },
  {
    name: '13-content-marketing',
    title: '13 - Content Marketing Funnel',
    diagram: `funnel title Content Engagement
    "Blog Readers" : 50000
    desc "Organic and paid traffic"
    "Newsletter Subscribers" : 10000
    desc "Email opt-ins"
    "Download Lead Magnet" : 3000
    desc "Premium content access"
    "Product Interest" : 500
    desc "Demo requests"
    "Customers" : 150
    desc "Paying customers"`
  },
  {
    name: '14-webinar-funnel',
    title: '14 - Webinar Registration Funnel',
    diagram: `funnel showData
    title Webinar Conversion
    "Landing Page Visits" : 15000
    [number: "①"]
    "Registrations" : 3000
    [number: "②"]
    "Attended Live" : 1200
    [number: "③"]
    "Watched Replay" : 800
    [number: "④"]
    "Follow-up Action" : 400
    [number: "⑤"]`
  },
  {
    name: '15-app-onboarding',
    title: '15 - App Onboarding Funnel',
    diagram: `funnel title Mobile App Onboarding
    "App Downloads" : 100000
    [color: "#9b59b6"]
    [number: "Step 1"]
    "Account Created" : 75000
    [color: "#3498db"]
    [number: "Step 2"]
    "Profile Completed" : 50000
    [color: "#1abc9c"]
    [number: "Step 3"]
    "First Action" : 30000
    [color: "#f39c12"]
    [number: "Step 4"]
    "Active User (30 days)" : 15000
    [color: "#27ae60"]
    [number: "Step 5"]`
  }
];

// Create output directory
const outputDir = join(__dirname, 'funnel-outputs');
mkdirSync(outputDir, { recursive: true });

console.log('Generating funnel diagram files...\n');

// Generate .mmd files for each diagram
for (const item of funnelDiagrams) {
  const mmdPath = join(outputDir, `${item.name}.mmd`);
  writeFileSync(mmdPath, item.diagram);
  console.log(`✓ Created ${item.name}.mmd`);
}

console.log('\n✓ All .mmd files created in scripts/funnel-outputs/');
console.log('\nTo generate PNG/SVG files, use mermaid-cli:');
console.log('  npx mmdc -i scripts/funnel-outputs/01-basic-funnel.mmd -o output.png');
