---
title: '{{ replace .File.ContentBaseName "-" " " | title }}'
date: {{ .Date }}
# weight: 1
# aliases: ["/first"]
tags: ["tag1", "tag2"]
draft: false
description: "Desc Text."
# canonicalURL: "https://canonical.url/to/page"
cover:
    image: "<image path/url>" # image path/url
    alt: "<alt text>" # alt text
    caption: "<text>" # display caption under cover
    relative: false # when using page bundles set this to true
    hidden: true # only hide on current single page
---
