# BlinkForm Settings Sidebar Reference

## Overview
This document provides a comprehensive reference for all settings and configuration options available in BlinkForm's right sidebar (Properties Panel). Settings are organized into 10 functional categories covering form identity, blockchain configuration, publishing, and advanced features.

**Legend:**
- ✅ **Implemented** - Currently available in UI
- 📝 **In Schema** - Defined in types but not exposed in UI
- ⚠️ **Missing** - Required for production but not yet implemented

---

## Section 1: Form Identity & Basic Settings

Settings that define the core identity and metadata of the form.

### 1.1 Form ID
- **Type**: Read-only text display
- **Status**: ✅ Implemented
- **Default**: "Not saved yet" (until first save)
- **Description**: Unique identifier (UUID) assigned when form is first saved to database
- **Location**: Displayed at top of properties panel
- **Related Files**:
  - `frontend/src/components/sidebars/RightSidebar.tsx`
  - `frontend/src/types/schema.ts` (FormMetadata.id)

### 1.2 Form Title
- **Type**: Text input
- **Status**: ✅ Implemented
- **Required**: Yes
- **Default**: "Untitled Form"
- **Max Length**: 100 characters (recommended)
- **Description**: Display name of the form, shown in Blink unfurl and dashboard
- **Validation**: Cannot be empty, trimmed whitespace
- **Related Files**:
  - `frontend/src/components/sidebars/RightSidebar.tsx`
  - `frontend/src/types/schema.ts` (FormMetadata.title)
  - `frontend/src/store/slices/metadataSlice.ts`

### 1.3 Description
- **Type**: Textarea
- **Status**: ✅ Implemented
- **Required**: No
- **Default**: Empty string
- **Max Length**: 500 characters (recommended)
- **Description**: Brief description of form purpose, shown in Blink preview
- **Validation**: Optional, trimmed whitespace
- **Related Files**:
  - `frontend/src/components/sidebars/RightSidebar.tsx`
  - `frontend/src/types/schema.ts` (FormMetadata.description)

---

## Section 2: Creator & Ownership

Settings related to form ownership and creator wallet configuration.

### 2.1 Creator Address
- **Type**: Text input (Solana wallet address)
- **Status**: ✅ Implemented
- **Required**: Yes (for transaction nodes)
- **Format**: Base58 encoded Solana public key (32-44 characters)
- **Description**: Solana wallet address of form creator, used for signing transactions
- **Validation**:
  - Must be valid base58 string
  - Length between 32-44 characters
  - Should validate as valid Solana public key
- **Example**: `DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK`
- **Related Files**:
  - `frontend/src/components/sidebars/RightSidebar.tsx`
  - `frontend/src/types/schema.ts` (FormMetadata.creatorAddress)
- **Best Practice**: Connect user's wallet to auto-fill this field

### 2.2 Verify Creator [NOT IMPLEMENTED]
- **Type**: Button/Action
- **Status**: ⚠️ Missing
- **Description**: Verify creator has signing authority for specified wallet
- **Implementation**: Trigger wallet signature to prove ownership
- **UI**: Button next to Creator Address field
- **Recommended**: Show verification status badge (Verified ✓ / Unverified)

---

## Section 3: Blink Display & Branding

Settings that control how the form appears when shared as a Blink on social platforms.

### 3.1 Blink Icon URL [NOT IMPLEMENTED]
- **Type**: Text input (URL) or file upload
- **Status**: ⚠️ Missing
- **Required**: No
- **Default**: Default BlinkForm icon
- **Format**: Valid image URL (HTTPS)
- **Accepted Formats**: PNG, JPG, SVG
- **Recommended Size**: 256x256px or 512x512px
- **Description**: Icon displayed in Blink unfurl on Twitter/X and other platforms
- **Validation**: Valid HTTPS URL, image accessibility check
- **Example**: `https://blinkform.xyz/icons/my-form-icon.png`

### 3.2 Blink Label [NOT IMPLEMENTED]
- **Type**: Text input
- **Status**: ⚠️ Missing
- **Required**: No
- **Default**: "Start" or "Begin"
- **Max Length**: 20 characters
- **Description**: Text displayed on primary action button in Blink
- **Examples**: "Start Quiz", "Join DAO", "Mint NFT", "Enter Raffle"
- **Related**: Solana Actions spec `label` field

### 3.3 Open Graph Image URL [NOT IMPLEMENTED]
- **Type**: Text input (URL) or file upload
- **Status**: ⚠️ Missing
- **Required**: No
- **Default**: Auto-generated OG image
- **Format**: Valid image URL (HTTPS)
- **Recommended Size**: 1200x630px (standard OG image ratio)
- **Description**: Custom preview image for social sharing
- **Implementation**: Generate dynamically based on form content or allow custom upload

---

## Section 4: Collection Settings (NFT)

Configuration for NFT collections and token minting operations.

### 4.1 Collection Name
- **Type**: Text input
- **Status**: ✅ Implemented
- **Required**: Only if form includes mint/NFT nodes
- **Max Length**: 50 characters
- **Description**: Name of the NFT collection
- **Example**: "DAO Membership Pass", "Quiz Completion Badge"
- **Related Files**:
  - `frontend/src/components/sidebars/RightSidebar.tsx`
  - `frontend/src/types/schema.ts` (CollectionSettings.collectionName)

### 4.2 Collection Address
- **Type**: Text input (Solana mint address)
- **Status**: ✅ Implemented
- **Required**: Only if form includes mint/NFT nodes
- **Format**: Base58 encoded Solana public key
- **Description**: Mint address of the NFT collection on Solana
- **Validation**:
  - Valid Solana public key
  - Should verify collection exists on-chain
  - Verify creator has minting authority
- **Example**: `7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU`
- **Related Files**:
  - `frontend/src/components/sidebars/RightSidebar.tsx`
  - `frontend/src/types/schema.ts` (CollectionSettings.collectionAddress)

### 4.3 Collection Image URL
- **Type**: Text input (URL) or file upload
- **Status**: 📝 In Schema
- **Required**: No
- **Format**: Valid image URL (HTTPS)
- **Description**: Collection artwork/image for NFT metadata
- **Note**: Defined in `CollectionSettings` interface but not exposed in UI
- **Related Files**:
  - `frontend/src/types/schema.ts` (CollectionSettings.collectionImageUrl)
- **Recommendation**: Add to UI in collection settings section

### 4.4 Collection Description
- **Type**: Textarea
- **Status**: ✅ Implemented
- **Required**: No
- **Max Length**: 300 characters
- **Description**: Description of the NFT collection
- **Related Files**:
  - `frontend/src/components/sidebars/RightSidebar.tsx`
  - `frontend/src/types/schema.ts` (CollectionSettings.collectionDescription)

### 4.5 Royalties
- **Type**: Number input (percentage)
- **Status**: ✅ Implemented
- **Required**: No
- **Default**: 0
- **Range**: 0-100
- **Step**: 0.1
- **Description**: Royalty percentage for secondary sales
- **Validation**: Must be between 0 and 100
- **Format**: Displayed as percentage (e.g., "5%" for 0.05)
- **Related Files**:
  - `frontend/src/components/sidebars/RightSidebar.tsx`
  - `frontend/src/types/schema.ts` (CollectionSettings.royalties)

---

## Section 5: Publishing & Distribution

Settings that control form lifecycle, access, and distribution.

### 5.1 Form Status [NOT IMPLEMENTED]
- **Type**: Dropdown select or toggle
- **Status**: ⚠️ Missing
- **Required**: Yes
- **Default**: "Draft"
- **Options**:
  - **Draft**: Form is being edited, not publicly accessible
  - **Published**: Form is live and accessible via Blink URL
  - **Archived**: Form is no longer active but preserved
- **Description**: Controls form visibility and accessibility
- **Implementation**: Add to FormMetadata interface
- **UI**: Prominent toggle or dropdown at top of properties panel

### 5.2 Published Date [NOT IMPLEMENTED]
- **Type**: Date/time picker
- **Status**: ⚠️ Missing
- **Required**: No
- **Default**: Current timestamp when status changes to "Published"
- **Description**: Date/time when form becomes publicly accessible
- **Feature**: Schedule publishing for future date
- **Implementation**: Store as ISO 8601 timestamp

### 5.3 Expiration Date [NOT IMPLEMENTED]
- **Type**: Date/time picker
- **Status**: ⚠️ Missing
- **Required**: No
- **Default**: None (no expiration)
- **Description**: Date/time when form automatically becomes inactive
- **Use Cases**: Limited-time offers, event registration deadlines
- **Behavior**: After expiration, form shows "This form has ended" message
- **Implementation**: Check expiration in GET /api/actions/:formId

### 5.4 Access Control [NOT IMPLEMENTED]
- **Type**: Dropdown select
- **Status**: ⚠️ Missing
- **Required**: Yes
- **Default**: "Public"
- **Options**:
  - **Public**: Anyone with link can access
  - **Allowlist**: Only approved wallet addresses can access
  - **Token Gated**: Requires holding specific token/NFT
  - **Password Protected**: Requires password to access
- **Description**: Controls who can access and submit the form

### 5.5 Allowlist Addresses [NOT IMPLEMENTED]
- **Type**: Textarea (one address per line) or address manager
- **Status**: ⚠️ Missing
- **Condition**: Only shown when Access Control = "Allowlist"
- **Format**: List of Solana public keys
- **Description**: Wallet addresses permitted to access the form
- **Validation**: Each line must be valid Solana public key

### 5.6 Token Gate Configuration [NOT IMPLEMENTED]
- **Type**: Composite (mint address + minimum amount)
- **Status**: ⚠️ Missing
- **Condition**: Only shown when Access Control = "Token Gated"
- **Fields**:
  - Token/NFT Mint Address (required)
  - Minimum Balance (default: 1)
- **Description**: Require users to hold specific token/NFT to access form

---

## Section 6: Session & Runtime Settings

Settings that control form behavior during user interaction.

### 6.1 Start Node [NOT IMPLEMENTED]
- **Type**: Dropdown select (from available nodes)
- **Status**: ⚠️ Missing
- **Required**: Yes
- **Default**: First node created or explicitly marked as "Start"
- **Description**: The first node shown when user opens the Blink
- **Implementation**:
  - Store `startNodeId` in FormMetadata
  - Populate dropdown from existing nodes
  - Validate start node exists and is reachable
- **Related**: Backend GET /api/actions/:formId uses this to initialize

### 6.2 Session Timeout [NOT IMPLEMENTED]
- **Type**: Number input (minutes)
- **Status**: ⚠️ Missing
- **Required**: No
- **Default**: 15 minutes
- **Range**: 5-60 minutes
- **Description**: How long user session remains active in Redis cache
- **Current Implementation**: Hardcoded to 15 minutes (900 seconds)
- **Related Files**: Backend Redis TTL configuration
- **Use Case**: Longer timeouts for complex multi-step forms

### 6.3 Allow Multiple Submissions [NOT IMPLEMENTED]
- **Type**: Toggle (boolean)
- **Status**: ⚠️ Missing
- **Required**: No
- **Default**: false
- **Description**: Whether same wallet can submit form multiple times
- **Implementation**: Check submissions table for existing submission from wallet
- **Use Cases**:
  - false: One-time registration, NFT claims
  - true: Surveys, recurring feedback forms

### 6.4 Show Progress Indicator [NOT IMPLEMENTED]
- **Type**: Toggle (boolean)
- **Status**: ⚠️ Missing
- **Required**: No
- **Default**: true
- **Description**: Display "Step X of Y" progress in Blink UI
- **Implementation**: Calculate total steps from node graph depth

---

## Section 7: Data & Submissions

Settings for managing user responses and submission data.

### 7.1 Store Submissions [NOT IMPLEMENTED]
- **Type**: Toggle (boolean)
- **Status**: ⚠️ Missing
- **Required**: No
- **Default**: true
- **Description**: Whether to save user responses to submissions table
- **Use Cases**:
  - true: Analytics, follow-up, compliance
  - false: Privacy-focused forms, on-chain only verification
- **Implementation**: Conditional INSERT into submissions table

### 7.2 Data Retention Period [NOT IMPLEMENTED]
- **Type**: Dropdown select
- **Status**: ⚠️ Missing
- **Required**: No
- **Default**: "Forever"
- **Options**: 7 days, 30 days, 90 days, 1 year, Forever
- **Description**: How long to retain submission data before auto-deletion
- **Implementation**: Background job to delete old submissions
- **Compliance**: GDPR, privacy regulations

### 7.3 Export Format [NOT IMPLEMENTED]
- **Type**: Multi-select checkboxes
- **Status**: ⚠️ Missing
- **Required**: No
- **Default**: ["JSON"]
- **Options**: JSON, CSV, Excel
- **Description**: Available export formats for submission data
- **Implementation**: Export API endpoint with format parameter

### 7.4 PII (Personally Identifiable Information) Mode [NOT IMPLEMENTED]
- **Type**: Toggle (boolean)
- **Status**: ⚠️ Missing
- **Required**: No
- **Default**: false
- **Description**: When enabled, anonymize submissions (remove wallet addresses)
- **Use Cases**: Anonymous surveys, compliance with privacy regulations
- **Implementation**: Hash or omit user_account in submissions table

---

## Section 8: Transaction Settings

Configuration for blockchain transaction handling and execution.

### 8.1 Enable Transaction Simulation [NOT IMPLEMENTED]
- **Type**: Toggle (boolean)
- **Status**: ⚠️ Missing
- **Required**: No
- **Default**: true
- **Description**: Simulate transactions before presenting to user for signing
- **Current**: Mentioned in spec but not implemented
- **Implementation**: Use Helius RPC `simulateTransaction` before ActionPostResponse
- **Security**: Prevents malformed transactions from reaching user wallet
- **Related**: Technical spec mentions Helius RPC integration

### 8.2 RPC Endpoint [NOT IMPLEMENTED]
- **Type**: Dropdown select or text input
- **Status**: ⚠️ Missing
- **Required**: No
- **Default**: Helius mainnet
- **Options**:
  - Helius (Mainnet/Devnet)
  - QuickNode
  - Alchemy
  - Custom endpoint
- **Description**: Solana RPC endpoint for transaction submission
- **Validation**: Test endpoint connectivity on change
- **Format**: HTTPS URL

### 8.3 Network [NOT IMPLEMENTED]
- **Type**: Dropdown select
- **Status**: ⚠️ Missing
- **Required**: Yes
- **Default**: "mainnet-beta"
- **Options**: mainnet-beta, devnet, testnet
- **Description**: Solana network/cluster for transactions
- **Warning**: Show prominent indicator when not on mainnet
- **Implementation**: Pass to Solana Web3.js Connection

### 8.4 Commitment Level [NOT IMPLEMENTED]
- **Type**: Dropdown select
- **Status**: ⚠️ Missing
- **Required**: No
- **Default**: "confirmed"
- **Options**: processed, confirmed, finalized
- **Description**: Transaction confirmation threshold
- **Recommendation**: "confirmed" for best balance of speed and security

### 8.5 Transaction Memo [NOT IMPLEMENTED]
- **Type**: Text input
- **Status**: ⚠️ Missing
- **Required**: No
- **Max Length**: 566 bytes (Memo instruction limit)
- **Description**: Custom memo to include in all transactions
- **Example**: "Submitted via BlinkForm"
- **Implementation**: Add Memo instruction to transaction

---

## Section 9: Analytics & Notifications

Settings for tracking form performance and receiving submission alerts.

### 9.1 Enable Analytics [NOT IMPLEMENTED]
- **Type**: Toggle (boolean)
- **Status**: ⚠️ Missing
- **Required**: No
- **Default**: true
- **Description**: Track form views, completions, and conversion rates
- **Implementation**: Log events to analytics service
- **Privacy**: Anonymized by default unless PII mode enabled

### 9.2 Webhook URL [NOT IMPLEMENTED]
- **Type**: Text input (URL)
- **Status**: ⚠️ Missing
- **Required**: No
- **Format**: Valid HTTPS URL
- **Description**: POST submission data to custom endpoint on form completion
- **Payload**: JSON with submission data and transaction signature
- **Security**: Include shared secret or signature for verification
- **Use Cases**: CRM integration, custom automation, Discord/Telegram notifications

### 9.3 Email Notifications [NOT IMPLEMENTED]
- **Type**: Text input (email address)
- **Status**: ⚠️ Missing
- **Required**: No
- **Format**: Valid email address
- **Description**: Receive email notification on each form submission
- **Implementation**: Integration with email service (SendGrid, AWS SES)
- **Options**:
  - Immediate (per submission)
  - Daily digest
  - Weekly summary

### 9.4 Discord Webhook [NOT IMPLEMENTED]
- **Type**: Text input (Discord webhook URL)
- **Status**: ⚠️ Missing
- **Required**: No
- **Format**: Discord webhook URL format
- **Description**: Post submission notifications to Discord channel
- **Popular**: Commonly requested for DAO/community forms

---

## Section 10: Advanced Settings

Developer and power user features for advanced customization.

### 10.1 Custom CSS [NOT IMPLEMENTED]
- **Type**: Code editor (CSS)
- **Status**: ⚠️ Missing
- **Required**: No
- **Description**: Custom CSS for form styling in Blink preview
- **Security**: Sanitize to prevent XSS
- **Implementation**: Inject into Blink iframe
- **Use Cases**: Brand matching, custom themes

### 10.2 Custom JavaScript [NOT IMPLEMENTED - FUTURE]
- **Type**: Code editor (JavaScript)
- **Status**: ⚠️ Missing
- **Required**: No
- **Description**: Custom validation logic and dynamic behavior
- **Security**: Sandboxed execution, strict CSP
- **Warning**: Advanced feature with security implications
- **Recommendation**: V2 feature after core stabilization

### 10.3 API Key [NOT IMPLEMENTED]
- **Type**: Read-only text with regenerate button
- **Status**: ⚠️ Missing
- **Required**: No
- **Description**: API key for programmatic form access
- **Use Cases**: Headless form submission, integration testing
- **Security**: Rate limited, scoped to specific form

### 10.4 Debug Mode [NOT IMPLEMENTED]
- **Type**: Toggle (boolean)
- **Status**: ⚠️ Missing
- **Required**: No
- **Default**: false
- **Description**: Enable verbose logging and state inspection
- **Implementation**: Console logs for state transitions, validation errors
- **UI**: Show current node ID, session data in preview

### 10.5 Version History [NOT IMPLEMENTED]
- **Type**: List/Timeline view
- **Status**: ⚠️ Missing
- **Description**: View and restore previous versions of form schema
- **Implementation**: Store schema snapshots on each save with timestamp
- **UI**: Click to preview, "Restore" button for rollback

---

## Settings Summary Table

| Setting | Category | Status | Priority |
|---------|----------|--------|----------|
| Form ID | Identity | ✅ Implemented | Core |
| Form Title | Identity | ✅ Implemented | Core |
| Description | Identity | ✅ Implemented | Core |
| Creator Address | Creator | ✅ Implemented | Core |
| Verify Creator | Creator | ⚠️ Missing | High |
| Blink Icon URL | Branding | ⚠️ Missing | High |
| Blink Label | Branding | ⚠️ Missing | Medium |
| OG Image URL | Branding | ⚠️ Missing | Low |
| Collection Name | NFT | ✅ Implemented | Core |
| Collection Address | NFT | ✅ Implemented | Core |
| Collection Image | NFT | 📝 In Schema | High |
| Collection Description | NFT | ✅ Implemented | Core |
| Royalties | NFT | ✅ Implemented | Core |
| Form Status | Publishing | ⚠️ Missing | Critical |
| Published Date | Publishing | ⚠️ Missing | Medium |
| Expiration Date | Publishing | ⚠️ Missing | Medium |
| Access Control | Publishing | ⚠️ Missing | High |
| Start Node | Runtime | ⚠️ Missing | Critical |
| Session Timeout | Runtime | ⚠️ Missing | Low |
| Multiple Submissions | Runtime | ⚠️ Missing | Medium |
| Progress Indicator | Runtime | ⚠️ Missing | Low |
| Store Submissions | Data | ⚠️ Missing | High |
| Data Retention | Data | ⚠️ Missing | Low |
| Export Format | Data | ⚠️ Missing | Low |
| PII Mode | Data | ⚠️ Missing | Medium |
| Transaction Simulation | Blockchain | ⚠️ Missing | Critical |
| RPC Endpoint | Blockchain | ⚠️ Missing | High |
| Network | Blockchain | ⚠️ Missing | Critical |
| Commitment Level | Blockchain | ⚠️ Missing | Low |
| Transaction Memo | Blockchain | ⚠️ Missing | Low |
| Enable Analytics | Analytics | ⚠️ Missing | Medium |
| Webhook URL | Analytics | ⚠️ Missing | High |
| Email Notifications | Analytics | ⚠️ Missing | Low |
| Discord Webhook | Analytics | ⚠️ Missing | Medium |
| Custom CSS | Advanced | ⚠️ Missing | Low |
| API Key | Advanced | ⚠️ Missing | Low |
| Debug Mode | Advanced | ⚠️ Missing | Low |
| Version History | Advanced | ⚠️ Missing | Low |

**Total: 38 settings**
- ✅ Implemented: 8
- 📝 In Schema: 1
- ⚠️ Missing: 29

---

## Implementation Priority

### Phase 1: Critical MVP (Before Launch)
1. Form Status (Draft/Published)
2. Start Node Selection
3. Network Selection (mainnet/devnet)
4. Transaction Simulation
5. Collection Image URL (expose existing field)

### Phase 2: Production Essentials
6. Verify Creator button
7. Blink Icon URL
8. Access Control (Public/Allowlist)
9. Store Submissions toggle
10. RPC Endpoint selection
11. Webhook URL

### Phase 3: Enhanced Features
12. Expiration Date
13. Multiple Submissions toggle
14. Blink Label customization
15. Email/Discord notifications
16. Token Gate configuration

### Phase 4: Polish & Scale
17. Analytics dashboard
18. Data retention policies
19. Export formats
20. Version history
21. Custom CSS
22. Debug mode

---

## Related Files & Integration Points

### Type Definitions
- `frontend/src/types/schema.ts` - FormMetadata, CollectionSettings interfaces
- `frontend/src/types/nodes.ts` - Node configuration types

### State Management
- `frontend/src/store/slices/metadataSlice.ts` - Form metadata state
- `frontend/src/store/slices/apiSlice.ts` - API and validation logic

### UI Components
- `frontend/src/components/sidebars/RightSidebar.tsx` - Main settings UI
- Future: Create dedicated setting component files for complex inputs

### Backend API
- `backend/src/api/actions/:formId` - Reads form metadata for Blink rendering
- `backend/src/api/forms` - CRUD operations for form metadata

---

## Best Practices

### For Creators
1. **Always verify creator address** - Prevents transaction errors
2. **Set clear form titles** - Improves discoverability
3. **Configure expiration for time-sensitive forms** - Event registrations, sales
4. **Use allowlists for exclusive access** - Token launches, member-only forms
5. **Enable transaction simulation** - Catch errors before user signing

### For Developers
1. **Validate all inputs client-side** - Better UX than server errors
2. **Show helpful error messages** - Guide users to fix issues
3. **Persist settings to localStorage** - Prevent data loss on refresh
4. **Group related settings** - Use collapsible sections for clarity
5. **Show contextual help** - Tooltips for complex settings

### Security Considerations
1. **Validate Solana addresses** - Prevent invalid address submission
2. **Sanitize custom CSS/JS** - Prevent XSS attacks
3. **Rate limit API key usage** - Prevent abuse
4. **Encrypt sensitive webhooks** - Use HTTPS only
5. **Audit permission changes** - Log who modified what settings

---

## Future Enhancements

### Planned Features (V2)
- **Conditional settings** - Show/hide settings based on form content
- **Template presets** - One-click configuration for common use cases
- **Settings import/export** - Share configuration between forms
- **Multi-language support** - Translate form settings
- **A/B testing** - Multiple variations with traffic splitting
- **Collaboration** - Multiple creators with role-based permissions

### Integration Opportunities
- **Dialect registry sync** - Auto-submit to Blinks registry
- **Metaplex integration** - Direct collection management
- **Snapshot governance** - Token-weighted voting forms
- **Jupiter** - Integrated swap nodes with price feeds
- **Magic Eden** - NFT marketplace integration
