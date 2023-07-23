const fs = require('fs')
const https = require('https');
const cheerio = require('cheerio')
require('dotenv').config()

var request = require('request');

class SteamGameInfo {
	personalGameInfo = [];

	wait(s) {
    	return new Promise(resolve =>setTimeout(() => resolve(), s * 1000));
	};

	async requestBase(options) {
		return new Promise((resolve, reject) => {
			request(options, (error, response, body) => {
				if (error) {
					console.log(error)
					reject(error);
				} else {
					resolve(response)
				}
			});
		});
	}

	async requestJson(url) {
		for(let i =0; i<3;i++) {
			try {
				console.debug('retry time: '+i)
				let res = await this.requestBase(url)
				if (res.statusCode == 200) {
					return JSON.parse(res.body);
				}
			} catch (error) {
				console.log(error);		
			}
			await this.wait(3)
		}
		throw new Error('request failed')
	}

	async getOwnedGames() {
		var options = {
			'method': 'GET',
			'url': `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_KEY}&steamid=${process.env.STEAM_ID}&format=json&include_appinfo=true`,
			'headers': {
				'Accept': 'application/json'
			}
		};

		let jsonBody = await this.requestJson(options);
		const games = jsonBody.response.games;

		// 提取每个游戏的 appid、name 和 playtime_forever，生成新的对象数组
		const extractedData = games.map(game => {
			const { appid, name, playtime_forever } = game;
			return { appid, name, playtime_forever };
		});

		this.personalGameInfo = extractedData
		return true;
	}

	async getGameDeatails() {
		let jobArr = []
		for (let game of this.personalGameInfo) {
			console.log(game)
			var options = {
				'method': 'GET',
				'url': `https://store.steampowered.com/api/appdetails/?appids=${game.appid}`,
				'headers': {
					'Cookie': 'browserid=3021402653685138588; steamCountry=HK%7C261f8d9a4c92df727dd7424a1c9f56c4'
				}
			};
			jobArr.push(this.requestJson(options)); 
		}
		
		const res =  await Promise.all(jobArr)

		for (let i = 0; i < this.personalGameInfo.length; i++) {
			let gameDetails = res[i];
			let game = this.personalGameInfo[i];
			if (gameDetails[game.appid]['success'] === true) {
				game.header_image = gameDetails[game.appid].data.header_image;
				console.log(game)
			}
		}
	}
}

async function main() {
	let gameInfo = new SteamGameInfo();
	await gameInfo.getOwnedGames()
	await gameInfo.getGameDeatails();

	const content = `const map = ${JSON.stringify(gameInfo.personalGameInfo)}\nmodule.exports = map`
	let filepath = './scripts/gameInfo.js'
    fs.truncateSync(filepath, 0);
    console.log(filepath)
    fs.writeFileSync(filepath, content);
}

main()
