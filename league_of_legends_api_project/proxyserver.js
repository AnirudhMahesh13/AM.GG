var express = require('express');
var cors = require('cors');
const axios = require('axios');

var app = express();

app.use(cors());

const API_KEY="RGAPI-0e37a13a-cb17-43d4-83ef-3039c681f0a8";

function getPlayerPUUID(playerName){
    return axios.get("https://na1.api.riotgames.com"+"/lol/summoner/v4/summoners/by-name/"+ playerName + "?api_key=" + API_KEY)
        .then(response =>{
            console.log(response.data);
            return response.data.puuid
        
        }).catch(err => err);
}

// Get past5Games
//localhost:4000/past5Games
app.get('/past5Games', async(req, res)=>{
    const playerName =req.query.username;
    //PUUID
    const PUUID = await getPlayerPUUID(playerName);
    const API_CALL="https://americas.api.riotgames.com"+ "/lol/match/v5/matches/by-puuid/"+ PUUID + "/ids"  + "?api_key=" + API_KEY;



    // get API_CALL
    // Give a list of game IDS
    const gameIDS = await axios.get(API_CALL)
        .then(response => response.data)
        .catch(err => err)

    // A list of game ID 20 strings
    console.log(gameIDS);


    //loop through game IDS
    // at each loop, get the informaiton based off ID (API_CALL)
    var matchDataArray =[];
    for(var i=0; i< gameIDS.length -15; i++){
        const matchID = gameIDS[i];
        const matchData = await axios.get("https://americas.api.riotgames.com/" + "lol/match/v5/matches/" +matchID + "?api_key=" + API_KEY)
            .then(response => response.data)
            .catch(err=>err)
        matchDataArray.push(matchData);
    }

    // save information above in an array, give array as JSON response to user
    //[Game1Object, Game2Object, ...]
    res.json(matchDataArray)

});


app.listen(4000,function(){

    console.log("Server started on port 4000");
}); //localhost:4000