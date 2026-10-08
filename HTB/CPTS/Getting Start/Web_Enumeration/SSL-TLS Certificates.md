# SSL/TLS Certificates

## কী?

HTTPS ব্যবহার করা web server-এর SSL/TLS certificate একটি useful information source হতে পারে।

## কী ধরনের Information পাওয়া যেতে পারে?

এই section অনুযায়ী certificate থেকে:

- Email address
- Company/organization name
- Subject information
- Issuer information
- Country/state/locality-related details

এর মতো information দেখা যেতে পারে।

## Enumeration-এ কেন useful?

Certificate-এর organization-related information target সম্পর্কে additional context দিতে পারে।

Source আরও উল্লেখ করে যে assessment-এর scope-এর মধ্যে থাকলে এই ধরনের information social engineering/phishing assessment-এর জন্য relevant হতে পারে।

## Simple Workflow

```text
HTTPS Target
    ↓
Certificate View
    ↓
Subject / Issuer / Organization details
    ↓
Additional Reconnaissance Information
```

এই section certificate-এর কোনো command-line extraction command দেয়নি; তাই এখানে শুধু source-supported concept রাখা হয়েছে।
