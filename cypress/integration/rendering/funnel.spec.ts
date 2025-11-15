import { imgSnapshotTest, renderGraph } from '../../helpers/util.ts';

describe('funnel chart', () => {
  it('should render a simple funnel diagram', () => {
    imgSnapshotTest(
      `funnel title Sales Pipeline
        "Leads": 1000
        "Qualified": 500
        "Proposal": 200
        "Negotiation": 100
        "Closed": 50
      `
    );
  });

  it('should render a funnel diagram with showData', () => {
    imgSnapshotTest(
      `funnel showData
      title Marketing Funnel
        "Website Visits": 10000
        "Sign-ups": 1000
        "Active Users": 500
        "Paying Customers": 100
      `
    );
  });

  it('should render a simple funnel with long labels', () => {
    imgSnapshotTest(
      `funnel title Customer Journey
        "Awareness and Initial Contact": 5000
        "Interest and Engagement": 2000
        "Consideration and Evaluation": 800
        "Decision and Purchase": 200
      `
    );
  });

  it('should render a funnel with capital letters for labels', () => {
    imgSnapshotTest(
      `funnel title CONVERSION FUNNEL
        "IMPRESSIONS": 100000
        "CLICKS": 10000
        "LEADS": 1000
        "CUSTOMERS": 100
      `
    );
  });

  it('should render a funnel when useMaxWidth is true (default)', () => {
    renderGraph(
      `funnel title Sales Funnel
        "Leads": 1000
        "Qualified": 500
        "Customers": 100
      `,
      { funnel: { useMaxWidth: true } }
    );
    cy.get('svg').should((svg) => {
      expect(svg).to.have.attr('width', '100%');
      const style = svg.attr('style');
      expect(style).to.match(/^max-width: [\d.]+px;$/);
      const maxWidthValue = parseFloat(style.match(/[\d.]+/g).join(''));
      // Funnel width + margins + legend
      expect(maxWidthValue).to.be.within(650, 750);
    });
  });

  it('should render a funnel when useMaxWidth is false', () => {
    renderGraph(
      `funnel title Sales Funnel
        "Leads": 1000
        "Qualified": 500
        "Customers": 100
      `,
      { funnel: { useMaxWidth: false } }
    );
    cy.get('svg').should((svg) => {
      const width = parseFloat(svg.attr('width'));
      expect(width).to.be.within(650, 750);
      expect(svg).to.not.have.attr('style');
    });
  });

  it('should render a funnel with a single stage', () => {
    imgSnapshotTest(
      `funnel title Single Stage
        "Only Stage": 100
      `
    );
  });

  it('should render a funnel with many stages', () => {
    imgSnapshotTest(
      `funnel title Multi-Stage Process
        "Stage 1": 1000
        "Stage 2": 900
        "Stage 3": 800
        "Stage 4": 700
        "Stage 5": 600
        "Stage 6": 500
        "Stage 7": 400
        "Stage 8": 300
        "Stage 9": 200
        "Stage 10": 100
      `
    );
  });

  it('should render a funnel with decimal values', () => {
    imgSnapshotTest(
      `funnel title Conversion Rates
        "Views": 1000.5
        "Clicks": 500.25
        "Conversions": 100.75
      `
    );
  });

  it('should render a funnel with accessibility title and description', () => {
    imgSnapshotTest(
      `funnel title Sales Funnel
      accTitle: Q1 2024 Sales Performance
      accDescr: This funnel shows the sales conversion rates for Q1
        "Leads": 5000
        "Qualified": 2000
        "Proposals": 500
        "Closed": 100
      `
    );
  });

  it('should handle a funnel with zero values gracefully', () => {
    imgSnapshotTest(
      `funnel title Edge Case Funnel
        "Stage 1": 1000
        "Stage 2": 0
        "Stage 3": 500
      `
    );
  });

  it('should render a funnel with special characters in labels', () => {
    imgSnapshotTest(
      `funnel title User Engagement
        "Users (Active)": 5000
        "Sign-ups & Registrations": 2000
        "Premium Subscribers": 500
      `
    );
  });
});
