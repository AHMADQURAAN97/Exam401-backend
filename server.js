'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const server = express();
const PORT=process.env.PORT
const axios = require('axios');
server.use(cors());
server.use(express.json());
const mongoose =require('mongoose');
mongoose.connect(`${process.env.MONGO_LINK}`, { useNewUrlParser: true, useUnifiedTopology: true });


const fruitSchema = new mongoose.Schema({
email:String,
name:String,
image:String,
price:String
})

const fruitmodel = mongoose.model('datafruit',fruitSchema)


//===========================ROUTES==============
server.get('/getfruit',getFruitHandler);
server.post('/addFavo',addFavoriteHandler);
server.get('/getFavoriteFruite',getFavoriteFruiteHandler);
server.delete('/deletefav/:id',deleteFruitHandler);
server.put('/updateFruit/:id',updateFruitHandler)




//===========================Function get===================

async function getFruitHandler(request,response) {


    let url=`https://fruit-api-301.herokuapp.com/getFruit`

    try{

        axios.get(url).then((urlResult)=>{

            let urlArray = urlResult.data.fruits.map(item =>{

                return new foods(item)
            })
             response.send(urlArray)
        })
    }

    catch(error){

    response.send('error in getting data')
    }
}


class foods{
constructor(item){

    this.name=item.name,
    this.image=item.image,
    this.price=item.price
}
}

// ===========================ADDFavoriteHandler==============


async function addFavoriteHandler(request,response) {

let {name,image,price,email}=request.body;

await fruitmodel.create({name,image,price,email});

// fruitmodel.find({email:email},function(err,fruitData){

// if (err) {
//     console.log('error in Add data')
// }else {
//     response.send(fruitData)
// }
// })

}

// ===========================getFavoriteHandler==============


async function getFavoriteFruiteHandler(request,response) {

let email=request.query.email;

fruitmodel.find({email:email},function(err,fruitData){

if (err) {
    console.log('error in get favorite')
}else {
    response.send(fruitData)
}
})
}



// ==========================Delete==========================

async function deleteFruitHandler(request,response) {

let email = request.query.email;
let fruitID = request.params.id;

await fruitmodel.remove({_id:fruitID},(err,ownerdata) => {

if (err) {
    console.log('error in delete card')
}else { 

    fruitmodel.find({email:email},(err,fruitData) => {

        if (err) {
            console.log('errrrrrrrror in delete card')
        }else { 
            response.send(fruitData)
        }
    })
}

})


}

//=================================Update===============

async function updateFruitHandler(request,response) {


    let fruitID= request.params.id;
    let {name,image,price,email}=request.body;

    fruitmodel.findOne({_id:fruitID},(error,fruitdata)=>{

        fruitdata.name=name;
        fruitdata.image=image;
        fruitdata.price=price;
        fruitdata.email=email;

        fruitdata.save();

        if(error){
            console.log('error in update data')
        }else {
            fruitmodel.find({email:email},(err,ownerData)=>{

             if (err){
                 console.log('errrrror in update data')
             }else {
                 response.send(ownerData)
            }
            });
        }
    })


}



















server.get('/test',(request,response) => {


    response.send('server is working')
})




server.listen(PORT,()=>{
    console.log(`listening on PORT ${PORT}`)
});