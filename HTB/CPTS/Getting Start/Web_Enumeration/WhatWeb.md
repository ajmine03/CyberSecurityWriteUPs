# WhatWeb

## কী?

`WhatWeb` একটি command-line technology fingerprinting tool। এটি web server, supporting frameworks এবং applications সম্পর্কে information বের করতে পারে।

এই information পরে technology-specific vulnerability research-এর starting point হতে পারে।

---

## Single Target

```bash
whatweb 10.10.10.121
```

Example output থেকে source-এ পাওয়া যায়:

```text
Apache[2.4.41]
Ubuntu Linux
PHP 7.4.3
```

অর্থাৎ target কোন ধরনের web technology ব্যবহার করছে তার ধারণা পাওয়া যায়।

---

## Network Range

```bash
whatweb --no-errors 10.10.10.0/24
```

### `--no-errors`

Source-এর example-এ এই option ব্যবহার করে network range-এর web targets enumerate করা হয়েছে এবং error output না দেখিয়ে results পাওয়া গেছে।

Example results-এর মধ্যে বিভিন্ন host-এর:

- HTTP server
- Technology
- IP
- Page title
- Framework/library

এর মতো information দেখা যায়।

---

## সহজভাবে

```text
Target
  ↓
WhatWeb
  ↓
Technology Fingerprint
  ↓
Potentially relevant investigation
```

`WhatWeb` নিজে vulnerability exploit করার tool হিসেবে এই section-এ উপস্থাপিত হয়নি; বরং technology identification-এর tool হিসেবে ব্যবহৃত হয়েছে।
