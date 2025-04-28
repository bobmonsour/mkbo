#!/usr/bin/env node

// A node script that I use to create a file for post, note, or til entry.
// It prompts the user to enter a title, from which a filename is generated.
// It then prompts for a few 'always present' front matter elements,
// followed by some optional elements.
//
// Example front matter resulting from creating a file named a-test-post.md
//
// The file is created in the current working directory.
//
//  ---
//  title: A test post
//  description: This is a test post being created as an example of using this tool.
//  date: 2025-02-07
//  tags: [
//    "blogging",
//    "personal"
//  ]
//  image:                                          optional
//    source: a-test-post.jpg
//    alt: A blog post being displayed on a laptop  required if 'source'
//    creditPerson: Joe Photog                      optional
//    creditLink: https://linktojoe.com             required if 'creditPerson'
//  ---

import { exec } from "child_process";
import fs from "fs";
import inquirer from "inquirer";
import slugify from "slugify";
import { format } from "date-fns";

const today = format(new Date(), "yyyy-MM-dd");

// Base directory for the entries
const BASE_DIR = "/Users/Bob/Dropbox/Docs/Sites/bobmonsour.com/src/";

async function promptUser() {
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "entryType",
      message: "What type of entry would you like to create?",
      choices: ["Post", "Note", "TIL"],
    },
    {
      type: "input",
      name: "title",
      message: "Title:",
    },
    {
      type: "input",
      name: "date",
      message: "Date (yyyy-mm-dd):",
      default: today,
    },
    {
      type: "input",
      name: "tags",
      message: "Tags (comma-separated):",
    },
    {
      type: "input",
      name: "description",
      message: "Description:",
    },
    {
      type: "confirm",
      name: "pageHasCode",
      message: "Page has code?",
      default: false,
    },
    {
      type: "confirm",
      name: "snow",
      message: "Snow?",
      default: false,
    },
    {
      type: "confirm",
      name: "pageHasYoutube",
      message: "Page has YouTube?",
      default: false,
    },
    {
      type: "confirm",
      name: "hasImage",
      message: "Will there be an image?",
      default: false,
    },
    {
      type: "input",
      name: "imageSource",
      message: "Image source:",
      when: (answers) => answers.hasImage,
      default: (answers) => `${slugify(answers.title, { lower: true })}.jpg`,
    },
    {
      type: "input",
      name: "imageAlt",
      message: "Image alt text:",
      when: (answers) => answers.hasImage && answers.imageSource.trim() !== "",
      validate: (input) =>
        input.trim() !== "" ||
        "Alt text is required if an image source is provided",
    },
    {
      type: "input",
      name: "creditPerson",
      message: "Credit person (leave blank to skip):",
      when: (answers) => answers.hasImage && answers.imageSource.trim() !== "",
    },
    {
      type: "input",
      name: "creditLink",
      message: "Credit link (required if credit person is provided):",
      when: (answers) => answers.hasImage && answers.creditPerson.trim() !== "",
      validate: (input) => {
        const urlPattern = new RegExp(
          "^(https?:\\/\\/)?" + // protocol
            "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
            "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
            "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
            "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
            "(\\#[-a-z\\d_]*)?$",
          "i" // fragment locator
        );
        return urlPattern.test(input) || "Please enter a valid URL";
      },
    },
  ]);

  return answers;
}

function generateYamlContent(answers) {
  const slugifiedTitle = slugify(answers.title, { lower: true });
  const tagsArray = answers.tags
    ? answers.tags.split(",").map((tag) => tag.trim())
    : [];

  let yamlContent = `---
title: ${answers.title}
description: ${answers.description}
date: ${answers.date}
tags: ${JSON.stringify(tagsArray, null, 2)}
`;

  if (answers.pageHasCode) {
    yamlContent += `pageHasCode: ${answers.pageHasCode}\n`;
  }
  if (answers.pageHasYoutube) {
    yamlContent += `pageHasYoutube: ${answers.pageHasYoutube}\n`;
  }
  if (answers.snow) {
    yamlContent += `snow: ${answers.snow}\n`;
  }

  // Only add image-related YAML if hasImage is true
  if (answers.hasImage) {
    if (answers.imageSource.trim() !== "") {
      yamlContent += `image:
  source: ${answers.imageSource}
  alt: ${answers.imageAlt}
`;
      if (answers.creditPerson.trim() !== "") {
        yamlContent += `  creditPerson: ${answers.creditPerson}
  creditLink: ${answers.creditLink}
`;
      }
    }
  }

  yamlContent += `draft: true
---`;

  return { yamlContent, slugifiedTitle };
}

async function main() {
  let answers = await promptUser();
  let { yamlContent, slugifiedTitle } = generateYamlContent(answers);

  // Determine the directory based on the entry type
  const entryTypeToDir = {
    Post: "posts",
    Note: "notes",
    TIL: "til",
  };
  const targetDir = `${BASE_DIR}${entryTypeToDir[answers.entryType]}/`;

  // Ensure the target directory exists
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Write the file to the appropriate directory
  const filePath = `${targetDir}${slugifiedTitle}.md`;
  fs.writeFileSync(filePath, yamlContent, "utf8");
  console.log(`File created successfully at: ${filePath}`);

  // Open the file in VS Code
  exec(`code "${filePath}"`, (error) => {
    if (error) {
      console.error(`Failed to open file in VS Code: ${error.message}`);
    }
  });
}

main();
