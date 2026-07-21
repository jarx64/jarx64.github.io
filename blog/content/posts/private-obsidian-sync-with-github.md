---
title: 'Private Obsidian Sync with GitHub for my Linux and Android'
date: 2024-09-17T21:37:41+06:00
# weight: 1
# aliases: ["/first"]
tags: ["obsidian", "private-notes", "git", "github", "bash"]
draft: false
description: "Notes on how I sync my private Obsidian notes with Private GitHub repository for my Linux and Android devices."
# canonicalURL: "https://canonical.url/to/page"
cover:
    image: "<image path/url>" # image path/url
    alt: "<alt text>" # alt text
    caption: "<text>" # display caption under cover
    relative: false # when using page bundles set this to true
    hidden: true # only hide on current single page
---

Obsidian is a great note-taking app that I use for my personal notes. I have been using it for a while now and I have a lot of notes that I want to keep private. I also want to sync my notes across my Linux and Android devices.

First I initialized a git repository in my Obsidian vault folder. And pushed it to a private GitHub repository `git@github.com:jarx64/obsidian-vault.git`

A typical obsidian vault has `.obsidian` folder that contains the configuration and metadata of the vault. I have created a bash script `sync.sh` that will sync the vault with the GitHub repository.

contents of `sync.sh`:
```bash
#!/usr/bin/env bash

# get directory of this script and cd to ../
cd "$(dirname $(dirname ${BASH_SOURCE[0]}))"

echo "[+] pulling from remote..."
git pull
echo ""

if [ -n "$(git status --porcelain)" ]; then
  echo "[+] changes detected, pushing to remote..."
  git status
  echo ""
  git add .
  git commit -m "sync client: $(whoami)@$(hostname)=>$(uname -o)"
  echo ""
  git push
  echo ""
else
  echo "no changes to push."
fi
```
`cd "$(dirname $(dirname ${BASH_SOURCE[0]}))"` will cd to the directory of the vault. So, I can run the script from anywhere.
I don't care about the commit messages, so I just use the `id, hostname and the OS name` as the commit message. So, I can see which device made the last change.

In my Linux `.zshrc` I have added an alias to run the script:
```bash
obsidian-sync() {
  bash ~/obsidian_vault/.obsidian/sync.sh
}
```
Now I can run `obsidian-sync` from anywhere to sync my notes.

In android, I use `Termux` and `git` to sync my notes. I have set up my git credentials in `Termux` and cloned the repository. I cloned the repository in the `~/storage/shared/obsidian/.obsidian-vault` folder. the directory starts with `.` so it is hidden in the android file manager and gallery apps.

In my `Termux` `.zshrc` I have added an alias to run the script:
```bash
obsidian-sync() {
  bash ~/storage/shared/obsidian/.obsidian-vault/.obsidian/sync.sh
}
```

There was some hiccup with *safe directory* in `Termux` so I had to use the `~/storage/shared/obsidian/.obsidian-vault` directory. So, I ran:
```bash
git config --global --add safe.directory /storage/shared/obsidian/.obsidian-vault
```

Now I can run `obsidian-sync` from anywhere in `Termux` to sync my notes.