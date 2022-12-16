let express = require("express");
let app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

var port = process.env.PORT||2410
app.listen(port, () => console.log(`Node app listening on port ${port}!`));

const {Client}=require("pg");
const client=new Client({
    user:"postgres",
    password:"ajay1#vinay",
    database:"postgres",
    port:5432,
    host:"db.jjwpkzmxppircpwtldvr.supabase.co"
})
client.connect(function (res,error){
    console.log("connected !!!");

})

let {mobiles}=require("./mobileData")


app.get("/svr/mobiles/resetData",function(req,res){
    let sql="truncate table mobiles"
    client.query(sql,function(err,result){
        if(err)console.log(err);
        else{
            console.log("table emptied success")
            resetData()
        }
    })
})

resetData=()=>{
    let mobArray=mobiles.map(ele=>[ele.name,ele.price,ele.brand,ele.ram,ele.rom,ele.os])
        mobArray.map(ele=>{
        console.log(ele);
        let sql1="INSERT INTO mobiles VALUES ($1,$2,$3,$4,$5,$6)"
        client.query(sql1,ele,function(err,result){
        })
})
}

app.get("/svr/mobiles",function(req,res){   
    let sql="select * from mobiles"
    client.query(sql,function(err,result){
        if(err)console.log(err);
        else res.send(result.rows)
    })
})
// app.get("/svr/mobiles",function(req,res){   
//     let connection=mysql.createConnection(connData)
//     let sql="select * from mobiles"
//     connection.query(sql,function(err,result){
//         if(err)console.log(err);
//         else res.send(result)
//     })

// })

app.get("/svr/mobiles/:name",function(req,res){  
    let name=req.params.name 
    let value=[name]
    let sql="select * from mobiles where name=$1"
    client.query(sql,value,function(err,result){
        if(err)console.log(err);
        else res.send(result.rows)
    })

})
app.get("/svr/mobiles/brand/:brandName",function(req,res){   
    let brand=req.params.brandName
    let value=[brand]
    let sql="select * from mobiles where brand=$1"
    client.query(sql,value,function(err,result){
        if(err)console.log(err);
        else res.send(result.rows)
    })

})
app.get("/svr/mobiles/RAM/:ram",function(req,res){   
    let ram=req.params.ram
    let sql="select * from mobiles"
    client.query(sql,function(err,result){
        if(err)console.log(err.message);
        else {
            let arr1=result.rows
            arr1=arr1.filter(ele=>ele.ram===ram)
            console.log(arr1);
            res.send(arr1)
        }
    })

})
app.get("/svr/mobiles/ROM/:rom",function(req,res){   
    let rom=req.params.rom
    let sql="select * from mobiles"
    client.query(sql,function(err,result){
        if(err)console.log(err);
        else {
            let arr1=result.rows
            arr1=arr1.filter(ele=>ele.rom===rom)
            res.send(arr1)
        }
    })

})
app.get("/svr/mobiles/OS/:os",function(req,res){   
    let os=req.params.os
    let sql="select * from mobiles"
    client.query(sql,function(err,result){
        if(err)console.log(err);
        else {
            let arr1=result.rows
            arr1=arr1.filter(ele=>ele.os===os)
            res.send(arr1)
        }
    })

})
//for left panel options query params
app.get("/svr/leftpanel/mobiles",function(req,res){   
    let br=req.query.brand
    let ram=req.query.ram
    let rom=req.query.rom
    let os=req.query.os

    let sql="select * from mobiles"
    client.query(sql,function(err,result){
        if(err)console.log(err);
        else {
            let arr1=result.rows
            
            if(br){
                arr1=arr1.filter(ele=>br.split(",").findIndex(el=>el===ele.brand)>=0)
            }
            if(ram){
                arr1=arr1.filter(ele=>ram.split(",").findIndex(el=>el===ele.ram)>=0)
            }
            if(rom){
                arr1=arr1.filter(ele=>rom.split(",").findIndex(el=>el===ele.rom)>=0)
            }
            if(os){
                arr1=arr1.filter(ele=>os.split(",").findIndex(el=>el===ele.os)>=0)
            }
            res.send(arr1)
        }
    })

})

app.post("/svr/mobiles",function(req,res){   
    let body=req.body
    let arr1=[body.name,body.price,body.brand,body.ram,body.rom,body.os]
    let sql="insert into mobiles values ($1,$2,$3,$4,$5,$6)"
    client.query(sql,arr1,function(err,result){
        if(err)console.log(err);
        else res.send(`${result.rowCount} insertion success`)
    })

})

app.put("/svr/mobiles/:name",function(req,res){   
    let body=req.body
    let name=req.params.name
    let arr1=[body.price,body.brand,body.ram,body.rom,body.os,name]
    console.log(arr1);
    let sql="update mobiles set price=$1,brand=$2,ram=$3,rom=$4,os=$5 where name=$6"
    client.query(sql,arr1,function(err,result){
        if(err)console.log(err);
        else res.send(`${result.fields}`)
    })

})
app.delete("/svr/mobiles/:name",function(req,res){   
    let name=req.params.name
    let value=[name]
    let sql="delete from mobiles where name=$1"
    client.query(sql,value,function(err,result){
        if(err)console.log(err);
        else res.send(result.fields)
    })

})