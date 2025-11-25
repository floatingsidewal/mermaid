import { parser } from './funnelFlowParser.js';
import { DEFAULT_FUNNEL_FLOW_DB, db } from './funnelFlowDb.js';
import { setConfig } from '../../diagram-api/diagramAPI.js';

setConfig({
  securityLevel: 'strict',
});

describe('funnelFlow', () => {
  beforeEach(() => db.clear());

  describe('parse', () => {
    it('should handle simple arrow chain', async () => {
      await parser.parse(`funnelFlow
        stage1[100] --> stage2[50] --> stage3[25]
      `);

      const stages = db.getStages();
      expect(stages.get('stage1')?.value).toBe(100);
      expect(stages.get('stage2')?.value).toBe(50);
      expect(stages.get('stage3')?.value).toBe(25);
    });

    it('should use id as label when no label provided', async () => {
      await parser.parse(`funnelFlow
        leads[1000] --> qualified[500]
      `);

      const stages = db.getStages();
      expect(stages.get('leads')?.label).toBeUndefined();
      expect(stages.get('leads')?.value).toBe(1000);
      expect(stages.get('qualified')?.label).toBeUndefined();
      expect(stages.get('qualified')?.value).toBe(500);
    });

    it('should handle stages with custom labels', async () => {
      await parser.parse(`funnelFlow
        visitors["Website Visitors": 1000] --> signups["Sign Ups": 400] --> customers["Paying Customers": 100]
      `);

      const stages = db.getStages();
      expect(stages.get('visitors')?.label).toBe('Website Visitors');
      expect(stages.get('visitors')?.value).toBe(1000);
      expect(stages.get('signups')?.label).toBe('Sign Ups');
      expect(stages.get('signups')?.value).toBe(400);
      expect(stages.get('customers')?.label).toBe('Paying Customers');
      expect(stages.get('customers')?.value).toBe(100);
    });

    it('should handle mixed labeled and unlabeled stages', async () => {
      await parser.parse(`funnelFlow
        stage1["First Stage": 100] --> stage2[75] --> stage3["Third Stage": 50]
      `);

      const stages = db.getStages();
      expect(stages.get('stage1')?.label).toBe('First Stage');
      expect(stages.get('stage2')?.label).toBeUndefined();
      expect(stages.get('stage3')?.label).toBe('Third Stage');
    });

    it('should handle showData flag', async () => {
      await parser.parse(`funnelFlow showData
        stage1[100] --> stage2[50]
      `);

      expect(db.getShowData()).toBeTruthy();
    });

    it('should handle trueScale flag', async () => {
      await parser.parse(`funnelFlow trueScale
        stage1[100] --> stage2[50]
      `);

      expect(db.getTrueScale()).toBeTruthy();
    });

    it('should handle both showData and trueScale flags', async () => {
      await parser.parse(`funnelFlow showData trueScale
        stage1[100] --> stage2[50]
      `);

      expect(db.getShowData()).toBeTruthy();
      expect(db.getTrueScale()).toBeTruthy();
    });

    it('should handle note declarations', async () => {
      await parser.parse(`funnelFlow
        stage1[100] --> stage2[50] --> stage3[25]

        note stage1 "Description for first stage"
        note stage2 "Description for second stage"
      `);

      const stages = db.getStages();
      expect(stages.get('stage1')?.description).toEqual(['Description for first stage']);
      expect(stages.get('stage2')?.description).toEqual(['Description for second stage']);
      expect(stages.get('stage3')?.description).toBeUndefined();
    });

    it('should handle multiple notes for same stage', async () => {
      await parser.parse(`funnelFlow
        stage1[100] --> stage2[50]

        note stage1 "First note"
        note stage1 "Second note"
      `);

      const stages = db.getStages();
      expect(stages.get('stage1')?.description).toEqual(['First note', 'Second note']);
    });

    it('should handle style declarations with color', async () => {
      await parser.parse(`funnelFlow
        stage1[100] --> stage2[50]

        style stage1 color: "#ff6b6b"
      `);

      const stages = db.getStages();
      expect(stages.get('stage1')?.color).toBe('#ff6b6b');
    });

    it('should handle style declarations with custom number', async () => {
      await parser.parse(`funnelFlow
        stage1[100] --> stage2[50]

        style stage1 number: "A"
        style stage2 number: "B"
      `);

      const stages = db.getStages();
      expect(stages.get('stage1')?.customNumber).toBe('A');
      expect(stages.get('stage2')?.customNumber).toBe('B');
    });

    it('should handle style declarations with multiple properties', async () => {
      await parser.parse(`funnelFlow
        stage1[100] --> stage2[50]

        style stage1 color: "#4CAF50", number: "$$"
      `);

      const stages = db.getStages();
      expect(stages.get('stage1')?.color).toBe('#4CAF50');
      expect(stages.get('stage1')?.customNumber).toBe('$$');
    });

    it('should handle title', async () => {
      await parser.parse(`funnelFlow title Sales Funnel
        stage1[100] --> stage2[50]
      `);

      expect(db.getDiagramTitle()).toBe('Sales Funnel');
    });

    it('should handle accTitle', async () => {
      await parser.parse(`funnelFlow
        accTitle: Conversion Funnel for Q1 2024
        stage1[100] --> stage2[50]
      `);

      expect(db.getAccTitle()).toBe('Conversion Funnel for Q1 2024');
    });

    it('should handle decimal values', async () => {
      await parser.parse(`funnelFlow
        stage1[100.5] --> stage2[50.25]
      `);

      const stages = db.getStages();
      expect(stages.get('stage1')?.value).toBe(100.5);
      expect(stages.get('stage2')?.value).toBe(50.25);
    });

    it('should throw error for negative values', async () => {
      await expect(
        parser.parse(`funnelFlow
          stage1[-100] --> stage2[50]
        `)
      ).rejects.toThrow();
    });

    it('should preserve stage order from arrow chain', async () => {
      await parser.parse(`funnelFlow
        a[100] --> b[80] --> c[60] --> d[40] --> e[20]
      `);

      const stages = db.getStages();
      const stageIds = [...stages.keys()];
      expect(stageIds).toEqual(['a', 'b', 'c', 'd', 'e']);
    });

    it('should handle comments', async () => {
      await parser.parse(`funnelFlow
        %% This is a comment
        stage1[100] --> stage2[50]
      `);

      const stages = db.getStages();
      expect(stages.get('stage1')?.value).toBe(100);
      expect(stages.get('stage2')?.value).toBe(50);
    });

    it('should clear previous data before new parse', async () => {
      await parser.parse(`funnelFlow
        stage1[100]
      `);

      await parser.parse(`funnelFlow
        stage2[200]
      `);

      const stages = db.getStages();
      expect(stages.has('stage1')).toBeFalsy();
      expect(stages.get('stage2')?.value).toBe(200);
    });

    it('should handle full example with all features', async () => {
      await parser.parse(`funnelFlow showData trueScale title Sales Pipeline
        visitors["Website Visitors": 1000] --> signups["Sign Ups": 400] --> trials[200] --> paid["Paying Customers": 50]

        note visitors "From Google Ads campaign"
        note paid "Q4 2024 conversions"

        style visitors color: "#4CAF50"
        style paid color: "#2196F3", number: "$$"
      `);

      expect(db.getDiagramTitle()).toBe('Sales Pipeline');
      expect(db.getShowData()).toBeTruthy();
      expect(db.getTrueScale()).toBeTruthy();

      const stages = db.getStages();
      expect(stages.size).toBe(4);

      expect(stages.get('visitors')?.label).toBe('Website Visitors');
      expect(stages.get('visitors')?.value).toBe(1000);
      expect(stages.get('visitors')?.description).toEqual(['From Google Ads campaign']);
      expect(stages.get('visitors')?.color).toBe('#4CAF50');

      expect(stages.get('signups')?.label).toBe('Sign Ups');
      expect(stages.get('signups')?.value).toBe(400);

      expect(stages.get('trials')?.label).toBeUndefined();
      expect(stages.get('trials')?.value).toBe(200);

      expect(stages.get('paid')?.label).toBe('Paying Customers');
      expect(stages.get('paid')?.value).toBe(50);
      expect(stages.get('paid')?.description).toEqual(['Q4 2024 conversions']);
      expect(stages.get('paid')?.color).toBe('#2196F3');
      expect(stages.get('paid')?.customNumber).toBe('$$');
    });
  });

  describe('clear', () => {
    it('should clear data', async () => {
      await parser.parse(`funnelFlow showData
        title Test Funnel
        stage1[100]
      `);

      db.clear();

      const stages = db.getStages();
      expect(stages.size).toBe(0);
      expect(db.getShowData()).toBe(DEFAULT_FUNNEL_FLOW_DB.showData);
      expect(db.getDiagramTitle()).toBe('');
    });
  });
});
