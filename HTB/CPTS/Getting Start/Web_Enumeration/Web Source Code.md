# Web Source Code

## কী?

Web page-এর HTML/source code inspect করা web enumeration-এর একটি basic কিন্তু useful step।

Browser-এ সাধারণভাবে:

```text
CTRL + U
```

দিয়ে page source দেখা যায়।

## কী খুঁজব?

এই section-এর example দেখায় যে source code-এর developer comments-এর মধ্যে test-account credentials accidentally exposed থাকতে পারে।

তাই source code inspect করার সময়:

- Developer comments
- Metadata
- Unexpected information
- Accidentally exposed credentials

এর মতো জিনিসের দিকে নজর দেওয়া useful।

## Example Flow

```text
Web Page
   ↓
View Source
   ↓
HTML / Comments / Metadata
   ↓
Interesting Information
   ↓
Further Investigation
```

> এই section source-code inspection-এর basic approach দেখিয়েছে; কোনো specific source-code exploitation technique এখানে দেওয়া হয়নি।
