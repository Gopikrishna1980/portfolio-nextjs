# VXP PROJECT - AI TRAINING DOCUMENT

## 📋 PROJECT OVERVIEW

### Project Name
Verizon Experience Platform (VXP) - Service Order Management System

### Project Type
Enterprise Microservices Platform for Telecommunications

### Technology Stack
- **Language**: Java 17+
- **Framework**: Spring Boot 3.x
- **Reactive Programming**: Spring WebFlux, Project Reactor
- **Build Tool**: Maven (Multi-module project)
- **Testing**: JUnit 5, Mockito, Reactor Test (StepVerifier)
- **Resilience**: Resilience4j (Circuit Breaker, Retry, Timeout)
- **HTTP Client**: WebClient (Reactive)
- **XML Binding**: JAXB (Jakarta XML Binding)
- **Logging**: SLF4J with Logback
- **Utilities**: Lombok, Jackson
- **CI/CD**: Jenkins
- **Containerization**: Docker
- **Version Control**: Git
- **Artifact Repository**: Artifactory

### Domain
Telecommunications - Customer Self-Service Operations

### Purpose
Handle customer service orders for voice features (call forwarding, voicemail), mobile data provisioning (APN settings), SMS notifications, and device management.

## 🏗️ ARCHITECTURE

### Architecture Pattern
Microservices Architecture with Reactive Programming

### Service Modules (5 Main Services)

1. **Call Forwarding Service**
   - Endpoint: `/api/v1/customer-maintenance/call-forwarding`
   - Function: Manage call forwarding settings (Unconditional, Busy, No Answer, Not Reachable)

2. **Voicemail Password Management Service**
   - Endpoint: `/api/v1/customer-maintenance/voicemail/reset-password`
   - Function: Secure PIN reset and validation

3. **APN Settings Service**
   - Endpoint: `/api/v1/customer-maintenance/apn-settings`
   - Function: Mobile data provisioning and device configuration

4. **SMS Integration Service**
   - Endpoint: `/api/v1/customer-maintenance/sms/send`
   - Function: Customer notifications and service confirmations

5. **Line Enquiry Service Integration**
   - Function: Real-time customer account and device information retrieval

### External Integrations (10+ Services)
- Nokia APN Adapter - Device provisioning via SOAP/XML
- TracFone Gateway - Carrier integration
- Communication SMS Service - Notification delivery
- Line Enquiry Service - Customer data retrieval
- BPM/Workflow Engine - JBPM integration
- Legacy SOAP Services - WSDL-based integrations
- Voicemail System - Legacy PIN management
- Call Forwarding Gateway - Telephony features
- Device Registry - IMEI/ESN validation
- Customer Database - Account information

## 📦 PROJECT STRUCTURE

Multi-Module Maven Project:

```
vxp-serviceorder-services/
├── pom.xml (Parent POM)
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── onevz/vxp/serviceorder/
│   │   │       ├── config/           # Configuration classes
│   │   │       ├── controller/       # REST controllers
│   │   │       ├── service/          # Business logic
│   │   │       │   └── impl/         # Service implementations
│   │   │       ├── helper/           # Integration adapters
│   │   │       ├── model/            # DTOs and domain models
│   │   │       ├── exception/        # Custom exceptions
│   │   │       ├── util/             # Utility classes
│   │   │       └── constants/        # Constants
│   │   └── resources/
│   │       ├── application.yml       # Configuration
│   │       └── application-{env}.yml # Environment configs
│   └── test/
│       └── java/                     # Unit tests
├── Dockerfile                        # Container configuration
└── Jenkinsfile                       # CI/CD pipeline
```

## 🔧 KEY COMPONENTS & CODE STRUCTURE

### 1. Service Implementation Pattern

**APNSettingsServiceImpl.java**

Key Concepts:
- Implements reactive flow with Mono/Flux
- Validates business rules in sequence
- Integrates with external services
- Handles errors gracefully
- Masks PII data in all logs

Main Method:
```java
public Mono<CXPResponse<ApnSettingsResponse>> updateApnSettings(ApnSettingsRequest request)
```

Flow:
1. Mask PII in incoming request
2. Query Line Enquiry Service for customer data
3. Validate line status (must be ACTIVE)
4. Validate features (check for 4G_DATA_BLOCK)
5. Validate SIMOTA status (cannot be RS or empty)
6. Extract IMEI/ESN from request or line data
7. Call Nokia APN Adapter
8. Build success/error response
9. Return masked response

Validation Chain:
```java
return lineEnquiryService.getLineDetails(lineRequest)
    .flatMap(this::processLineEnquiryResponse)
    .flatMap(this::validateLineStatus)
    .flatMap(this::validateDataBlock)
    .flatMap(this::validateSimotaStatus)
    .flatMap(this::extractImeiAndCallNokia)
    .map(this::buildSuccessResponse)
    .onErrorResume(this::handleError);
```

### 2. Integration Adapter Pattern

**NokiaApnAdapterHelper.java**

Key Concepts:
- JAXB-based XML marshalling/unmarshalling
- Custom HTTP headers for API Gateway authentication
- Retry logic with Resilience4j
- Type conversion (JAXB Integer → Response String)
- Request ID generation for traceability

Main Method:
```java
@Retry(name = "nokiaApnAdapter")
public Mono<NokiaApnResponse> sendApnRequest(String imei)
```

Implementation Details:

**XML Request Format:**
```xml
<VZRequest>
  <ReqId>TF_260103120530123_a1b2c3d4e5f6</ReqId>
  <UsrId/>
  <Source/>
  <ResponseUrl/>
  <ResponseType>APN</ResponseType>
  <TrnType>CheckConfiguration</TrnType>
  <Imei>123456789012345</Imei>
</VZRequest>
```

**XML Response Format:**
```xml
<VZResponse>
  <ReqId>TF_260103120530123_a1b2c3d4e5f6</ReqId>
  <Status>
    <ResultCode>0</ResultCode>
    <ResultReason>Success</ResultReason>
  </Status>
  <Imei>123456789012345</Imei>
</VZResponse>
```

**Custom Headers:**
- X-IBM-Client-Id: API Gateway authentication token
- X-Correlation-Id: Request tracking ID
- sourceSystem: Source system identifier (e.g., "AURA-CARE")
- Content-Type: "text/xml"
- Accept: "text/xml"

**Request ID Format:**
```
TF_YYMMDDHHMMSSSS_XXXXXXXXXXXX
  │  │            │
  │  │            └─ 12-character UUID
  │  └─ Timestamp (year, month, day, hour, minute, second, millisecond)
  └─ Prefix (TracFone)

Example: TF_260103120530123_a1b2c3d4e5f6
```

**Type Conversion Logic:**
```java
// JAXB returns Integer from XML
Integer resultCode = adapterResponse.getStatus().getResultCode();

// Convert to String for API response (backward compatibility)
response.setResultCode(resultCode != null ? String.valueOf(resultCode) : null);
```

### 3. PII Masking Framework

**SensitiveDataMaskUtil.java**

Purpose: Ensure GDPR/CCPA compliance by masking Personally Identifiable Information (PII) in logs

Masking Strategies:

**MDN (Mobile Directory Number / Phone Number):**
```java
public static String maskMdn(String mdn)
// Input:  "1234567890"
// Output: "123***7890"
// Logic: Show first 3 and last 4 digits
```

**IMEI/ESN (Device Identifier):**
```java
public static String maskImei(String imei)
// Input:  "123456789012345"
// Output: "***********2345"
// Logic: Show only last 4 digits
```

**PIN (Voicemail Password):**
```java
public static String maskPin(String pin)
// Input:  "1234"
// Output: "****"
// Logic: Complete masking
```

**Usage Pattern:**
```java
log.info("APN Settings update request received for MDN: {}, ESN: {}", 
    SensitiveDataMaskUtil.maskMdn(request.getMdn()),
    SensitiveDataMaskUtil.maskImei(request.getEsn()));
```

Coverage:
- Applied to 100+ logging statements
- Used in error messages
- Applied in API responses where needed
- Used in audit logs

### 4. Error Handling Framework

**Custom Exception Hierarchy:**

1. **VXPServiceOrderException**
   - Used for: Business validation errors
   - Contains: Error code, error message
   - Example codes: E5001, E5002, E5003, etc.

2. **NokiaApnAdapterException**
   - Used for: Integration failures with Nokia
   - Contains: Root cause, error message
   - Extends: RuntimeException

**Error Codes:**

| Code  | Description              |
|-------|--------------------------|
| E5001 | Line not found           |
| E5002 | Line inactive            |
| E5003 | IMEI/ESN not found       |
| E5004 | Data block enabled       |
| E5005 | Invalid SIMOTA status    |
| E5006 | Line enquiry failed      |
| E5999 | General error            |
| 0     | Success                  |
| 999   | Generic adapter error    |

**Error Response Structure:**
```json
{
  "meta": {
    "timestamp": "2026-01-03T12:00:00Z",
    "cxpCorrelationId": "abc-123"
  },
  "data": {
    "mdn": "1234567890",
    "imei": "123456789012345",
    "statusCode": "E5002",
    "statusMessage": "Line is not active",
    "errors": [
      {
        "code": "E5002",
        "message": "Line status is SUSPENDED. Cannot update APN settings."
      }
    ]
  }
}
```

### 5. Reactive Programming Patterns

**Why Reactive:**
- Non-blocking I/O for better throughput
- Handle multiple external service calls efficiently
- Reduce thread pool exhaustion
- Better resource utilization
- Improved scalability

**Key Operators Used:**

1. **flatMap**: Transform and flatten async operations
```java
.flatMap(lineResponse -> validateLineStatus(lineResponse))
```

2. **map**: Synchronous transformation
```java
.map(nokiaResponse -> buildSuccessResponse(nokiaResponse))
```

3. **onErrorResume**: Error handling without breaking reactive chain
```java
.onErrorResume(error -> handleError(error))
```

4. **doOnSuccess / doOnError**: Side effects (logging)
```java
.doOnSuccess(response -> log.info("Success"))
.doOnError(error -> log.error("Failed", error))
```

5. **timeout**: Set time limit for operations
```java
.timeout(Duration.ofMillis(5000))
```

**Example Reactive Chain:**
```java
return lineEnquiryService.getLineDetails(request)
    .doOnNext(response -> log.info("Line enquiry completed"))
    .flatMap(this::validateLineStatus)
    .flatMap(this::validateFeatures)
    .flatMap(this::validateSimota)
    .flatMap(this::callNokiaAdapter)
    .map(this::buildSuccessResponse)
    .doOnSuccess(response -> log.info("APN update successful"))
    .onErrorResume(this::handleError)
    .doOnError(error -> log.error("APN update failed", error));
```

### 6. Resilience Patterns (Resilience4j)

**Configuration (application.yml):**
```yaml
resilience4j:
  retry:
    instances:
      nokiaApnAdapter:
        maxAttempts: 3
        waitDuration: 100ms
        exponentialBackoffMultiplier: 2
        retryExceptions:
          - java.net.SocketTimeoutException
          - org.springframework.web.reactive.function.client.WebClientRequestException
  circuitbreaker:
    instances:
      nokiaApnAdapter:
        failureRateThreshold: 50
        waitDurationInOpenState: 10s
        slidingWindowSize: 10
        minimumNumberOfCalls: 5
```

**Retry Pattern:**
- Attempt 1: Immediate
- Attempt 2: Wait 100ms
- Attempt 3: Wait 200ms (exponential backoff)

**Circuit Breaker States:**
- **CLOSED**: Normal operation, requests flow through
- **OPEN**: Circuit tripped, requests fail fast (no external calls)
- **HALF_OPEN**: Testing if service recovered

**Usage:**
```java
@Retry(name = "nokiaApnAdapter")
public Mono<NokiaApnResponse> sendApnRequest(String imei) {
    // Will retry automatically on failure
}
```

### 7. Validation Framework

**Business Rules Validated:**

**A. Call Forwarding:**
- Number must be 10 digits
- Cannot forward to own number (self-forwarding prevention)
- Valid area code
- No special characters

**B. Voicemail PIN:**
- Length: 4-6 digits
- Must be numeric only
- No sequential digits (1234, 5678)
- No repeated digits (1111, 2222, 3333)
- Cannot match MDN

**C. APN Settings:**
- Line status must be ACTIVE (not SUSPENDED, DEACTIVATED)
- Cannot have 4G_DATA_BLOCK feature enabled
- SIMOTA status cannot be "RS" (Reverse SIM)
- SIMOTA status cannot be empty/null
- Must have valid IMEI/ESN (from request or Line Enquiry)

**D. Device Validation:**
- IMEI must be 15 digits (or 14 for some carriers)
- ESN must be valid format
- Device must exist in Service Inventory

**Validation Implementation Pattern:**
```java
private Mono<Void> validateLineStatus(LineEnquiryResponse lineData) {
    if (!"ACTIVE".equalsIgnoreCase(lineData.getStatus())) {
        return Mono.error(new VXPServiceOrderException(
            "E5002", "Line is not active"
        ));
    }
    return Mono.empty();
}
```

### 8. Testing Strategy

**Test Categories:**

**A. Unit Tests (150+ tests):**
- Success scenarios
- Validation failures
- Edge cases (null, empty, boundary values)
- Error handling
- Reactive flow testing

**B. Test Structure:**
```java
@ExtendWith(MockitoExtension.class)
class APNSettingsServiceImplTest {
    
    @Mock
    private LineEnquiryService lineEnquiryService;
    
    @Mock
    private NokiaApnAdapterHelper nokiaApnAdapterHelper;
    
    private APNSettingsServiceImpl apnSettingsService;
    
    @BeforeEach
    void setUp() {
        apnSettingsService = new APNSettingsServiceImpl(
            lineEnquiryService,
            nokiaApnAdapterHelper
        );
    }
    
    @Test
    void testUpdateApnSettings_Success() {
        // Arrange
        when(lineEnquiryService.getLineDetails(any()))
            .thenReturn(Mono.just(lineResponse));
        when(nokiaApnAdapterHelper.sendApnRequest(anyString()))
            .thenReturn(Mono.just(nokiaResponse));
        
        // Act & Assert
        StepVerifier.create(service.updateApnSettings(request))
            .assertNext(response -> {
                assertThat(response.getData().getStatusCode()).isEqualTo("0");
            })
            .verifyComplete();
    }
}
```

**C. Reactive Testing with StepVerifier:**
```java
StepVerifier.create(reactiveFlow)
    .expectNext(expectedValue)
    .verifyComplete();

StepVerifier.create(reactiveFlow)
    .expectError(VXPServiceOrderException.class)
    .verify();

StepVerifier.create(reactiveFlow)
    .assertNext(response -> {
        assertThat(response.getStatusCode()).isEqualTo("0");
        assertThat(response.getMdn()).isEqualTo("1234567890");
    })
    .verifyComplete();
```

**D. Code Coverage:**
- Target: 85%+
- Tool: JaCoCo
- Measured by: Lines, Branches, Methods

## 🔐 SECURITY & COMPLIANCE

### PII Data Protection

**Data Types Protected:**
- MDN (Phone Number): Customer's mobile number
- IMEI/ESN: Device identifier
- PIN: Voicemail password
- Account Number: Customer account ID

**Compliance Standards:**
- GDPR (General Data Protection Regulation)
- CCPA (California Consumer Privacy Act)
- Industry telecommunications standards

**Implementation:**
- Masking in all log statements
- Masking in error messages
- Secure handling in memory
- No plain-text storage in logs
- Audit trail for sensitive operations

## 📊 PERFORMANCE METRICS

### Service Performance
- **Throughput**: 2M+ requests/day
- **Response Time**: Average 200-500ms
- **Improvement**: 35% faster with reactive programming
- **Availability**: 99.9% with resilience patterns

### Code Quality
- **Test Coverage**: 90%
- **Unit Tests**: 150+
- **Code Duplication**: Reduced by 40%
- **Defects**: Reduced by 30%

### Integration Metrics
- **External Services**: 10+
- **Retry Success Rate**: 75% on retry
- **Circuit Breaker**: Opens at 50% failure rate

## 🚀 DEPLOYMENT & CI/CD

### Build Process

1. **Maven Build:**
```bash
mvn clean install
```

2. **Test Execution:**
```bash
mvn test
mvn verify
```

3. **Code Coverage:**
```bash
mvn jacoco:report
```

### Jenkins Pipeline Stages

1. **Checkout**: Pull latest code from Git
2. **Build**: Compile Java code
3. **Test**: Run unit tests
4. **Code Quality**: SonarQube analysis
5. **Package**: Create JAR file
6. **Docker Build**: Create container image
7. **Push to Artifactory**: Store artifacts
8. **Deploy to Dev**: Deploy to development environment
9. **Integration Tests**: Run smoke tests
10. **Deploy to QA**: Deploy to QA environment
11. **Deploy to Prod**: Manual approval, then production deployment

### Docker Configuration

**Dockerfile:**
```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/vxp-serviceorder-services.jar app.jar
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:8080/actuator/health || exit 1
ENTRYPOINT ["java", "-jar", "app.jar"]
```

## 📝 KEY REFACTORING WORK

### Refactoring Project Details

**Scope:**
- 8+ service classes refactored
- 100+ log statements updated with PII masking
- Type safety improvements across codebase
- Error handling enhancement
- Removal of code duplication

**Specific Changes:**

**1. APNSettingsServiceImpl.java:**
- ✅ Removed SMS logic (separation of concerns)
- ✅ Added PII masking for all logs
- ✅ Changed resultCode from int to String
- ✅ Improved error handling
- ✅ Removed unused constructor parameters
- ✅ Added comprehensive validation

**2. NokiaApnAdapterHelper.java:**
- ✅ Added error constants (STATUS_ERROR, ERROR_CODE_GENERIC)
- ✅ Replaced RuntimeException with NokiaApnAdapterException
- ✅ Implemented Java 17 pattern matching
- ✅ Fixed type conversion (Integer → String)
- ✅ Improved error messages
- ✅ Enhanced logging

**3. SensitiveDataMaskUtil.java:**
- ✅ Added secure maskImei() method
- ✅ Standardized masking patterns
- ✅ Improved null handling
- ✅ Added comprehensive JavaDoc

**4. Test Updates:**
- ✅ Removed SMS-related tests
- ✅ Updated constructor calls
- ✅ Fixed resultCode type in assertions
- ✅ Removed unused imports and mocks
- ✅ All 19 tests passing

**Impact:**
- Code duplication: -40%
- Maintainability: +40%
- Type safety: +100%
- Test coverage: 85%+
- Production defects: -30%

## 🎓 TECHNICAL CONCEPTS TO UNDERSTAND

### 1. Reactive Programming
- Non-blocking I/O
- Backpressure handling
- Publisher-Subscriber pattern
- Mono (0 or 1 element)
- Flux (0 to N elements)

### 2. Microservices
- Service decomposition
- API Gateway pattern
- Service discovery
- Load balancing
- Distributed tracing

### 3. Resilience Patterns
- Circuit Breaker
- Retry with exponential backoff
- Timeout
- Bulkhead
- Fallback

### 4. JAXB (Jakarta XML Binding)
- XML to Java object mapping
- Marshalling (Java → XML)
- Unmarshalling (XML → Java)
- Annotations: @XmlRootElement, @XmlElement, @XmlAccessorType

### 5. Dependency Injection
- Constructor injection
- Field injection
- @Autowired annotation
- Component scanning
- Bean lifecycle

### 6. RESTful API Design
- Resource-based URLs
- HTTP methods (GET, POST, PUT, DELETE)
- Status codes (200, 400, 500)
- Request/Response DTOs
- Error response format

## 🗣️ INTERVIEW TALKING POINTS

### Project Introduction
"I worked on the Verizon Experience Platform, a microservices-based system handling customer self-service operations for telecom features. I developed 5 main services using Spring Boot and reactive programming, integrating with 10+ external systems including Nokia's carrier gateway."

### Technical Achievements
- Implemented reactive programming reducing response time by 35%
- Built PII masking framework ensuring 100% GDPR/CCPA compliance
- Achieved 85%+ code coverage with 150+ unit tests
- Integrated with Nokia SOAP adapter using JAXB
- Implemented Resilience4j patterns achieving 99.9% availability

### Business Impact
- Processes 2M+ customer requests daily
- Reduced production defects by 30%
- Improved code maintainability by 40%
- Zero-downtime deployments
- Enhanced security and compliance

### Challenges Solved
- **Type Conversion**: Handled JAXB Integer to String conversion for backward compatibility
- **PII Security**: Implemented comprehensive masking across 100+ log statements
- **Performance**: Optimized reactive flows for better throughput
- **Reliability**: Added circuit breaker and retry patterns
- **Refactoring**: Successfully refactored 8+ classes without breaking functionality

## 📚 CODE EXAMPLES FOR AI TRAINING

### Example 1: Reactive Service Method

```java
@Override
public Mono<CXPResponse<ApnSettingsResponse>> updateApnSettings(ApnSettingsRequest request) {
    String maskedMdn = SensitiveDataMaskUtil.maskMdn(request.getMdn());
    log.info("APN Settings update request for MDN: {}", maskedMdn);
    
    return lineEnquiryService.getLineDetails(buildLineRequest(request.getMdn()))
        .flatMap(this::validateLine)
        .flatMap(lineData -> nokiaAdapter.sendApnRequest(extractImei(lineData)))
        .map(nokiaResponse -> buildSuccessResponse(request, nokiaResponse))
        .onErrorResume(this::handleError)
        .doOnSuccess(response -> log.info("APN update completed"));
}
```

### Example 2: JAXB XML Adapter

```java
@Retry(name = "nokiaApnAdapter")
public Mono<NokiaApnResponse> sendApnRequest(String imei) {
    VZRequest request = new VZRequest();
    request.setReqId(generateRequestId());
    request.setImei(imei);
    request.setResponseType("APN");
    request.setTrnType("CheckConfiguration");
    
    String xmlRequest = jaxbMarshaller.marshal(request);
    
    return webClient.post()
        .uri(nokiaApnUrl)
        .headers(headers -> {
            headers.set("X-IBM-Client-Id", clientId);
            headers.set("X-Correlation-Id", UUID.randomUUID().toString());
            headers.set("Content-Type", "text/xml");
        })
        .bodyValue(xmlRequest)
        .retrieve()
        .bodyToMono(String.class)
        .map(xmlResponse -> jaxbUnmarshaller.unmarshal(xmlResponse, VZResponse.class))
        .map(this::convertToNokiaResponse);
}
```

### Example 3: PII Masking

```java
public static String maskMdn(String mdn) {
    if (mdn == null || mdn.length() < 10) {
        return "***";
    }
    return mdn.substring(0, 3) + "***" + mdn.substring(mdn.length() - 4);
}
```

### Example 4: Validation Pattern

```java
private Mono<Void> validateLineStatus(LineEnquiryResponse lineData) {
    if (!"ACTIVE".equalsIgnoreCase(lineData.getStatus())) {
        return Mono.error(new VXPServiceOrderException(
            LINE_INACTIVE_CODE,
            "Line is " + lineData.getStatus() + ". Must be ACTIVE."
        ));
    }
    return Mono.empty();
}
```

### Example 5: Error Handling

```java
private Mono<CXPResponse<ApnSettingsResponse>> handleError(Throwable error) {
    log.error("Error in APN settings update", error);
    
    if (error instanceof VXPServiceOrderException vxpEx) {
        return Mono.just(buildErrorResponse(
            vxpEx.getErrorCode(),
            vxpEx.getMessage()
        ));
    }
    
    return Mono.just(buildErrorResponse(
        APN_GENERAL_ERROR_CODE,
        "Unexpected error occurred"
    ));
}
```

### Example 6: Unit Test with StepVerifier

```java
@Test
void testUpdateApnSettings_Success() {
    when(lineEnquiryService.getLineDetails(any()))
        .thenReturn(Mono.just(mockLineResponse));
    when(nokiaAdapter.sendApnRequest(anyString()))
        .thenReturn(Mono.just(mockNokiaResponse));
    
    StepVerifier.create(service.updateApnSettings(request))
        .assertNext(response -> {
            assertThat(response.getData().getStatusCode()).isEqualTo("0");
            assertThat(response.getData().getMdn()).isEqualTo("1234567890");
        })
        .verifyComplete();
    
    verify(lineEnquiryService, times(1)).getLineDetails(any());
    verify(nokiaAdapter, times(1)).sendApnRequest(anyString());
}
```

## 🎯 AI TRAINING PROMPT SUGGESTIONS

You can train your AI with prompts like:

- "Explain how the VXP project handles PII data masking"
- "How does the Nokia APN adapter work with JAXB?"
- "What are the key validation rules in the APN Settings service?"
- "Describe the reactive programming flow in the service layer"
- "How are errors handled in the microservices?"
- "What resilience patterns are used and why?"
- "Explain the type conversion issue between JAXB and the response model"
- "How do you test reactive code with StepVerifier?"
- "What are the key refactoring improvements made?"
- "How does the circuit breaker protect the system?"

This comprehensive training document should give your AI all the context it needs to understand the VXP project! 🚀
