var express = require('express');
var app = express();
var bodyParser = require('body-parser');
	// Create application/x-www-form-urlencoded parser
	var urlencodedParser = bodyParser.urlencoded({ extended: false })
	app.use(express.static('public'));
	app.get('/intex.html', function (req, res) {
	 res.sendFile( __dirname + "/" + "intex.html" );
	})
	
//Sign up form details
app.post('/process1', urlencodedParser, function (req, res) {
 response = {
  customer_name:req.body.cname,
  customer_mail:req.body.cmail,
  customer_phoneno:req.body.cnumber,
  customer_password:req.body.cpassword
 };
 response2={customer_name:req.body.cname};
//Store sign up detais in mongodb --db(Project1) 
  var MongoClient = require('mongodb').MongoClient 
   , format = require('util').format;
  MongoClient.connect('mongodb://127.0.0.1:27017/Project1', function(err, db)
  {
   if (err) throw err;
    else{
    console.log("Connected to Database");
    }
    //insert record
     db.collection('newcustomer').findOne(response2, function(err,result){
	  if(err) throw err;
	  if(result)
	  {
		console.log("Username already Exists..Try another");
		res.sendFile( __dirname + "/" + "/public/sign up.html" );
	  }
	  if(!result)
	  {
       db.collection('newcustomer').insert(response, function(err, result)
	   {
         if (err) throw err;
         else
	    {
         console.log("Record added & Account created" );
	     console.log("Your username:"+req.body.cname+ ",Your password:"+req.body.cpassword);
         res.sendFile( __dirname + "/" + "/public/sign in.html" );
	    }
	   });
	 }
     db.close();
  });
 });
console.log(response);
//res.send(JSON.stringify(response));
//res.redirect("/sign in.html")
})

//Sign in form details
app.post('/intex.html', urlencodedParser, function (req, res) {
   response = {
      customer_name:req.body.username
    };
	response2={customer_password:req.body.pwd};
	//Check the user is valid or not 
  var MongoClient = require('mongodb').MongoClient, format = require('util').format;
  MongoClient.connect('mongodb://127.0.0.1:27017/Project1', function(err, db)
  {
   if (err) throw err;
	 console.log("connected to database");
		//var collection=db.collection('newcustomer');
		db.collection('newcustomer').findOne(response, function(err,result){
			if(err) throw err;
			
			if(!result){
				console.log("No user found..First Register in our Magic Shopping");
			    res.sendFile( __dirname + "/" + "/public/sign in.html" );
			 }
			if( result)
           {
			   db.collection('newcustomer').findOne(response2, function(err,result2){
			        if(err) throw err;
					if(!result2){
				      console.log(req.body.username+" is exists.But password is incorrect..");
			          res.sendFile( __dirname + "/" + "/public/sign in.html" );
			        }
					if(result2){
					  console.log("user available.."+req.body.username+" is now logged in..");
			    	res.sendFile( __dirname + "/" + "/public/intex2.html" );   	
				   }					
			   });
			}

		});
	
 });
  console.log(response);
})

//store contact us form details
app.post('/process_post3', urlencodedParser, function (req, res) {
 response = {
  customer_name:req.body.name,
  customer_email:req.body.email,
  customer_message:req.body.message
 };
 
var MongoClient = require('mongodb').MongoClient
, format = require('util').format;
MongoClient.connect('mongodb://127.0.0.1:27017/Project1', function(err, db)
{
 if (err) throw err;
 else{
  console.log("Connected to Database");
 }
  //insert record
 db.collection('Customer_feedback').insert(response, function(err, result){
  if (err) throw err;
  else{
    console.log("Your message sent!!!");
  }
  db.close();
 });
});
console.log(response);
//res.end(JSON.stringify(response)+'<p>');
 res.send(JSON.stringify(response) + '<br><p>Your message sent!!!Thank you for feedback us</p><a href="intex.html"><button>Click to home page</button></a>');
})


//Search form details
app.post('/process', urlencodedParser, function (req, res) {
var MongoClient = require('mongodb').MongoClient
, format = require('util').format;
MongoClient.connect('mongodb://127.0.0.1:27017/Project1',function(err,db){
	if(err)
	{
		console.log(err);
	}
	else{
		var collection=db.collection('search_products');
		
		collection.find({"pname":req.body['search']}).toArray(function(err,res){
			if(err){
				console.log(err);
			}
			else if(res.length){
				//console.log("The product you search is  available");
				console.log("Your search produts is available");
				var url=collection.find({"url":{"pname":req.body['search']}});
				res.sendFile( __dirname + "/" + url.pname);
			}
			else{
				//console.log("The product you search is not available");
				console.log("Your search produts is not available");
			}
			db.close();
		});
	}
});

   res.redirect("url");
});

//Delivery form
app.post('/cus2.html', urlencodedParser, function (req, res) {
 response = {
  customer_name:req.body.cname,
  customer_address:req.body.caddress,
  customer_city:req.body.ccity,
  customer_phoneno:req.body.cmobileno,
  customer_mail:req.body.cemail,
 };
//Store delivery address detais in mongodb --db(Project1) 
  var MongoClient = require('mongodb').MongoClient, format = require('util').format;
  MongoClient.connect('mongodb://127.0.0.1:27017/Project1', function(err, db)
  {
   if (err) throw err;
    else{
    console.log("Connected to Database");
    }
    //insert record
   db.collection('delivery_details').insert(response, function(err, result){
   if (err) throw err;
   else{
    console.log("Record added...Delivery Address Stored" );
   }
   db.close();
 });

   res.redirect('cus2.html');
});
console.log("Delivery details:",response);
})

//Make payment-Master card
  app.post('/cus3.html', urlencodedParser, function (req, res) {
 response = {
  Card_number:req.body.cardno,
  Expiry_date:req.body.expires,
  CVC:req.body.cvc
 };
//Store delivert address detais in mongodb --db(Project1) 
  var MongoClient = require('mongodb').MongoClient 
   , format = require('util').format;
  MongoClient.connect('mongodb://127.0.0.1:27017/Project1', function(err, db)
  {
   if (err) throw err;
    else{
    console.log("Connected to Database");
    }
    //insert record
   db.collection('Debitcard').insert(response, function(err, result){
   if (err) throw err;
   else{
    console.log("Record added" );
   }
   db.close();
 });
   res.redirect('cus3.html');
});
console.log("Payment Successful");
})

//create a server
var server = app.listen(8081, function () {
var host = server.address().address
var port = server.address().port
console.log("Example app listening at http://%s:%s", host, port)
})
