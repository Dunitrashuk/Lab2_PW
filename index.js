#!/usr/bin/env node
const program = require('commander');
const axios = require('axios');
const net = require('net');
const tls = require('tls');

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

program
    .command('surprise')
    .description('open surprise')
    .action(() => surprise())

program
    .command('h')
    .description('show help')
    .action(() => help())


program.parse(process.argv);

function accessUrl(url) {

    const a = new URL(url)

    let host = a.host,
        path = a.pathname + a.search,
        port = 443,
        socket = tls.connect(port, host, function () {
            let request = "GET " + path + " HTTP/1.1\r\nHost: " + host + "\r\n\r\n",
                rawResponse = "";

            socket.end(request);
            socket.setEncoding('utf-8');
            socket.on('data', function (chunk) {
                rawResponse += chunk;
            });
            socket.on('error', function (error) {
                console.log(error);
            })
            socket.on('end', function () {
                console.log(rawResponse);
            });
        })
}

function search(term) {

    // const a = new URL("http://api.serpstack.com/search?access_key=2f24dd4923e06ebd203b40a40b455d0f&type=web&query=" + term);

    // let host = a.host,
    //     path = a.pathname + a.search,
    //     port = 443;

    // socket = net.connect(port, host, function () {
    //     let request = "GET " + path + " HTTP/1.1\r\nHost: " + host + "\r\n\r\n",
    //         rawResponse = "";

    //     socket.end(request);
    //     socket.setEncoding('utf-8');
    //     socket.on('data', function (chunk) {
    //         rawResponse += chunk;
    //     });
    //     socket.on('error', function (error) {
    //         console.log(error);
    //     })
    //     socket.on('end', function () {
    //         console.log(rawResponse);
    //     });
    // })
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

function surprise() {
    let open = require('open');
    open('https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley');
}

function help() {
    console.log("u <url> - make an HTTP request to URL and print the response");
    console.log("s <search-term> - search the term on google and get top 10 results");
    console.log("surprise - open surprise");
    console.log("h - show help");
}

