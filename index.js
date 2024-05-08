#!/usr/bin/env node
"use strict";
// ******************************************************************
//       /\ /|       @file       index.js
//       \ V/        @brief      子域名枚举器
//       | "")       @author     akioukun (hk4er), akiokun@hoyostaff.com
//       /  |                    
//      /  \\        @Modified   2024-05-08
//    *(__\_\     

// imports 
import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';
import fs from 'fs';
import { createSpinner } from 'nanospinner';
import 'dotenv/config'
import { configDotenv } from 'dotenv';

const args = process.argv.slice(2)
const sleep = (ms = 2000 ) => new Promise((r) => setTimeout(r, ms));
const apiKey = process.env.SECURITYTRAILS_API_KEY;

async function checkApiKey() {
    const providedKey = args[2];
    if (!providedKey) {
        if (!apiKey || apiKey.length !== 32) {
            console.log(chalk.red("No valid API key provided. ( Check .env )"));
            process.exit(1);
        }
        return apiKey;
    }
    if (providedKey.length !== 32) {
        console.log(chalk.red("Invalid API key format. ( Check arguments )"));
        process.exit(1);
    }
    fs.writeFileSync(".env", "SECURITYTRAILS_API_KEY=" + providedKey);
    return providedKey;
}

function displayHelp() {
    console.log(chalk.yellow("Usage:"));
    console.log(chalk.yellow("  node index.js <domain> <output_file> [API_KEY]"));
    console.log(chalk.yellow("\nOptions:"));
    console.log(chalk.yellow("  domain\t\tThe domain to fetch subdomains for."));
    console.log(chalk.yellow("  output_file\t\tThe file to write subdomains to."));
    console.log(chalk.yellow("  API_KEY\t\tYour SecurityTrails API key. (Optional if already declared in .env)"));
}

function displayError(message) {
    console.error(chalk.red("Error: " + message));
    console.error(chalk.red("Try running `node index.js -h` for help."));
    process.exit(1);
}

if (args.length === 1 && args[0] === "-h") {
    displayHelp();
    process.exit(0);
}

if (args.length < 2) {
    displayError("Incorrect number of arguments.");
}else if(args.length > 3 ){
    console.log(chalk.red("Invalid amount of arguments!"))
    process.exit(1);
}

async function greet() {
    const title = chalkAnimation.rainbow(
        'perses - a subdomain utility using securitytrails api'
    );
    await sleep();
}

const getSubdomains = async (domain, newApiKey) => {
    const options = {
        method: 'GET',
        headers: {accept: 'application/json', APIKEY: newApiKey}
    };
    try {
        const response = await fetch('https://api.securitytrails.com/v1/domain/' + domain + '/subdomains?children_only=false&include_inactive=true', options);
        if (!response.ok) {
            throw new Error('Invalid API key or other network error');
        }
        let datajson = await response.json();
        const subdomains = datajson.subdomains;
        
        const subDic = {}; //sus name

        subdomains.forEach((value, index) => {
            subDic[index] = value;
        });
        return subDic;
    } catch (error) {
        throw new Error(error.message);
    }
}

await greet();
const newApiKey = await checkApiKey();

(async () => {
    const spinner = createSpinner(chalk.bgMagentaBright('fetching subdomains...')).start();
    try {
        await sleep();
        const t = await getSubdomains(args[0], newApiKey);
        const formattedData = Object.values(t).map(subdomain => `${subdomain}.${args[0]}`).join("\n");
        fs.writeFile(args[1], formattedData, (err) => {
            if (err) {
                spinner.error();
                console.log(chalk.red(err.message));
                process.exit(1);
            }
            spinner.success();
            console.log(chalk.green('subdomains have been exported successfully.'));
        });
    } catch (error) {
        spinner.error();
        console.log(chalk.red(error.message));
        process.exit(1);
    }})();