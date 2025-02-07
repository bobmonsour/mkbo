#!/usr/bin/env node

// A node script that I use to create a file for post, note, or til entry.
// It prompts the user to enter a title, from which a filename is generated.
// It then prompts for a few 'always present' front matter elements,
// followed by some optional elements.
//
// Example front matter resulting from creating a file named a-test-post.md
//
//  ---
//  title: A test post
//  description: This is a test post being created as an example of using this tool.
//  date: 2025-02-07
//  tags: [
//    "blogging",
//    "personal"
//  ]
//  image:
//    source: a-test-post.jpg
//    alt: A blog post being displayed on a laptop
//  ---

import fs from "fs";
import inquirer from "inquirer";
import slugify from "slugify";
import { format } from "date-fns";

const today = format(new Date(), "yyyy-MM-dd");

async function promptUser() {
	const answers = await inquirer.prompt([
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
			message: "Page has video?",
			default: false,
		},
		{
			type: "input",
			name: "imageSource",
			message: "Image source (leave blank to skip):",
			default: (answers) => `${slugify(answers.title, { lower: true })}.jpg`,
		},
		{
			type: "input",
			name: "imageAlt",
			message: "Image alt text:",
			when: (answers) => answers.imageSource.trim() !== "",
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
		yamlContent += `pageHapageHasYoutubesVideo: ${answers.pageHasYoutube}\n`;
	}
	if (answers.snow) {
		yamlContent += `snow: ${answers.snow}\n`;
	}
	if (answers.imageSource.trim() !== "") {
		yamlContent += `image:
  source: ${answers.imageSource}
  alt: ${answers.imageAlt || ""}
`;
	}

	yamlContent += `---`;

	return { yamlContent, slugifiedTitle };
}

async function confirmOrEditYaml(yamlContent, answers) {
	let accept = false;

	while (!accept) {
		console.log("Generated YAML content:");
		console.log(yamlContent);

		const response = await inquirer.prompt([
			{
				type: "confirm",
				name: "accept",
				message: "Do you accept the generated YAML content?",
				default: true,
			},
		]);

		accept = response.accept;

		if (!accept) {
			answers = await inquirer.prompt([
				{
					type: "input",
					name: "title",
					message: "Title:",
					default: answers.title,
				},
				{
					type: "input",
					name: "date",
					message: "Date (yyyy-mm-dd):",
					default: answers.date,
				},
				{
					type: "input",
					name: "tags",
					message: "Tags (comma-separated):",
					default: answers.tags,
				},
				{
					type: "input",
					name: "description",
					message: "Description:",
					default: answers.description,
				},
				{
					type: "confirm",
					name: "pageHasCode",
					message: "Page has code?",
					default: answers.pageHasCode,
				},
				{
					type: "confirm",
					name: "snow",
					message: "Snow?",
					default: answers.snow,
				},
				{
					type: "confirm",
					name: "pageHasYoutube",
					message: "Page has video?",
					default: answers.pageHasYoutube,
				},
				{
					type: "input",
					name: "imageSource",
					message: "Image source (leave blank to skip):",
					default: answers.imageSource,
				},
				{
					type: "input",
					name: "imageAlt",
					message: "Image alt text:",
					default: answers.imageAlt,
					when: (answers) => answers.imageSource.trim() !== "",
				},
			]);

			const result = generateYamlContent(answers);
			yamlContent = result.yamlContent;
		}
	}

	return answers;
}

async function main() {
	let answers = await promptUser();
	let { yamlContent, slugifiedTitle } = generateYamlContent(answers);

	answers = await confirmOrEditYaml(yamlContent, answers);
	({ yamlContent, slugifiedTitle } = generateYamlContent(answers));

	fs.writeFileSync(`${slugifiedTitle}.md`, yamlContent, "utf8");
	console.log(`File ${slugifiedTitle}.md created successfully!`);
}

main();
