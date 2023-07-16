const https = require('https');
const cheerio = require('cheerio')
require('dotenv').config()

var request = require('request');

class SteamGameInfo {
	personalGameInfo = [];
	async requestJson(options) {
		return new Promise((resolve, reject) => {
			request(options, (error, response, body) => {
				if (error) {
					console.log(error)
					reject(error);
				} else {
					let jsonBody = JSON.parse(body)
					resolve(jsonBody)
				}
			});
		});
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
		for (let game of this.personalGameInfo) {
			console.log(game)
			var options = {
				'method': 'GET',
				'url': `https://store.steampowered.com/api/appdetails/?appids=${game.appid}`,
				'headers': {
					'Cookie': 'browserid=3021402653685138588; steamCountry=HK%7C261f8d9a4c92df727dd7424a1c9f56c4'
				}
			};
			let gameDetails = await this.requestJson(options); 
			if (gameDetails[game.appid].success === true) {
				game.header_image = gameDetails[game.appid].data.header_image;
				console.log(game)
			}
		}
	}
}


hexo.extend.generator.register('gameInfo-json', async function(locals) {
	let gameInfo = new SteamGameInfo();
	await gameInfo.getOwnedGames();
	await gameInfo.getGameDeatails();
	gameInfo.personalGameInfo.sort((a,b) => a.playtime_forever < b.playtime_forever ? 1:-1);

    return {
      path: 'api/gameInfo',
      data: JSON.stringify(gameInfo.personalGameInfo)
    };
});
