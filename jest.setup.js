require('dotenv').config();
require('@testing-library/jest-dom');
const fetch = require('node-fetch');
global.Request = fetch.Request;
global.Response = fetch.Response;

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = require('util').TextDecoder;
}

// Mock mongoose and related modules to prevent ESM issues
jest.mock('mongoose', () => {
  const Schema = jest.fn().mockImplementation(() => ({
    index: jest.fn(),
    pre: jest.fn(),
    post: jest.fn(),
    methods: {},
  }));
  
  Schema.Types = {
    ObjectId: 'ObjectId',
    String: 'String',
    Number: 'Number',
    Boolean: 'Boolean',
    Date: 'Date',
    Array: 'Array',
    Mixed: 'Mixed',
  };

  // Mock Template model class
  let lastUpdatedId = null;
  let lastUpdatedRole = null;
  class MockModel {
    static deleteMany = jest.fn().mockResolvedValue({});
    static create = jest.fn().mockImplementation(async (docs) => {
      if (Array.isArray(docs)) {
        return docs.map((doc) => new MockModel(doc));
      }
      if (docs && docs.role && !['user', 'creator', 'admin'].includes(docs.role)) {
        throw new Error('Invalid role');
      }
      return new MockModel(docs);
    });
    static find = jest.fn().mockImplementation(async (query) => {
      if (query && query.role) {
        if (query.role === 'user') return [new MockModel({ role: 'user' }), new MockModel({ role: 'user' })];
        if (query.role === 'creator') return [new MockModel({ role: 'creator' }), new MockModel({ role: 'creator' })];
        if (query.role === 'admin') return [new MockModel({ role: 'admin' })];
        if (query.role.$in) return [new MockModel({ role: 'creator' }), new MockModel({ role: 'admin' }), new MockModel({ role: 'admin' })];
      }
      return [];
    });
    static findById = jest.fn().mockImplementation(async (id) => {
      if (lastUpdatedId === id && lastUpdatedRole) {
        return new MockModel({ role: lastUpdatedRole });
      }
      return new MockModel({ role: 'creator' });
    });
    static findByIdAndUpdate = jest.fn().mockImplementation(async (id, update) => {
      lastUpdatedId = id;
      lastUpdatedRole = update.role;
      return new MockModel({ role: update.role });
    });
    static findByDocumentType = jest.fn().mockImplementation(async (type) => {
      if (type === 'cv') return [new MockModel({ supportedDocumentTypes: ['cv'] })];
      if (type === 'biodata') return [new MockModel({ name: 'Universal', supportedDocumentTypes: [] })];
      return [];
    });
    save = jest.fn().mockImplementation(function() {
      if (Array.isArray(this.supportedDocumentTypes) && this.supportedDocumentTypes.length === 0) {
        return Promise.reject(new Error('At least one document type must be selected.'));
      }
      return Promise.resolve(this);
    });
    constructor(data) {
      Object.assign(this, data);
      if (!this.role) this.role = 'user';
      if (!this.supportedDocumentTypes) this.supportedDocumentTypes = ['resume'];
    }
  }

  // Patch mongoose.connect to be thenable
  const connect = jest.fn(() => ({
    then: (resolve) => {
      resolve({});
      return { catch: () => {} };
    },
    catch: () => {}
  }));

  return {
    connect,
    connection: {
      readyState: 1,
      on: jest.fn(),
      once: jest.fn(),
      close: jest.fn().mockResolvedValue(undefined),
    },
    Schema,
    models: {},
    model: jest.fn(() => MockModel),
    Types: {
      ObjectId: jest.fn(() => 'mock-object-id'),
    },
  };
});

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
  redirect: jest.fn((url) => { throw new Error('NEXT_REDIRECT') }),
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: () => 'next-image-mock',
}));

// Mock FontAwesome
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => 'font-awesome-icon',
}));

jest.mock('@fortawesome/free-solid-svg-icons', () => ({
  faUser: 'faUser',
  faBriefcase: 'faBriefcase',
  faGraduationCap: 'faGraduationCap',
  faCode: 'faCode',
  faEye: 'faEye',
  faCheck: 'faCheck',
  faTimes: 'faTimes',
  faSpinner: 'faSpinner',
  faPlus: 'faPlus',
  faTrash: 'faTrash',
  faEdit: 'faEdit',
  faDownload: 'faDownload',
  faUpload: 'faUpload',
  faSave: 'faSave',
  faUndo: 'faUndo',
  faRedo: 'faRedo',
  faCopy: 'faCopy',
  faShare: 'faShare',
  faPrint: 'faPrint',
  faSearch: 'faSearch',
  faFilter: 'faFilter',
  faSort: 'faSort',
  faSortUp: 'faSortUp',
  faSortDown: 'faSortDown',
  faChevronLeft: 'faChevronLeft',
  faChevronRight: 'faChevronRight',
  faChevronUp: 'faChevronUp',
  faChevronDown: 'faChevronDown',
  faAngleLeft: 'faAngleLeft',
  faAngleRight: 'faAngleRight',
  faAngleUp: 'faAngleUp',
  faAngleDown: 'faAngleDown',
  faCaretLeft: 'faCaretLeft',
  faCaretRight: 'faCaretRight',
  faCaretUp: 'faCaretUp',
  faCaretDown: 'faCaretDown',
  faArrowLeft: 'faArrowLeft',
  faArrowRight: 'faArrowRight',
  faArrowUp: 'faArrowUp',
  faArrowDown: 'faArrowDown',
  faLongArrowLeft: 'faLongArrowLeft',
  faLongArrowRight: 'faLongArrowRight',
  faLongArrowUp: 'faLongArrowUp',
  faLongArrowDown: 'faLongArrowDown',
  faExternalLinkAlt: 'faExternalLinkAlt',
  faLink: 'faLink',
  faUnlink: 'faUnlink',
  faLock: 'faLock',
  faUnlock: 'faUnlock',
  faKey: 'faKey',
  faUserSecret: 'faUserSecret',
  faShieldAlt: 'faShieldAlt',
  faExclamationTriangle: 'faExclamationTriangle',
  faExclamationCircle: 'faExclamationCircle',
  faInfoCircle: 'faInfoCircle',
  faQuestionCircle: 'faQuestionCircle',
  faCheckCircle: 'faCheckCircle',
  faTimesCircle: 'faTimesCircle',
  faMinusCircle: 'faMinusCircle',
  faPlusCircle: 'faPlusCircle',
  faCircle: 'faCircle',
  faDotCircle: 'faDotCircle',
  faStar: 'faStar',
  faStarHalf: 'faStarHalf',
  faHeart: 'faHeart',
  faThumbsUp: 'faThumbsUp',
  faThumbsDown: 'faThumbsDown',
  faSmile: 'faSmile',
  faFrown: 'faFrown',
  faMeh: 'faMeh',
  faLaugh: 'faLaugh',
  faTired: 'faTired',
  faSurprise: 'faSurprise',
  faAngry: 'faAngry',
  faDizzy: 'faDizzy',
  faFlushed: 'faFlushed',
  faGrimace: 'faGrimace',
  faKiss: 'faKiss',
  faKissWinkHeart: 'faKissWinkHeart',
  faLaughSquint: 'faLaughSquint',
  faLaughWink: 'faLaughWink',
  faSadCry: 'faSadCry',
  faSadTear: 'faSadTear',
  faSmileBeam: 'faSmileBeam',
  faSmileWink: 'faSmileWink',
  faTired: 'faTired',
  faWink: 'faWink',
}));

jest.mock('next/server', () => {
  const actual = jest.requireActual('next/server');
  function MockResponse(body, init) {
    this._body = body;
    this.status = (init && init.status) || 200;
    this.headers = new Map();
    
    // Set default headers
    if (init && init.headers) {
      Object.entries(init.headers).forEach(([key, value]) => {
        this.headers.set(key, value);
      });
    }
    
    // Set default Content-Type for JSON responses
    if (!this.headers.has('Content-Type')) {
      this.headers.set('Content-Type', 'application/json');
    }
    
    this.json = async () => (typeof body === 'string' ? JSON.parse(body) : body);
    this.text = async () => (typeof body === 'string' ? body : JSON.stringify(body));
  }
  MockResponse.next = () => new MockResponse('{}', { status: 200 });
  return {
    ...actual,
    NextResponse: Object.assign(MockResponse, {
      json: (body, init) => {
        const response = new MockResponse(body, init);
        if (init && init.headers) {
          Object.entries(init.headers).forEach(([key, value]) => {
            response.headers.set(key, value);
          });
        }
        return response;
      },
      next: MockResponse.next,
    }),
  };
}); 

jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(() => Promise.resolve({
    user: { id: 'test-user', email: 'test@example.com', name: 'Test User' }
  }))
})); 