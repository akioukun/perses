#!/usr/bin/env node
"use strict";
// ******************************************************************
//       /\ /|       @file       index.js
//       \ V/        @brief      子域名枚举器
//       | "")       @author     akioukun (hk4er), akiokun@hoyostaff.com
//       /  |                    
//      /  \\        @Modified   2024-05-06
//    *(__\_\     

// imports 
import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';
import fs from 'fs';
import { createSpinner } from 'nanospinner';

const args = process.argv.slice(2)

const sleep = (ms = 2000 ) => new Promise((r) => setTimeout(r, ms));

function displayHelp() {
    console.log(chalk.yellow("Usage:"));
    console.log(chalk.yellow("  node index.js <domain> <output_file> [API_KEY]"));
    console.log(chalk.yellow("\nOptions:"));
    console.log(chalk.yellow("  domain\t\tThe domain to fetch subdomains for."));
    console.log(chalk.yellow("  output_file\t\tThe file to write subdomains to."));
    console.log(chalk.yellow("  API_KEY\t\tYour SecurityTrails API key."));
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

if (args.length !== 3) {
    displayError("Incorrect number of arguments.");
}

async function greet() {
    const title = chalkAnimation.rainbow(
        'perses - a subdomain utility using securitytrails api'
    );
    await sleep();
}

const getSubdomains = async (domain) => {
    const options = {
        method: 'GET',
        headers: {accept: 'application/json', APIKEY: args[2]}
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

(async () => {
    const spinner = createSpinner(chalk.bgMagentaBright('fetching subdomains...')).start();
    try {
        await sleep();
        const t = await getSubdomains(args[0]);
        const formattedData = Object.values(t).map(subdomain => `${subdomain}.${args[0]}`).join("\n");
        fs.writeFile(args[1], formattedData, (err) => {
            if (err) {
                spinner.error();
                console.log(chalk.bgRedBright(err.message));
                process.exit(1);
                return;
            }
            spinner.success();
            console.log(chalk.bgGreenBright('subdomains have been exported successfully.'));
        });
    } catch (error) {
        spinner.error();
        console.log(chalk.bgRedBright(error.message));
        process.exit(1);
    }})();