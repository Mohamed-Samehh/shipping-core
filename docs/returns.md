# Returns

A return is an inbound shipment created in response to a customer dispute
on an outbound shipment.

## Lifecycle

```
   requested -> approved -> shipped -> received -> closed
        |
        v
     rejected (terminal)
```

`Return` entities reference both the original outbound shipment and an
inbound return shipment (created lazily when the return is approved).

## Reasons

`Return.reason` follows a fixed enum:

- `damaged` -- product arrived damaged.
- `wrong_item` -- product does not match the order.
- `not_as_described` -- product differs from listing description.
- `changed_mind` -- buyer-side reversal within return window.
- `late_delivery` -- shipment arrived after promised date.
- `no_longer_needed` -- buyer no longer requires the item.
- `defective` -- product malfunctions out of the box.
- `other` -- free-form note in `reasonNote`.

## Refund

`Return.refundAmount` records the refund the merchant decides to issue.
shipping-core does not move money itself -- the merchant integrates with
their billing system to issue the refund. The amount is captured here for
the audit log only.

## Closing

`closed` is the terminal state. Once closed, the return cannot be
re-opened; raising the same dispute again requires a new `Return`
record.
