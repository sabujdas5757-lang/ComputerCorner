# Security Specification - Computer Corner

## 1. Data Invariants
- A Product must have a valid Name, Brand, Category, Price, and Image.
- Only Admins can Create, Update, or Delete Categories, Brands, and Products.
- Public can Read (List/Get) Categories, Brands, and Products.
- Admins are identified by their UID being present in the `/admins/` collection.

## 2. The "Dirty Dozen" Payloads (Red Team Test Cases)
1. **Unauthorized Create**: Trying to create a product as a non-signed-in user.
2. **Unauthorized Update**: Trying to update a product as a signed-in non-admin user.
3. **ID Poisoning**: Creating a product with a 2KB string as ID.
4. **Shadow Update**: Updating a product with an extra `isVerified: true` field not in the schema.
5. **Type Mismatch**: Setting `price` to a number instead of a string.
6. **Size Exhaustion**: Setting `description` to 2MB of text.
7. **Identity Spoofing**: Trying to set `authorId` to someone else (if applicable).
8. **Malicious Query**: Listing products without the required relational filters (if rules enforce them).
9. **Unverified Email**: Trying to perform admin actions with an unverified email.
10. **Orphaned Record**: Creating a product with a category ID that doesn't exist.
11. **State Shortcut**: Changing a product's terminal state directly.
12. **PII Leak**: Accessing an `admins` document from a non-admin account.

## 3. The Test Runner (Conceptual)
`firestore.rules.test.ts` (implied tests for these cases).
