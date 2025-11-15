import type { DiagramMetadata } from '../types.js';

export default {
  id: 'funnel',
  name: 'Funnel Chart',
  description: 'Visualize progressive reduction through sequential stages',
  examples: [
    {
      title: 'Sales Pipeline',
      isDefault: true,
      code: `funnel title Sales Pipeline
    "Leads" : 1000
    "Qualified" : 500
    "Proposal" : 200
    "Negotiation" : 100
    "Closed" : 50`,
    },
    {
      title: 'Marketing Funnel with Data',
      code: `funnel showData
    title Marketing Funnel
    "Website Visits" : 10000
    "Sign-ups" : 1000
    "Active Users" : 500
    "Paying Customers" : 100`,
    },
    {
      title: 'User Acquisition',
      code: `funnel title User Acquisition Funnel
    "Impressions" : 100000
    "Clicks" : 10000
    "Registrations" : 1000
    "Activations" : 500
    "Retained" : 250`,
    },
    {
      title: 'Funnel with Custom Colors',
      code: `funnel title Marketing Campaign
    "Awareness" : 10000
    [color: "#FF6B6B"]
    "Interest" : 5000
    [color: "#4ECDC4"]
    "Consideration" : 2000
    [color: "#45B7D1"]
    "Conversion" : 500
    [color: "#96CEB4"]`,
    },
    {
      title: 'Funnel with Notes',
      code: `funnel title Customer Journey
    "Awareness" : 5000
    desc "Customer discovers brand"
    desc "Through marketing channels"
    "Interest" : 2000
    desc "Engages with content"
    desc "Requests information"
    "Decision" : 500
    desc "Makes purchase decision"`,
    },
    {
      title: 'Complete Funnel with All Features',
      code: `funnel showData
    title Sales Process
    "Lead Generation" : 1000
    desc "Marketing campaigns"
    desc "Multiple channels"
    [color: "#FF6B6B"]
    [number: "01"]
    "Qualification" : 500
    desc "Sales team review"
    [color: "#4ECDC4"]
    [number: "02"]
    "Proposal" : 200
    desc "Solutions presented"
    [color: "#45B7D1"]
    [number: "03"]
    "Closed" : 100
    desc "Contract signed"
    [color: "#96CEB4"]
    [number: "04"]`,
    },
  ],
} satisfies DiagramMetadata;
