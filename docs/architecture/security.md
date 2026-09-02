# Security & Trust Architecture

## Rural-Centric Security Model

1. **OTP & Phone-First Authentication**:
   - Secure OTP verification via SMS / WhatsApp gateways.
   - Rate-limited generation and brute-force protection.
   - Stateless JWT tokens with refresh rotation.

2. **Progressive 5-Tier Verification System**:
   - **Tier 0**: Phone OTP verification.
   - **Tier 1**: Government Identity (Aadhaar / Voter ID) verification.
   - **Tier 2**: Equipment & Registration Document verification (RC book / Dealer License).
   - **Tier 3**: Work History Verification ($\ge 10$ platform jobs completed).
   - **Tier 4**: Trusted Gold Provider ($\ge 30$ completed jobs, rating $\ge 4.7$, $0$ unresolved disputes).

3. **Escrow-Backed Milestone Payments**:
   - Upfront booking commitment locked in escrow.
   - Provider funds released only after GPS-validated work completion and farmer digital acknowledgement.
   - Built-in dispute hold mechanism.

4. **Data Privacy & Rural Compliance**:
   - Sensitive documents stored encrypted in object storage.
   - Restrictive agricultural chemical trade compliance (unlicensed P2P chemical sales strictly blocked).
