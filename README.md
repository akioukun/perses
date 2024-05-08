# perses
Simple Subdomain fetcher using SecurityTrails API.

## Installation
Github:
```
git clone https://github.com/akioukun/perses
```

NpmJS:
```
npm i chalk chalk-animation nanospinner dotenv
```

## Usage
```
node index.js <domain> <output_file> [API_KEY]
```
NOTE: You must declare the API_KEY either in .env or as an argument. Passing it as an argument will overwrite the API_KEY in the environment.

## Options:
```
Options:
  domain                The domain to fetch subdomains for.
  output_file           The file to write subdomains to.
  API_KEY               Your SecurityTrails API key. (Optional if already declared in .env)
```

## License
MIT © akioukun
