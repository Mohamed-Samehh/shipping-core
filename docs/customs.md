# Customs declarations

International shipments (origin country != destination country, with
exceptions for intra-EU shipments) must carry a `CustomsDeclaration` plus
one `CustomsItem` per line.

## Incoterms

`incoterm` defaults to `DAP` (Delivered At Place). Common alternatives:

| Code | Meaning                              | Who pays duty           |
|------|--------------------------------------|-------------------------|
| DDP  | Delivered Duty Paid                  | Shipper                 |
| DAP  | Delivered At Place                   | Recipient               |
| EXW  | Ex Works                             | Recipient organises shipping |
| FCA  | Free Carrier                         | Recipient (named carrier) |

The customs service rejects declarations whose incoterm doesn't pair with
the shipper-side payment intent.

## HS codes

Each `CustomsItem` carries an HS code via `lib/hs-code`. Validation is
length + numeric only; the library does not enforce that the description
matches the code (carriers do that on their side).
