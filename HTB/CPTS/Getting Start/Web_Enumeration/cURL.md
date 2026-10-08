# cURL

## কী?

`cURL` command line থেকে web server-এর সঙ্গে HTTP/HTTPS request করার জন্য ব্যবহৃত একটি tool। এই section-এ এটি **web server headers / banner grabbing**-এর জন্য ব্যবহার করা হয়েছে।

## Header Check

### Command

```bash
curl -IL https://www.inlanefreight.com
```

### Breakdown

| Option | কাজ |
|---|---|
| `-I` | Headers দেখার জন্য ব্যবহার করা হয় |
| `-L` | Redirect follow করার জন্য ব্যবহার করা হয় |

## Example Output

```text
HTTP/1.1 200 OK
Server: Apache/2.4.29 (Ubuntu)
Content-Type: text/html; charset=UTF-8
```

এখান থেকে `Server` header-এর মাধ্যমে Apache এবং version-এর মতো information পাওয়া যায়।

## কেন useful?

Headers থেকে source অনুযায়ী:

- Web server সম্পর্কে clue
- Application/framework সম্পর্কে clue
- Authentication options সম্পর্কে clue
- Security options বা misconfiguration সম্পর্কে clue

পাওয়া যেতে পারে।

> এই section `cURL`-এর অনেক options-এর মধ্যে শুধু header/banner grabbing-এর relevant usage দেখিয়েছে।
