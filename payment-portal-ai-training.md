# AI TRAINING GUIDE - VERIZON PAYMENT PORTAL PROJECT

## 1. PROJECT OVERVIEW & CONTEXT

### Project Identity
- **Name**: onevz-soe-digital-ngd-paymentportal
- **Type**: Enterprise Payment Portal for Verizon Digital
- **Purpose**: Handle payment processing, Terms & Conditions acceptance, and Largo flow for wireless/FWA orders
- **Scale**: 10,000+ daily transactions
- **Team Structure**: Led by Tech Lead, Primary UI Developer (user), Backend Team, QA Team

### Business Flows
1. **Payment Flow**: Process payments for new wireless/FWA device orders
2. **Terms & Conditions (T&C) Flow**: Legal agreement acceptance before payment
3. **Largo Flow**: Streamlined checkout experience

## 2. TECHNOLOGY STACK & ARCHITECTURE

### Frontend Stack
- **Framework**: Next.js 15 (App Router architecture)
- **UI Library**: React 18 (with Hooks, Server Components)
- **Language**: TypeScript 5.x (strict mode)
- **Styling**: Tailwind CSS 3.x, SCSS, CSS Modules
- **Design System**: Verizon Design System (VDS) 4.x
- **State Management**: 
  - TanStack Query v5 (React Query) - Server state
  - React Hooks (useState, useContext) - UI state
  - Session Storage - Persistent client state

### Backend Integration
- **API Pattern**: RESTful APIs
- **Authentication**: Token-based (digital_ig_session cookie)
- **Data Format**: JSON
- **Key APIs**:
  - `/paymentservice/braintree/nse/getClientToken` - Get Braintree auth token
  - `/paymentservice/braintree/nse/getCheckout` - Process payment
  - `/paymentportalservice/nse/submitPayment` - Final confirmation
  - `/paymentservice/nse/retrievePaymentOptions` - Get payment options & feature flags
  - `/paymentportalservice/nse/3dSecureLookUp` - 3D Secure authentication

### Payment Gateways
- **Braintree Web SDK v3.129**: Credit/debit card processing
- **PayPal Express Checkout**: PayPal payment integration
- **Cardinal Commerce 3D Secure**: Additional authentication for cards

### Testing & Quality
- **Unit Testing**: Jest + React Testing Library
- **Code Coverage**: 90%+ (200+ tests)
- **Code Quality**: SonarQube (Quality Gate: 90%+)
- **Linting**: ESLint, Prettier, StyleLint
- **Accessibility**: Axe Core, WCAG 2.1 AA compliance
- **Performance**: Lighthouse (Score: 85+)

### DevOps & CI/CD
- **Version Control**: Git
- **CI/CD**: Jenkins
- **Containerization**: Docker
- **Package Manager**: npm
- **Pre-commit Hooks**: Husky (lint, format, commit message validation)

## 3. PROJECT STRUCTURE & FILE ORGANIZATION

### Directory Structure
```
onevz-soe-digital-ngd-paymentportal/
├── app/                          # Next.js 15 App Router
│   ├── (vz-layout)/             # Layout with Verizon header/footer
│   ├── (no-layout)/             # Standalone pages
│   └── api/                     # API routes
├── components/                   # React components
│   ├── atoms/                   # Smallest UI components
│   ├── Common/                  # Shared components
│   │   └── ThreeDSecureIntegration/  # 3D Secure logic
│   ├── PaymentPortal/           # Payment flow components
│   │   └── orderReview/
│   │       └── components/
│   │           ├── BraintreeModule/      # Braintree integration
│   │           │   ├── BraintreeButton.tsx
│   │           │   └── api.ts
│   │           └── PaypalModule/         # PayPal integration
│   └── TandC/                   # Terms & Conditions flow
│       └── orderReview/
│           └── components/
│               └── TnCOrderReviewColumn/
│                   ├── AddressColumn/
│                   ├── ContactInformationColumn/
│                   └── PaymentInformationColumn/
├── constants/                    # Application constants
│   ├── apiEndpoints.ts          # API endpoint URLs
│   └── index.ts                 # General constants
├── types/                        # TypeScript type definitions
│   ├── featureFlags.type.ts     # Feature flag types
│   └── tnc/                     # T&C related types
├── helpers/                      # Utility functions
├── utils/                        # Helper utilities
├── mock-server/                  # Local development mock server
├── playwright-tests/             # E2E tests
└── coverage/                     # Test coverage reports
```

### Component Architecture (Atomic Design)
- **Atoms**: Basic VDS components (Body, Button, Input)
- **Molecules**: Simple combinations (PaymentInformationColumn, AddressColumn)
- **Organisms**: Complex features (OrderReview, BraintreeButton)
- **Templates**: Page layouts
- **Pages**: Full pages in app/ directory

## 4. KEY FEATURES & IMPLEMENTATION DETAILS

### Feature 1: Braintree/PayPal Payment Integration

#### Flow Diagram
```
User clicks PayPal 
  → Frontend: getBraintreeClientToken() API call
  → Backend: Returns clientToken
  → Frontend: Load Braintree SDK scripts dynamically
  → Frontend: Initialize Braintree client with token
  → Frontend: Create PayPal checkout instance
  → Frontend: Render PayPal button
  → User: Click PayPal button → PayPal popup opens
  → User: Login & approve in PayPal
  → PayPal: Returns nonce + email to frontend
  → Frontend: processBraintreePayment(nonce, email) API call
  → Backend: Process payment, return SUCCESS
  → Frontend: submitFormInfo() final confirmation
  → Frontend: Redirect to /payment/orderConfirmation
```

#### Key Files
- `components/PaymentPortal/orderReview/components/BraintreeModule/BraintreeButton.tsx`
  - Main component orchestrating payment flow
  - Manages SDK loading, button rendering, payment processing
  
- `components/PaymentPortal/orderReview/components/BraintreeModule/api.ts`
  - getBraintreeClientToken(): Get authentication token
  - processBraintreePayment(nonce, email): Process payment

- `components/Common/ThreeDSecureIntegration/api.js`
  - submitFormInfo(): Final payment submission
  - process3DSecurePayment(): 3D Secure authentication

#### Technical Implementation
```typescript
// Step 1: Get Client Token
const response = await getBraintreeClientToken();
const clientToken = response.data.clientToken;

// Step 2: Load Scripts Dynamically
const loadScript = (src: string) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

await loadScript('https://js.braintreegateway.com/web/3.100.0/js/client.min.js');
await loadScript('https://js.braintreegateway.com/web/3.100.0/js/paypal-checkout.min.js');

// Step 3: Initialize Braintree
const clientInstance = await braintree.client.create({
  authorization: clientToken
});

const paypalCheckoutInstance = await braintree.paypalCheckout.create({
  client: clientInstance
});

// Step 4: Handle Payment
paypalCheckoutInstance.tokenize({
  flow: 'checkout',
  amount: totalAmount,
  currency: 'USD'
}, async (err, payload) => {
  if (err) {
    // Handle error
    return;
  }
  
  // Process payment with nonce
  const result = await processBraintreePayment(payload.nonce, payload.details.email);
  
  if (result.status === 'SUCCESS') {
    // Submit final payment
    await submitFormInfo({
      orderId: orderNumber,
      paymentOptionType: 'paypal'
    });
  }
});
```

### Feature 2: Feature Flags System

#### Purpose
Enable/disable features at runtime without redeployment

#### Implementation Flow

**1. Backend Response:** `/paymentservice/nse/retrievePaymentOptions` returns:
```json
{
  "featureFlags": {
    "sales": {
      "enableBraintreeFFlag": true,
      "vvcDeviceFinancingOfferPDPFFlag": true,
      "browserDataFFlag": true
    }
  }
}
```

**2. Frontend Storage:** Save to session storage
```typescript
const retrievePaymentOption = await getRetrievePaymentOption(reqData);
sessionStorage.setItem('retrievePaymentOption', JSON.stringify(retrievePaymentOption));
```

**3. Frontend Usage:** Read and conditionally render
```typescript
const retrievePaymentOption = JSON.parse(
  sessionStorage.getItem('retrievePaymentOption') ?? '{}'
);

const braintreeFFlag = retrievePaymentOption?.featureFlags?.sales?.enableBraintreeFFlag;

if (payPalTrue && braintreeFFlag) {
  loadBraintreeClientToken(); // Only load if flag is enabled
}
```

#### Type Safety
```typescript
// types/featureFlags.type.ts
export type IFeatureFlagProps = {
  actPctOwner?: string;
  enabled?: boolean;
};

export type featureFlagType = {
  [key: string]: {
    enabled: boolean;
  };
};
```

### Feature 3: PII Protection (notranslate Implementation)

#### Problem
Browser translation features (Google Translate, etc.) were translating sensitive customer data:
- Payment amounts
- Credit card numbers
- Addresses
- Personal information

#### Solution
Add `notranslate` class to prevent translation

#### Implementation
```typescript
// Before
<div className="col-sm-6 noLeftPad tnc-column-wrapper">
  <Body size="large" bold primitive="h3">{heading}</Body>
  {paymentDetails?.map((payment, i) => (
    <div key={id || i}>
      <Body size="medium" primitive="p">{modeOfPay}</Body>
      <Body size="medium" primitive="p">{paymentAmount}</Body>
    </div>
  ))}
</div>

// After
<div className="col-sm-6 noLeftPad tnc-column-wrapper">
  <Body size="large" bold primitive="h3">{heading}</Body>
  <div className="notranslate">  {/* ← Protection wrapper */}
    {paymentDetails?.map((payment, i) => (
      <div key={id || i}>
        <Body size="medium" primitive="p">{modeOfPay}</Body>
        <Body size="medium" primitive="p">{paymentAmount}</Body>
      </div>
    ))}
  </div>
</div>
```

#### Protected Components
- AddressColumn.tsx - Shipping/service addresses
- ContactInformationColumn.tsx - Email, phone numbers
- PaymentInformationColumn.tsx - Payment methods, amounts

### Feature 4: 3D Secure Authentication

#### Purpose
Additional security layer for credit/debit card transactions (PCI DSS compliance)

#### Flow
1. User enters card details
2. Frontend calls `/paymentportalservice/nse/3dSecureLookUp`
3. Backend returns Cardinal Commerce 3D Secure payload
4. Frontend renders 3D Secure iframe for user authentication
5. User completes authentication (fingerprint/SMS/password)
6. Payment proceeds if authentication successful

#### Implementation
```typescript
const process3DSecurePayment = async (requestBody) => {
  const { uri, headers } = await getBaseUrl(PROCESS_THREED_SECURE);
  
  return await customFetch(uri, 'POST', {
    body: requestBody,
    headers: {
      ...headers,
    },
  });
};
```

### Feature 5: Session Storage Management

#### Purpose
Persist data across page navigations without backend calls

#### Implementation
```typescript
// helpers/sessionStorageHelper.ts
export const saveToSession = (key: string, value: any) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(key, JSON.stringify(value));
  }
};

export const getFromSession = (key: string) => {
  if (typeof window !== 'undefined') {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
  return null;
};
```

#### Stored Data
- `retrievePaymentOption` - Payment options & feature flags
- `paymentOrderConfirmationdata` - Order confirmation details
- `transactionType` - Type of transaction (payment/tnc/largo)
- `agreementsData` - Terms & conditions agreements

## 5. COMPONENT DEEP DIVE

### PaymentInformationColumn Component

#### Purpose
Display payment information in T&C order review page

#### File Location
`components/TandC/orderReview/components/TnCOrderReviewColumn/PaymentInformationColumn/PaymentInformationColumn.tsx`

#### Props Interface
```typescript
interface PaymentDetail {
  modeOfPay?: string;        // Payment method (e.g., "Credit Card", "PayPal")
  paymentAmount?: number;    // Payment amount in USD
  documentNum?: string;      // Document/order number
  id?: string | number;      // Unique identifier
}

interface PaymentInformationColumnProps {
  heading: string;           // Column heading
  paymentDetails: PaymentDetail[];  // Array of payment details
}
```

#### Implementation Details
```typescript
const PaymentInformationColumn: React.FC<PaymentInformationColumnProps> = ({
  heading,
  paymentDetails,
}) => (
  <div className="col-sm-6 noLeftPad tnc-column-wrapper">
    {/* Heading */}
    <Body size="large" bold primitive="h3">
      {heading}
    </Body>
    
    {/* Protected content wrapper - prevents browser translation */}
    <div className="notranslate">
      {paymentDetails?.length > 0 &&
        paymentDetails?.map((payment, i) => {
          const { modeOfPay, paymentAmount, documentNum, id } = payment;
          
          return (
            <div key={id || i} className="flex mr-3 mt-2">
              {/* Payment method and amount */}
              {paymentAmount && (
                <div className="leading-6 mr-[1rem]">
                  <Body size="medium" primitive="p">
                    {`${modeOfPay || ''}`}
                  </Body>
                  <Body size="medium" primitive="p">
                    {/* Currency formatting using Intl API */}
                    {`${new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(paymentAmount)}`}
                  </Body>
                </div>
              )}
              
              {/* Document number */}
              {documentNum && (
                <div className="leading-6">
                  <Body size="medium" primitive="p">
                    {documentNum}
                  </Body>
                </div>
              )}
            </div>
          );
        })}
    </div>
  </div>
);
```

#### Key Features
- **VDS Integration**: Uses Body component from @vds/core
- **Type Safety**: Full TypeScript typing with interfaces
- **Conditional Rendering**: Only shows data if available
- **Currency Formatting**: Uses Intl.NumberFormat for proper USD formatting
- **PII Protection**: notranslate class prevents browser translation
- **Responsive Design**: Tailwind classes for layout
- **Accessibility**: Semantic HTML with proper heading hierarchy

#### Usage Example
```typescript
<PaymentInformationColumn
  heading="Payment Information"
  paymentDetails={[
    {
      id: '1',
      modeOfPay: 'PayPal',
      paymentAmount: 199.99,
      documentNum: 'ORD123456'
    },
    {
      id: '2',
      modeOfPay: 'Credit Card',
      paymentAmount: 49.99,
      documentNum: 'ORD123457'
    }
  ]}
/>
```

#### Related Components
- **AddressColumn.tsx** - Similar pattern for addresses
- **ContactInformationColumn.tsx** - Similar pattern for contact info
- All use same security and styling patterns

## 6. API INTEGRATION PATTERNS

### Custom Fetch Wrapper
```typescript
import { customFetch } from '@vz-nextgen/common';
import { getBaseUrl } from '@vz-nextgen/digital-common';

const callAPI = async (endpoint: string, payload: any) => {
  const { uri, headers } = await getBaseUrl(endpoint);
  
  return await customFetch(uri, 'POST', {
    body: payload,
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
  });
};
```

### Error Handling Pattern
```typescript
try {
  showLoader();  // Global loading indicator
  
  const response = await callAPI(endpoint, payload);
  
  if (response.status?.success) {
    // Success handling
    return response.data;
  } else {
    // Error handling
    const errorMessage = response.status?.errors?.[0]?.message ?? 'Request failed';
    throw new Error(errorMessage);
  }
} catch (error) {
  console.error('API Error:', error);
  // Show user-friendly error
  setErrorMessage('Something went wrong. Please try again.');
} finally {
  hideLoader();  // Always hide loader
}
```

### Retry Logic
```typescript
const fetchWithRetry = async (url: string, options: any, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
    }
  }
};
```

### API Endpoints Reference

#### Braintree APIs
```typescript
// constants/apiEndpoints.ts
export const GET_BRAINTREE_CLIENT_TOKEN = '/paymentservice/braintree/nse/getClientToken';
export const BRAINTREE_CHECKOUT = '/paymentservice/braintree/nse/getCheckout';

// Usage
import { GET_BRAINTREE_CLIENT_TOKEN, BRAINTREE_CHECKOUT } from '@/constants/apiEndpoints';

// Get client token
const getBraintreeClientToken = async () => {
  const { uri, headers } = await getBaseUrl(GET_BRAINTREE_CLIENT_TOKEN);
  
  return await customFetch(uri, 'POST', {
    body: {
      data: {
        triggerFrom: 'redirecttonextgenpayment_nse',
        paymentType: 'braintreeAuthentication',
        cartId: getCookie('digital_ig_session')
      }
    },
    headers
  });
};

// Process payment
const processBraintreePayment = async (nonce: string, email: string) => {
  const { uri, headers } = await getBaseUrl(BRAINTREE_CHECKOUT);
  
  return await customFetch(uri, 'POST', {
    body: {
      data: {
        triggerFrom: 'redirecttonextgenpayment_nse',
        paymentType: 'braintreeCheckout',
        braintreeNonce: nonce,
        braintreeEmail: email,
        cartId: getCookie('digital_ig_session')
      }
    },
    headers
  });
};
```

#### Payment Submission
```typescript
export const CARD_SUBMIT = '/paymentportalservice/nse/submitPayment';

const submitFormInfo = async (payload: any) => {
  const { uri, headers } = await getBaseUrl(CARD_SUBMIT);
  
  return await customFetch(uri, 'POST', {
    body: payload,
    headers
  });
};
```

### Response Type Definitions
```typescript
interface BraintreeAuthResponse {
  meta: {
    timestamp: number;
    cxpCorrelationId: string;
  };
  data: {
    authenticationSuccess: boolean;
    clientToken: string;
    orderNumber?: string;
  };
  status: {
    success: boolean;
    errors?: Array<{ message: string }>;
  };
}

interface BraintreePaymentResponse {
  meta: {
    timestamp: number;
    cxpCorrelationId: string;
  };
  status: 'SUCCESS' | 'FAILURE';
  data: {
    transactionId: string;
    message: string;
    orderNumber: string;
  };
}
```

## 7. TESTING STRATEGY

### Unit Tests Example
```typescript
// PaymentInformationColumn.spec.tsx
import { render, screen } from '@testing-library/react';
import PaymentInformationColumn from './PaymentInformationColumn';

describe('PaymentInformationColumn', () => {
  const mockPaymentDetails = [
    {
      id: '1',
      modeOfPay: 'PayPal',
      paymentAmount: 199.99,
      documentNum: 'ORD123456'
    }
  ];

  it('should render payment details correctly', () => {
    render(
      <PaymentInformationColumn
        heading="Payment Information"
        paymentDetails={mockPaymentDetails}
      />
    );

    expect(screen.getByText('Payment Information')).toBeInTheDocument();
    expect(screen.getByText('PayPal')).toBeInTheDocument();
    expect(screen.getByText('$199.99')).toBeInTheDocument();
    expect(screen.getByText('ORD123456')).toBeInTheDocument();
  });

  it('should have notranslate class on payment details', () => {
    const { container } = render(
      <PaymentInformationColumn
        heading="Payment Information"
        paymentDetails={mockPaymentDetails}
      />
    );

    const notranslateDiv = container.querySelector('.notranslate');
    expect(notranslateDiv).toBeInTheDocument();
  });

  it('should not render when paymentDetails is empty', () => {
    const { container } = render(
      <PaymentInformationColumn
        heading="Payment Information"
        paymentDetails={[]}
      />
    );

    expect(container.querySelector('.notranslate')?.children.length).toBe(0);
  });
});
```

### Snapshot Testing
```typescript
it('should match snapshot', () => {
  const { container } = render(
    <PaymentInformationColumn
      heading="Payment Information"
      paymentDetails={mockPaymentDetails}
    />
  );
  
  expect(container).toMatchSnapshot();
});
```

### API Testing
```typescript
// BraintreeButton.spec.tsx
import { getBraintreeClientToken, processBraintreePayment } from './api';

jest.mock('./api');

describe('BraintreeButton API calls', () => {
  it('should fetch client token successfully', async () => {
    const mockResponse = {
      data: { clientToken: 'mock-token-123' },
      status: { success: true }
    };
    
    (getBraintreeClientToken as jest.Mock).mockResolvedValue(mockResponse);

    const result = await getBraintreeClientToken();
    
    expect(result.data.clientToken).toBe('mock-token-123');
    expect(getBraintreeClientToken).toHaveBeenCalledTimes(1);
  });

  it('should handle payment processing', async () => {
    const mockResponse = {
      status: 'SUCCESS',
      data: { transactionId: 'txn-123', orderNumber: 'ORD123' }
    };
    
    (processBraintreePayment as jest.Mock).mockResolvedValue(mockResponse);

    const result = await processBraintreePayment('nonce-123', 'test@example.com');
    
    expect(result.status).toBe('SUCCESS');
    expect(processBraintreePayment).toHaveBeenCalledWith('nonce-123', 'test@example.com');
  });
});
```

### Coverage Goals
- **Statements**: 90%+
- **Branches**: 85%+
- **Functions**: 90%+
- **Lines**: 90%+

### Test Commands
```bash
npm test                    # Run tests in watch mode
npm run test:ci            # Run tests with coverage in CI
npm run testcase-coverage  # Generate coverage report
```

## 8. PERFORMANCE OPTIMIZATION TECHNIQUES

### 1. Code Splitting
```typescript
// Dynamic imports for heavy components
const BraintreeButton = dynamic(() => import('./BraintreeButton'), {
  loading: () => <LoadingSpinner />,
  ssr: false  // Client-side only
});

// Conditional SDK loading
if (braintreeFFlag && paymentMethod === 'paypal') {
  await loadBraintreeScripts();
}
```

### 2. React Performance
```typescript
// Memoization
const MemoizedPaymentColumn = React.memo(PaymentInformationColumn);

// useMemo for expensive calculations
const formattedAmount = useMemo(() => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(paymentAmount);
}, [paymentAmount]);

// useCallback for functions
const handlePayment = useCallback(async () => {
  await processPayment();
}, [orderId]);
```

### 3. Image Optimization
```typescript
import Image from 'next/image';

<Image
  src="/assets/payment-icon.png"
  alt="Payment"
  width={50}
  height={50}
  loading="lazy"
  placeholder="blur"
/>
```

### 4. Bundle Optimization
```javascript
// next.config.mjs
export default {
  experimental: {
    optimizePackageImports: ['@vds/core'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};
```

### 5. TanStack Query Caching
```typescript
const { data, isLoading } = useQuery(
  ['paymentOptions', cartId],
  () => fetchPaymentOptions(cartId),
  {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    retry: 2, // Retry failed requests
  }
);
```

### Performance Metrics

**Before Optimization:**
- Bundle Size: 2.5 MB
- First Contentful Paint: 3.2s
- Time to Interactive: 5.1s
- Lighthouse Score: 65

**After Optimization:**
- Bundle Size: 1.5 MB (-40%)
- First Contentful Paint: 1.9s
- Time to Interactive: 3.0s
- Lighthouse Score: 88

## 9. SECURITY IMPLEMENTATION

### 1. Content Security Policy (CSP)
```typescript
// constants/cspHeaders.ts
export const CSP_HEADERS = {
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.braintreegateway.com;
    connect-src 'self' https://api.braintreegateway.com;
    frame-src https://assets.braintreegateway.com;
    img-src 'self' data: https:;
    style-src 'self' 'unsafe-inline';
  `.replace(/\s{2,}/g, ' ').trim()
};
```

### 2. PII Protection
```typescript
// Prevent browser translation of sensitive data
<div className="notranslate">
  {/* Sensitive customer data */}
</div>

// Prevent autocomplete on sensitive fields
<input
  type="text"
  autoComplete="off"
  data-lpignore="true"  // LastPass ignore
  data-form-type="other"
/>
```

### 3. Token-based Authentication
```typescript
// Never send raw card numbers
const payload = {
  braintreeNonce: tokenizedCardData,  // Tokenized, not raw card
  cartId: getSecureCartId(),
};

// Always use HTTPS
const { uri } = await getBaseUrl(endpoint);  // Returns HTTPS URL
```

### 4. XSS Prevention
```typescript
// Sanitize user input
import DOMPurify from 'dompurify';

const sanitizedInput = DOMPurify.sanitize(userInput);

// Use textContent instead of innerHTML where possible
element.textContent = userInput;  // Safe
// element.innerHTML = userInput;  // Unsafe
```

### 5. CSRF Protection
```typescript
// Include CSRF token in headers
const headers = {
  'X-CSRF-Token': getCsrfToken(),
  'Content-Type': 'application/json',
};
```

### PCI DSS Compliance
- ✅ No storage of card numbers in frontend
- ✅ Use tokenization (Braintree nonce)
- ✅ 3D Secure authentication
- ✅ HTTPS only
- ✅ CSP headers implemented
- ✅ Regular security audits (SonarQube)

## 10. COMMON PATTERNS & BEST PRACTICES

### 1. Conditional Rendering Pattern
```typescript
// Good: Early return for loading/error states
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;

// Conditional feature rendering
{braintreeFFlag && <BraintreeButton />}
{payPalEnabled && <PayPalButton />}

// Optional chaining for nested data
const amount = orderData?.payment?.amount ?? 0;
```

### 2. Error Boundary Pattern
```typescript
// CustomErrorBoundary component
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <PaymentPortal />
</ErrorBoundary>
```

### 3. Custom Hooks Pattern
```typescript
// useSessionStorage hook
const useSessionStorage = <T,>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    
    const stored = sessionStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
};

// Usage
const [orderData, setOrderData] = useSessionStorage('orderData', {});
```

### 4. Loading State Pattern
```typescript
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async () => {
  try {
    setIsLoading(true);
    showLoader();  // Global loader
    
    await submitPayment();
    
    // Success handling
  } catch (error) {
    // Error handling
  } finally {
    setIsLoading(false);
    hideLoader();  // Always hide loader
  }
};
```

### 5. TypeScript Pattern
```typescript
// Discriminated unions for state
type PaymentStatus = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: PaymentData }
  | { status: 'error'; error: string };

// Type guards
function isSuccessResponse(res: ApiResponse): res is SuccessResponse {
  return res.status?.success === true;
}

// Generic utility types
type Optional<T> = T | null | undefined;
type ApiResponse<T> = {
  data?: T;
  status: { success: boolean; errors?: Error[] };
};
```

### Naming Conventions

#### Files
- **Components**: PascalCase - `PaymentInformationColumn.tsx`
- **Utils**: camelCase - `sessionStorageHelper.ts`
- **Types**: camelCase with `.type` - `featureFlags.type.ts`
- **Tests**: Same name with `.spec` - `PaymentInformationColumn.spec.tsx`

#### Variables & Functions
- **Components**: PascalCase - `PaymentPortal`
- **Functions**: camelCase - `getBraintreeClientToken`
- **Constants**: UPPER_SNAKE_CASE - `GET_BRAINTREE_CLIENT_TOKEN`
- **Booleans**: is/has prefix - `isLoading`, `hasError`

#### Props
- **Event handlers**: handle prefix - `handleClick`, `handleSubmit`
- **Callbacks**: on prefix - `onClick`, `onSuccess`

## 11. TROUBLESHOOTING GUIDE

### Issue 1: Braintree SDK Not Loading

**Symptoms**: PayPal button not rendering

**Causes:**
- Network blocked Braintree scripts
- Invalid client token
- CSP headers blocking scripts

**Solutions:**
```typescript
// Check script loading
const checkBraintreeLoaded = () => {
  if (typeof window.braintree === 'undefined') {
    console.error('Braintree SDK not loaded');
    return false;
  }
  return true;
};

// Add error handling
try {
  await loadBraintreeScripts();
} catch (error) {
  console.error('Failed to load Braintree:', error);
  showErrorMessage('Payment system unavailable. Please try again.');
}
```

### Issue 2: Feature Flags Not Working

**Symptoms**: Features not showing/hiding as expected

**Causes:**
- Session storage not set
- API response missing featureFlags
- Typo in flag name

**Solutions:**
```typescript
// Debug feature flags
const debugFeatureFlags = () => {
  const stored = sessionStorage.getItem('retrievePaymentOption');
  console.log('Feature Flags:', JSON.parse(stored || '{}')?.featureFlags);
};

// Safe flag checking
const isFlagEnabled = (flagPath: string) => {
  try {
    const data = JSON.parse(sessionStorage.getItem('retrievePaymentOption') || '{}');
    const keys = flagPath.split('.');
    return keys.reduce((obj, key) => obj?.[key], data) === true;
  } catch {
    return false;
  }
};
```

### Issue 3: Payment Processing Fails

**Symptoms**: Payment doesn't complete

**Causes:**
- Invalid nonce
- Expired session
- Network timeout

**Solutions:**
```typescript
// Add comprehensive error handling
const processPayment = async (nonce: string, email: string) => {
  try {
    const response = await processBraintreePayment(nonce, email);
    
    if (response.status !== 'SUCCESS' && response.data?.status !== 'SUCCESS') {
      throw new Error(response.data?.message || 'Payment failed');
    }
    
    return response;
  } catch (error) {
    console.error('Payment error:', error);
    
    if (error.message.includes('timeout')) {
      throw new Error('Payment timed out. Please try again.');
    } else if (error.message.includes('network')) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('Payment failed. Please try again or use a different payment method.');
    }
  }
};
```

### Issue 4: Test Failures

**Symptoms**: Tests failing unexpectedly

**Causes:**
- Snapshot mismatch
- Missing mocks
- Async timing issues

**Solutions:**
```typescript
// Update snapshots
// npm test -- -u

// Mock external dependencies
jest.mock('@vz-nextgen/common', () => ({
  showLoader: jest.fn(),
  hideLoader: jest.fn(),
  customFetch: jest.fn(),
}));

// Handle async properly
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument();
});
```

## 12. DEPLOYMENT & CI/CD

### Jenkins Pipeline

#### Build Process
```groovy
// Jenkinsfile
pipeline {
  agent any
  
  stages {
    stage('Install') {
      steps {
        sh 'npm install'
      }
    }
    
    stage('Lint') {
      steps {
        sh 'npm run lint'
      }
    }
    
    stage('Test') {
      steps {
        sh 'npm run test:ci'
      }
    }
    
    stage('SonarQube Analysis') {
      steps {
        sh 'sonar-scanner'
      }
    }
    
    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }
    
    stage('Lighthouse Audit') {
      steps {
        sh 'npm run lhci'
      }
    }
    
    stage('Deploy') {
      steps {
        sh 'docker build -t payment-portal .'
        sh 'docker push payment-portal:latest'
      }
    }
  }
}
```

### Pre-commit Hooks (Husky)
```bash
// .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint
npm run test
npm run stylelint
```

### Dockerfile
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## 13. KEY LEARNINGS & BEST PRACTICES

### What Makes This Project Successful

#### 1. Type Safety
- 100% TypeScript coverage
- Strict mode enabled
- Interface-driven development
- Prevents runtime errors

#### 2. Testing First
- Write tests before/during development
- 90%+ coverage maintained
- Snapshot tests for regression prevention
- Integration tests for critical flows

#### 3. Component Reusability
- Atomic design pattern
- Single Responsibility Principle
- DRY (Don't Repeat Yourself)
- Composition over inheritance

#### 4. Performance Consciousness
- Monitor bundle size
- Lazy load when possible
- Cache appropriately
- Optimize renders

#### 5. Security First
- Never trust user input
- Tokenize sensitive data
- Implement CSP
- Regular security audits

#### 6. Documentation
- Code comments for complex logic
- README for setup
- API documentation for integrations
- Architecture diagrams

#### 7. Error Handling
- Try-catch at API layer
- Error boundaries for React
- User-friendly messages
- Logging for debugging

#### 8. Accessibility
- WCAG 2.1 AA compliance
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support

#### 9. Code Quality
- ESLint + Prettier
- SonarQube analysis
- Code reviews
- Conventional commits

#### 10. Monitoring
- Lighthouse audits
- Coverage reports
- Performance metrics
- Error tracking

## 14. INTERVIEW TALKING POINTS

### Project Introduction
"I developed the Verizon Payment Portal, an enterprise-grade Next.js application handling 10,000+ daily payment transactions for wireless and FWA orders. I was the primary UI developer, working with React 18, TypeScript, and integrating Braintree/PayPal payment gateways with comprehensive security measures including 3D Secure authentication and PII protection."

### Technical Achievements
- Built responsive payment UI with Next.js 15 App Router and Verizon Design System
- Integrated Braintree Web SDK and PayPal Express Checkout with dynamic script loading
- Implemented feature flags system for runtime feature toggling without redeployment
- Achieved 90%+ test coverage with Jest and React Testing Library
- Optimized bundle size by 40% through code splitting and lazy loading
- Implemented PII protection using `notranslate` class preventing browser translation of sensitive data

### Business Impact
- Handles 10,000+ daily transactions
- Improved First Contentful Paint from 3.2s to 1.9s
- Lighthouse score improved from 65 to 88
- Zero critical security vulnerabilities (SonarQube Quality Gate)
- WCAG 2.1 AA compliance for accessibility
- PCI DSS compliant payment processing

### Challenges Solved
- **Dynamic SDK Loading**: Implemented conditional loading of Braintree scripts based on feature flags to reduce initial bundle size
- **PII Protection**: Added `notranslate` class to prevent Google Translate from exposing sensitive customer data
- **Feature Flags**: Built session storage-based feature flag system enabling runtime feature toggles
- **Type Safety**: Migrated legacy JavaScript components to TypeScript achieving 100% type coverage
- **Performance**: Reduced Time to Interactive by 41% through React.memo, useMemo, and code splitting

### Technologies Demonstrated
- **Frontend**: Next.js 15, React 18, TypeScript 5, Tailwind CSS, VDS
- **State Management**: TanStack Query, React Hooks, Session Storage
- **Payment Integration**: Braintree SDK, PayPal API, Cardinal Commerce 3D Secure
- **Testing**: Jest, React Testing Library, Playwright (200+ tests)
- **DevOps**: Jenkins, Docker, Husky, SonarQube, Lighthouse CI

This comprehensive training document provides all the context needed to understand the Verizon Payment Portal project! 🚀
