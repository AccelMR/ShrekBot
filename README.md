#  ShrekBot
A trolly discord bot for learning purposes.
ShrekBot can also be useful, eventually. 

## Introduction
This bot has been created for learning purposes and to troll some friends. 

It uses some techniques to create and reload command without turning the bot off or restarting.

Some of the commands you can find would be:
  - Sound play when someone connects, depending on their sound from sounds.json. 
  
  - Delete messages up to 99.
  > .delete  <number of messages>
  
  - Move or disconnect users.
  > .m <user | nick> <channel> if channel is null then it'll disconnect. 
  
  - React with a word to a message. **See resources/emojimao.json
  > .react <word!>.
  
  ![alt text](https://github.com/AccelMR/ShrekBot/blob/master/examples/react.jpg?raw=true)
  
  - Add nicks to users so you don't have to write their actual Discord names.
  > .addnick <nick> <Discord Name or another nick if the user already has one>
  
### Important! 
In order to use Sounds you'll need to add in sound.json the Discord name of the person and as a value the mp3 name. That .mp3 file has to be located in the directory under config.json "SoundsPath". 

## Installation
In order to use this bot you'll need to create a bot in Discord API and create a .env file to save the TOKEN

> npm install
> npx tsc
> node dist/src/main.js
