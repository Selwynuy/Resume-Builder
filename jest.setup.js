require('dotenv').config();
require('@testing-library/jest-dom');
const fetch = require('node-fetch');
global.Request = fetch.Request;
global.Response = fetch.Response;

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
  
  return {
    connect: jest.fn(),
    connection: {
      readyState: 1,
      on: jest.fn(),
      once: jest.fn(),
    },
    Schema,
    models: {},
    model: jest.fn(),
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