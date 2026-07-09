# Apple Pay — remaining manual steps

Everything else in this deployment is automated. Apple Pay specifically
needs a few actions only you can take (they require your own Apple
Developer account and identity verification):

1. **Apple Developer account** — enroll if you haven't (developer.apple.com), $99/year.
2. **Create a Merchant ID** under Certificates, Identifiers & Profiles → Identifiers → Merchant IDs.
3. **Domain verification** — Apple gives you a file named
   `apple-developer-merchantid-domain-association`. Place it at:
   `moyasar-backend/public/.well-known/apple-developer-merchantid-domain-association`
   on the server, then it's served automatically (server.js already serves
   `public/` as static files, and nginx/deploy.sh already route
   `/.well-known/...` through to it).
4. **Register the same domain** in your Moyasar dashboard's Apple Pay settings.
5. **Merchant validation endpoint** — `checkout.jsx`'s `handleApplePay()` is
   currently a scaffold. Wiring the real `ApplePaySession` flow needs a
   backend route that proxies Moyasar's merchant-validation call. Check
   Moyasar's current Apple Pay docs for the exact request/response shape
   before implementing this — it's the one integration detail worth
   confirming fresh rather than relying on a possibly-outdated spec.
6. Test only on real HTTPS domains with Safari — Apple Pay does not work
   on localhost, IP addresses, or non-Safari browsers for card entry.
