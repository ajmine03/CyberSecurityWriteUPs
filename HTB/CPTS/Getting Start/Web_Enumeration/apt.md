# APT

## এই Section-এ APT-এর ব্যবহার

`APT` package manager ব্যবহার করে `SecLists` install করার একটি method দেখানো হয়েছে।

### Command

```bash
sudo apt install seclists -y
```

## Command Breakdown

| Part | কাজ |
|---|---|
| `sudo` | Elevated privileges দিয়ে command চালায় |
| `apt` | Debian/Ubuntu package management command |
| `install` | Package install করে |
| `seclists` | Install করার package |
| `-y` | Installation confirmation automatically accept করার option |

## Alternative

Source একই purpose-এর জন্য Git clone method-ও দিয়েছে:

```bash
git clone https://github.com/danielmiessler/SecLists
```

অর্থাৎ SecLists সংগ্রহের দুটি source-provided পথ আছে।
