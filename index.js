#!/usr/bin/env node
const program = require('commander');
const axios = require('axios');

program
    .version('1.0.0')
    .description('go2web CLI')

program
    .command('u <url>')
    .description('make an HTTP request to URL and print the response')
    .action(url => accessUrl(url))


program
    .command('s <search-term>')
    .description('search the term on google and get top 10 results')
    .action(searchTerm => search(searchTerm))


program.parse(process.argv);

function accessUrl(url) {
    const https = require('https');


    https.get(url, (response) => {
        let data = '';

        response.on('data', (chunck) => {
            data += chunck;
        });

        response.on('end', () => {
            console.log(response);
        });

    }).on('error', (error) => {
        console.log(error);
    })
}

function search(term) {
    const params = {
        access_key: '2f24dd4923e06ebd203b40a40b455d0f',
        query: String(term)
    }
    axios.get('http://api.serpstack.com/search', { params })
        .then(response => {
            const websiteContent = response.data;
            let urls = websiteContent.organic_results.map(item => item.url);
            console.log(urls);
        }).catch(error => {
            console.log(error);
        });
}


