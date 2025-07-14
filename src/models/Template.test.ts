const connectDB = require('@/lib/db').default;
const mongoose = require('mongoose');

let Template: any;

describe('Template Model - supportedDocumentTypes', () => {
  beforeAll(async () => {
    await connectDB();
    if (mongoose.models.Template) {
      delete mongoose.models.Template;
    }
    Template = require('./Template').default;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Template.deleteMany({});
  });

  it('should require at least one document type', async () => {
    const tpl = new Template({
      name: 'Test',
      description: 'desc',
      category: 'professional',
      price: 0,
      htmlTemplate: '<div></div>',
      placeholders: ['name'],
      layout: 'single-column',
      createdBy: new mongoose.Types.ObjectId(),
      creatorName: 'Tester',
      supportedDocumentTypes: []
    });
    await expect(tpl.save()).rejects.toThrow('At least one document type must be selected.');
  });

  it('should default to ["resume"] if not provided', async () => {
    const tpl = new Template({
      name: 'Test',
      description: 'desc',
      category: 'professional',
      price: 0,
      htmlTemplate: '<div></div>',
      placeholders: ['name'],
      layout: 'single-column',
      createdBy: new mongoose.Types.ObjectId(),
      creatorName: 'Tester'
    });
    await tpl.save();
    expect(tpl.supportedDocumentTypes).toContain('resume');
  });

  it('should filter by document type', async () => {
    await Template.create([
      {
        name: 'Resume Tpl',
        description: 'desc',
        category: 'professional',
        price: 0,
        htmlTemplate: '<div></div>',
        placeholders: ['name'],
        layout: 'single-column',
        createdBy: new mongoose.Types.ObjectId(),
        creatorName: 'Tester',
        supportedDocumentTypes: ['resume']
      },
      {
        name: 'CV Tpl',
        description: 'desc',
        category: 'professional',
        price: 0,
        htmlTemplate: '<div></div>',
        placeholders: ['name'],
        layout: 'single-column',
        createdBy: new mongoose.Types.ObjectId(),
        creatorName: 'Tester',
        supportedDocumentTypes: ['cv']
      }
    ]);
    const results = await Template.findByDocumentType('cv');
    expect(results.length).toBe(1);
    expect(results[0].supportedDocumentTypes).toContain('cv');
  });

  it('should treat templates with no supportedDocumentTypes as universal', async () => {
    await Template.create([
      {
        name: 'Universal',
        description: 'desc',
        category: 'professional',
        price: 0,
        htmlTemplate: '<div></div>',
        placeholders: ['name'],
        layout: 'single-column',
        createdBy: new mongoose.Types.ObjectId(),
        creatorName: 'Tester'
      }
    ]);
    const results = await Template.findByDocumentType('biodata');
    expect(results.length).toBe(1);
    expect(results[0].name).toBe('Universal');
  });
}); 