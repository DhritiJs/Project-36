//Create variables here
var dog,foodS,foodStock;
var dogImg,happyDogImg;
var feed,addFood;
var fedTime,lastFed;
var foodObj;
function preload(){
  //load images here
  dogImg = loadImage("images/Dog.png");
  happyDogImg = loadImage("images/happyDog.png");
}

function setup() {
  createCanvas(800,700);
  dog = createSprite(700,350,10,10);
  dog.addImage(dogImg);
  dog.scale=0.3;

  database = firebase.database();
  foodStock = database.ref('food');
  foodStock.on("value",readStock,showError)

  feed = createButton("Feed the Dog");
  feed.position(600,95);
  feed.mousePressed(feedDog);
  
  addFood =createButton("Add Food");
  addFood.position(700,95);
  addFood.mousePressed(addFoods);

  foodObj = new Food();
}


function draw() {  
background(46, 139, 87);

foodObj.display();
  drawSprites();
  
  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  })


fill(255,255,254); textSize(15); 
if(lastFed>=12){ text("Last Feed : "+ lastFed%12 + " PM", 50,30); }
   else if(lastFed==0){ text("Last Feed : 12 AM",50,30); }
        else{ text("Last Feed : "+ lastFed + " AM", 50,30); }
}

function readStock(data){
  foodS=data.val();
  foodObj.updateStock(foodS);
}
function writeStock(x){
  if(x<=0){
    x=0;
  }else{
    x=x-1;
  }
  database.ref('/').set({
    food:x
  }
  )
}
function showError(){
  console.log("Error");
}

function feedDog(){
  dog.addImage(happyDogImg);

  foodObj.updateStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime: hour()
  })
}

function addFoods(){
  foodS=foodS+1;
  database.ref('/').update({
    food:foodS,
  })
}
