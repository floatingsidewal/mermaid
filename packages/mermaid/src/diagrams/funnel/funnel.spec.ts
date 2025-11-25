import { parser } from './funnelParser.js';
import { DEFAULT_FUNNEL_DB, db } from './funnelDb.js';
import { setConfig } from '../../diagram-api/diagramAPI.js';

setConfig({
  securityLevel: 'strict',
});

describe('funnel', () => {
  beforeEach(() => db.clear());

  describe('parse', () => {
    it('should handle very simple funnel', async () => {
      await parser.parse(`funnel
      "Leads": 100
      `);

      const sections = db.getSections();
      expect(sections.get('Leads')?.value).toBe(100);
    });

    it('should handle simple funnel', async () => {
      await parser.parse(`funnel
      "Leads" : 1000
      "Qualified" : 500
      "Proposal" : 200
      `);

      const sections = db.getSections();
      expect(sections.get('Leads')?.value).toBe(1000);
      expect(sections.get('Qualified')?.value).toBe(500);
      expect(sections.get('Proposal')?.value).toBe(200);
    });

    it('should handle funnel with showData', async () => {
      await parser.parse(`funnel showData
      "Stage 1" : 1000
      "Stage 2" : 500
      `);

      expect(db.getShowData()).toBeTruthy();

      const sections = db.getSections();
      expect(sections.get('Stage 1')?.value).toBe(1000);
      expect(sections.get('Stage 2')?.value).toBe(500);
    });

    it('should handle funnel with trueScale', async () => {
      await parser.parse(`funnel trueScale
      "Stage 1" : 1000
      "Stage 2" : 500
      `);

      expect(db.getTrueScale()).toBeTruthy();

      const sections = db.getSections();
      expect(sections.get('Stage 1')?.value).toBe(1000);
      expect(sections.get('Stage 2')?.value).toBe(500);
    });

    it('should handle funnel with showData and trueScale', async () => {
      await parser.parse(`funnel showData trueScale
      "Stage 1" : 1000
      "Stage 2" : 500
      `);

      expect(db.getShowData()).toBeTruthy();
      expect(db.getTrueScale()).toBeTruthy();

      const sections = db.getSections();
      expect(sections.get('Stage 1')?.value).toBe(1000);
      expect(sections.get('Stage 2')?.value).toBe(500);
    });

    it('should handle funnel with comments', async () => {
      await parser.parse(`funnel
      %% This is a comment
      "Awareness" : 1000
      "Interest" : 800
      `);

      const sections = db.getSections();
      expect(sections.get('Awareness')?.value).toBe(1000);
      expect(sections.get('Interest')?.value).toBe(800);
    });

    it('should handle funnel with a title', async () => {
      await parser.parse(`funnel title Sales Pipeline
      "Leads" : 1000
      "Qualified" : 500
      `);

      expect(db.getDiagramTitle()).toBe('Sales Pipeline');

      const sections = db.getSections();
      expect(sections.get('Leads')?.value).toBe(1000);
      expect(sections.get('Qualified')?.value).toBe(500);
    });

    it('should handle funnel with an acc title (accTitle)', async () => {
      await parser.parse(`funnel title Marketing Funnel
      accTitle: Conversion Funnel for Q1 2024
      "Visits" : 10000
      "Signups" : 1000
      `);

      expect(db.getDiagramTitle()).toBe('Marketing Funnel');
      expect(db.getAccTitle()).toBe('Conversion Funnel for Q1 2024');

      const sections = db.getSections();
      expect(sections.get('Visits')?.value).toBe(10000);
      expect(sections.get('Signups')?.value).toBe(1000);
    });

    it('should handle funnel with acc desc (accDescr)', async () => {
      await parser.parse(`funnel title Sales Funnel
      accDescr: This funnel shows the sales conversion rate
      "Leads" : 500
      "Customers" : 100
      `);

      expect(db.getDiagramTitle()).toBe('Sales Funnel');
      expect(db.getAccDescription()).toBe('This funnel shows the sales conversion rate');
    });

    it('should handle funnel with decimal values', async () => {
      await parser.parse(`funnel
      "Stage 1" : 100.5
      "Stage 2" : 50.25
      `);

      const sections = db.getSections();
      expect(sections.get('Stage 1')?.value).toBe(100.5);
      expect(sections.get('Stage 2')?.value).toBe(50.25);
    });

    it('should throw error for negative values', async () => {
      await expect(
        parser.parse(`funnel
        "Stage 1" : -100
        "Stage 2" : 50
        `)
      ).rejects.toThrow(/Negative values are not allowed/);
    });

    it('should handle single stage funnel', async () => {
      await parser.parse(`funnel
      "Only Stage" : 100
      `);

      const sections = db.getSections();
      expect(sections.size).toBe(1);
      expect(sections.get('Only Stage')?.value).toBe(100);
    });

    it('should handle funnel with many stages', async () => {
      await parser.parse(`funnel title Multi-Stage Funnel
      "Stage 1" : 1000
      "Stage 2" : 900
      "Stage 3" : 800
      "Stage 4" : 700
      "Stage 5" : 600
      "Stage 6" : 500
      "Stage 7" : 400
      "Stage 8" : 300
      `);

      const sections = db.getSections();
      expect(sections.size).toBe(8);
      expect(sections.get('Stage 1')?.value).toBe(1000);
      expect(sections.get('Stage 8')?.value).toBe(300);
    });

    it('should handle labels with spaces and special characters', async () => {
      await parser.parse(`funnel
      "Website Visitors (Unique)" : 10000
      "Sign-ups & Registrations" : 1000
      "Active Users" : 500
      `);

      const sections = db.getSections();
      expect(sections.get('Website Visitors (Unique)')?.value).toBe(10000);
      expect(sections.get('Sign-ups & Registrations')?.value).toBe(1000);
      expect(sections.get('Active Users')?.value).toBe(500);
    });

    it('should clear previous data before new parse', async () => {
      await parser.parse(`funnel
      "Stage 1" : 100
      `);

      await parser.parse(`funnel
      "Stage 2" : 200
      `);

      const sections = db.getSections();
      expect(sections.has('Stage 1')).toBeFalsy();
      expect(sections.get('Stage 2')?.value).toBe(200);
    });
  });

  describe('clear', () => {
    it('should clear data', async () => {
      await parser.parse(`funnel showData
      title Test Funnel
      "Stage 1" : 100
      `);

      db.clear();

      const sections = db.getSections();
      expect(sections.size).toBe(0);
      expect(db.getShowData()).toBe(DEFAULT_FUNNEL_DB.showData);
      expect(db.getDiagramTitle()).toBe('');
    });
  });
});
