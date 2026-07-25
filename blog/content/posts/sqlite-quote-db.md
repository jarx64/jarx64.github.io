---
title: 'SQLite Quote Database That I Use for My Lockscreen'
date: 2024-10-22T19:25:07+06:00
# weight: 1
# aliases: ["/first"]
tags: ["jq", "sed", "sqlite", "bash"]
draft: false
description: "Personal quote database locally for my lockscreen."
# canonicalURL: "https://canonical.url/to/page"
cover:
    image: "<image path/url>" # image path/url
    alt: "<alt text>" # alt text
    caption: "<text>" # display caption under cover
    relative: false # when using page bundles set this to true
    hidden: true # only hide on current single page
---

I've been using [Zen Quotes API](https://zenquotes.io/) for a while now. It's a great app that provides quotes for my lockscreen. But I was unable to filter based on author. So I decided to create my own personal quote API.

First I needed a source of quotes. I found datasets of quotes on Kaggle [Quotes Dataset](https://www.kaggle.com/datasets/akmittal/quotes-dataset) and [Quotes-500K](https://www.kaggle.com/datasets/manann/quotes-500k). I think these datasets were created by scraping the web for quotes.

## The Plan
- Create `sqlite` database to store quotes.
- Create table `quotes` with columns `quote`, `author`, `tags`.
- Import quotes from the dataset.
- Perform READ operations on the database.
easy peasy.

## The Implementation
The problem is that one dataset is in `csv` format and the other is in `json` format. We need a common format to import the quotes into the database. I decided to convert the `json` dataset to `csv` format. Time to flex my command-line-fu.

First, I opened the `csv` dataset in `LibreOffice Calc` and replaced `', '` with `' '` in `categories` column. Then renamed `categories` to `tags`. Saved the file as `quotes.csv`.

Next, I converted the `json` dataset to `csv` using shitty bash-fu.
```bash
jq '.[] | "\(.Quote)<merge>, \(.Author)<merge>, \(.Tags | join(" "))"' quotes.json \
| sed "s/<merge>, /\", \"/g" \
| sed -z "s/ \"\n/\"\n/g" >> quotes.csv
```
- `.[]` selects each object in the array.
- `"\(.Quote)<merge>, \(.Author)<merge>, \(.Tags | join(" "))"` formats the output as `quote, author, tags`. *I could not find a way to insert double quotes around the fields in `jq`. So I used <merge> keyword to replace with `", "` later.*🤪
- `sed "s/<merge>, /\", \"/g"` replaces `<merge>, ` with `", `.
- `sed -z "s/ \"\n/\"\n/g"` removes the trailing space before newline.

Now I have a `csv` file with quotes. Time to create the database.
```bash
sqlite3 ~/playground/quotes/quotes.db
```

```sql
-- Create a database to store quotes.
CREATE TABLE quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quote TEXT,
    author TEXT,
    tags TEXT
);

-- Import quotes from the `csv` file.
.mode csv
.import quotes.csv quotes

-- Let's count the number of quotes in the database.
SELECT COUNT(*) FROM quotes;
-- 548102 😎
```

Get a random quote
```bash
sqlite3 ~/playground/quotes/quotes.db "SELECT quote FROM quotes ORDER BY RANDOM() LIMIT 1;"
```

Get a random quote from 'Socrates'
```bash
sqlite3 ~/playground/quotes/quotes.db "SELECT quote FROM quotes WHERE author LIKE '%socrates%' ORDER BY RANDOM() LIMIT 1;"
```

Now I can get personalized quotes for my lockscreen.
```bash
#!/usr/bin/env bash

get_quote() {
    sqlite3 -separator " - " ~/playground/quotes/quotes.db \
        "SELECT quote, REPLACE(author, '\"', '') AS author FROM quotes \
        WHERE ( \
                  author LIKE '%socrates%' \
            OR    author LIKE '%plato%' \
            OR    author LIKE '%aristotle%' \
            OR    author LIKE '%seneca%' \
            OR    author LIKE '%epictetus%' \
            OR    author LIKE '%marcus aurelius%' \
            OR    author LIKE '%montaigne%' \
            OR    author LIKE '%schopenhauer%' \
            OR    author LIKE '%nietzsche%' \
            OR    author LIKE '%diogenes%' \
            OR    author LIKE '%kierkegaard%' \
            OR    author LIKE '%pythagoras%' \
        ) \
        AND LENGTH(quote) < 100 \
        ORDER BY RANDOM() LIMIT 1;"
}

if [ ! -f /tmp/__quote_data ]; then
    get_quote > /tmp/__quote_data
fi

if [ $(find /tmp/__quote_data -mmin +1) ]; then
    previous_quote_data=$(cat /tmp/__quote_data)
    rm /tmp/__quote_data
    get_quote > /tmp/__quote_data
fi

quote_data=$(cat /tmp/__quote_data)

echo "📜 $quote_data"
```