

//
require("dotenv").config({ path: __dirname + "/.env" });
const { twitterClient } = require("./twitterClient.js")
const CronJob = require("cron").CronJob;


const {download } = require("./utilities.js");


const imageUrls = [
    "https://i.pinimg.com/564x/4c/6d/2e/4c6d2e4abd3ba79f2fb137bd3b291918.jpg",
    "https://i.pinimg.com/736x/ca/a9/a9/caa9a976a995abc97434536f070dbda5.jpg",
    "https://i.pinimg.com/564x/16/9e/b6/169eb68355b821d60cbeb75afdf04581.jpg",
    "https://i.pinimg.com/736x/90/0b/20/900b202237111367be7c1750d8056c2f.jpg",
    "https://i.pinimg.com/736x/db/51/fe/db51fecf3817ffdf13cb3f32e5f96cec.jpg"

];

let lastIndex = -1; //recordar el último índice

const tweet = async () => {
    let randomIndex;

    do{
        const randomIndex = Math.floor(Math.random() * imageUrls.length);
    }while(randomIndex === lastIndex);
    
    lastIndex = randomIndex; // actualizamos el último ñíndice con el actual

    
    const uri = imageUrls[randomIndex];
    const filename = "image.png";

    download(uri, filename, async function () {
        try {
            // Subir la imagen utilizando la API v1.1
            const mediaID = await twitterClient.v1.uploadMedia("./image.png");

            // Publicar el tweet utilizando la API v1.1 (ya que subiste el media ID con v1.1)
            await twitterClient.v1.tweet({
                status: "", // Puedes agregar texto aquí
                media_ids: [mediaID] // Incluye el media ID de la imagen
            });

            console.log("Tweet publicado con éxito");
        } catch (e) {
            console.error("Error publicando el tweet: ", e);
        }
    });
};



//0: El trabajo se ejecuta en el minuto 0 de cada hora.
//Todos los demás campos (*): Representan cada hora, cada día, cada mes, etc.
const cronTweet = new CronJob("0 * * * *", async () => {
    tweet();
  });
  

cronTweet.start();