# robots.txt

## কী?

`robots.txt` web crawler-কে কোন resource crawl/index করা উচিত বা উচিত নয় সে বিষয়ে instruction দেয়।

## Enumeration-এ কেন দেখতে হবে?

`robots.txt`-এ private বা non-public resource-এর path উল্লেখ থাকতে পারে। তাই এটি web enumeration-এর একটি useful clue source।

## Example

Source-এর example-এ:

```text
/private
/uploaded_files
```

এর মতো disallowed entry দেখা যায়।

এরপর:

```text
http://10.10.10.121/private
```

visit করলে HTB admin login page পাওয়া যায়।

## Mindset

`robots.txt` কোনো security boundary নয়। এটি crawler-এর জন্য instruction; কিন্তু enumeration-এর সময় এর contents target-এর internal URL structure সম্পর্কে clue দিতে পারে।

## Simple Flow

```text
Target
  ↓
/robots.txt
  ↓
Disallowed paths
  ↓
Potentially interesting resources
  ↓
Further investigation
```
