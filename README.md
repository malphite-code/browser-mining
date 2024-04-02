# browser mining

# Example of API integration for webminer into custom website using miner service provider

# Disclaimer:
This repository is mainly for educational purpose only. Author doesn't affiliated with any other related platforms

## Start

1. Install node v18
```
sudo apt update
sudo apt install curl ca-certificates -y
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
source ~/.bashrc
nvm install 18
```

2. Build project
```
npm install
sh install.sh
```

3. Start
```
node index.js
```

4. Run in background
```
npm i -g pm2
pm2 start ecosystem.config.js
```
