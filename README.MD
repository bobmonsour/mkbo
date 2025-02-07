I often find myself making a copy of an existing entry on my website in order to start a new one. I've also begun to find this a bit annoying. I wanted a more direct, yet streamlined approach to starting a new entry.

I was catalyzed by a video that I watched. The video was created by [DeepanNess](https://deepakness.com/) and here is his [blog post](https://deepakness.com/blog/create-posts-faster-11ty/) about it.

So, I developed this node script to create a file for post, note, or til (today, I learned, linked, or loved) entry on [my personal website](https://bobmonsour.com).

It prompts me to enter a title, from which a filename is generated.
It then prompts for a few 'always present' front matter elements,
as well as some optional elements.

The file is created in the current directory.

I create a symlink to the script in a directory that is in my path, so that I can run it from any directory. For example, the directory /usr/bin/local is in my path, so I create a symlink to the script in that directory.

On macOS, creating a symlink to the script in /usr/local/bin is done with the following command:

```bash
ln -s /path/to/script /usr/local/bin/mkbo
```

Note that 'mkbo' is my name for the script, which stands for 'make an entry for the bobmonsour.com site'. I will likely make one, calling it 'mkbu' for making an entry for the [11ty Bundle site](https://11tybundle.dev).

The example front matter resulting from creating a file named a-test-post.md is shown below. Note that it does not include several optional items that can be added when using the script.

Feel free to adapt this for your own purposes.

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
