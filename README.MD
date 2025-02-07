A node script that I use to create a file for post, note, or til entry.
It prompts the user to enter a title, from which a filename is generated.
It then prompts for a few 'always present' front matter elements,
followed by some optional elements.

The file is created in the current directory.

I create a symlink to the script in a directory that is in my path, so that I can run it from any directory. For example, the directory /usr/bin/local is in my path, so I create a symlink to the script in that directory.

On macOS, creating a symlink to the script in /usr/local/bin is done with the following command:

```bash
ln -s /path/to/script /usr/local/bin/mkbo
```

The example front matter resulting from creating a file named a-test-post.md is shown below. Note that it does not include several optional items that can be added when using the script.

```yaml
  ---
  title: A test post
  description: This is a test post being created as an example of using this tool.
  date: 2025-02-07
  tags: [
    "blogging",
    "personal"
  ]
  image:
    source: a-test-post.jpg
    alt: A blog post being displayed on a laptop
  ---
```
