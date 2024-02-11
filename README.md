It is a game of a battle in the space, between evil characters and our spaceship.

Spaceship moves right <kbd>→</kbd> and left <kbd>←</kbd>

Firing rockets: <kbd>Space</kbd>

Moving and Firing: Combine Space and right or left.

![image](https://github.com/karroumBen/space-invaders/assets/96283456/3b83c5c3-aeb6-4f83-a301-d74bf37c4718)


In Game:

![image](https://github.com/karroumBen/space-invaders/assets/96283456/6a8b3e86-c612-4f37-8fb3-519a830e6334)

## Run it in Docker
1. build the image

      `docker build -t space-invaders .`
2. run the image in a container, you can name it anything

      `docker run --name space-game -d -p 8080:80 space-invaders`
3. Visit this link:

      `http://localhost:8080`