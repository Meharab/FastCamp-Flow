/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')([
	'@decentology/web3modal',
	'@decentology/unstated-next',
	'@decentology/hyperverse',
	'@decentology/hyperverse-flow',
	'@decentology/hyperverse-flow-tribes',
]);

module.exports = withTM({
	reactStrictMode: true,
	images: {
		domains: ['ipfs.infura.io'],
	},
});
