# Battleship Game
---

## Description
Project 1 of General Assembly SEI (building a browser game). The game was made using HTML, CSS and JavaScript.
Game Link: https://ryanbulluss.github.io/Battleship-game/
Code installation link?


## Brief
The game must:
- Render in browser
- Include win/loss logic
- Use vanilla JavaScript
- Be deployed online
- Have Ai opponent

## Planning
### Wireframe:
![image](https://github.com/RyanBulluss/Battleship-game/assets/117209600/0ad0c201-fc19-46a7-b863-762e07844b2b)
The plan for UI was to have 4 seperate displays to break up the game and allow the user to focus in on their current action

[Psudocode for MVP.TXT](https://github.com/RyanBulluss/Battleship-game/files/11904538/Psudocode.for.MVP.TXT)

## Code Process
The first challenge with the coding of the game was to figure out how to create a dynamic board size in order to allow the user contol over how they want to play the game.
To do this I used a CSS variable for the amount of rows & columns which will change to the value that the user chooses. 
![image](https://github.com/RyanBulluss/Battleship-game/assets/117209600/641c3e90-af98-478e-b0af-9b087f974444)

Another challenge was with detecting the bounds of the board so that the user or cpu can only place ships in valid positions.
![image](https://github.com/RyanBulluss/Battleship-game/assets/117209600/dc0e9277-cf38-4044-b858-3691fb1fe5e9)
My solution for 
