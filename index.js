#!/usr/bin/env node

const { Select } = require("enquirer");
const { prompt } = require("enquirer");
const maxMinutesObj = { 500: 25, 600: 20, 700: 17, 800: 15 };
Object.freeze(maxMinutesObj);

async function main() {
  const answerWatt = await getWatt();
  const maxMinutes = await maxMinutesObj[`${answerWatt}`];
  const calSeconds =
    Math.round(await getMinutes(maxMinutes)) * 60 +
    Math.round(await getSeconds());
  showConversionTable(answerWatt * calSeconds);
}

async function getWatt() {
  return new Promise((resolve) => {
    const prompt = new Select({
      name: "value",
      message: "Select the wattage of the time you want to enter",
      choices: [
        { title: "500w", value: "500" },
        { title: "600w", value: "600" },
        { title: "700w", value: "700" },
        { title: "800w", value: "800" },
      ],
      result(name) {
        return this.map(name);
      },
    });
    prompt
      .run()
      .then((value) => {
        const answer = Object.entries(value);
        resolve(answer[0][1]);
      })
      .catch(console.error);
  });
}

async function getMinutes(watt) {
  return new Promise((resolve) => {
    const maxNum = watt;
    const promptMinutes = {
      type: "input",
      name: "value",
      message: `Please enter the minutes. ( 0 <= minutes <= ${maxNum}(max) ) `,
      validate(value) {
        if (0 <= value && value <= maxNum) {
          if (Number.isInteger(Number(value))) {
            return true;
          }
          return "please enter an integer";
        }
        return `Please enter between 0 and ${maxNum}`;
      },
    };
    prompt(promptMinutes)
      .then((value) => {
        resolve(value.value);
      })
      .catch(console.error);
  });
}

async function getSeconds() {
  return new Promise((resolve) => {
    const promptSeconds = {
      type: "input",
      name: "value",
      message: "Please enter the seconds. ( 0 <= seconds < 60 )",
      validate(value) {
        if (0 <= value && value < 60) {
          if (Number.isInteger(Number(value))) {
            return true;
          }
          return "please enter an integer";
        }
        return "Please enter between 0 and less than 60";
      },
    };
    prompt(promptSeconds)
      .then((value) => {
        resolve(value.value);
      })
      .catch(console.error);
  });
}

function showConversionTable(wattSeconds) {
  console.log(
    "\n\u001b[32m Microwave heating time conversion table \u001b[36m"
  );
  for (let i = 500; i <= 800; i = i + 100) {
    console.log(
      ` *    ${i}w    ${Math.floor(wattSeconds / i / 60)
        .toString()
        .padStart(2)}min. ${Math.round((wattSeconds / i) % 60)
        .toString()
        .padStart(2)}sec.    *`
    );
  }
}
main();
