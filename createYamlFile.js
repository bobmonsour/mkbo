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
			name: "pageHasVideo",
			message: "Page has video?",
			default: false,
		},
		{
			type: "input",
			name: "imageSource",
			message: "Image source:",
			default: (answers) => `${slugify(answers.title, { lower: true })}.jpg`,
		},
		{
			type: "input",
			name: "imageAlt",
			message: "Image alt text:",
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
	if (answers.pageHasVideo) {
		yamlContent += `pageHasVideo: ${answers.pageHasVideo}\n`;
	}
	if (answers.snow) {
		yamlContent += `snow: ${answers.snow}\n`;
	}

	yamlContent += `image:
  source: ${answers.imageSource}
  alt: ${answers.imageAlt}
---`;

	return { yamlContent, slugifiedTitle };
}

async function main() {
	const answers = await promptUser();
	const { yamlContent, slugifiedTitle } = generateYamlContent(answers);

	fs.writeFileSync(`${slugifiedTitle}.md`, yamlContent, "utf8");
	console.log(`File ${slugifiedTitle}.md created successfully!`);
}

main();
