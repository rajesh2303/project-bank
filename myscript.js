var express =require('express');
var mysql=require('mysql');
var morgan= require("morgan");
var bodyParser=require('body-parser');
var JSAlert=require('js-alert')
var crypto = require('crypto')
var moment=require('moment');
var  ejs=require('ejs');
var app=express();



app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/ind.ejs"));

var now=moment();
console.log(now.format('YYYY-MM-DD HH:mm:ss'));

function generateotp(){
    var digits='0123456789';
    var otp="";
    for(let i=0;i<4;i++){
        otp+=digits[Math.floor(Math.random()*10)];
    }
    return otp;
}

var ccv=generateotp();
console.log(ccv);

var connection = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password:'',
    database:'samp',
});
connection.connect(function(error){
   if(!!error){
       console.log('error');
   }else{
       console.log('connected');
   }
});
app.get('/logoff',function(req,resp){
   resp.render(__dirname + "/logoffpg.ejs");
});
app.post('/eee',function(req,resp){
    var name="999";
    resp.render(__dirname + "/ind.ejs",{name:name});
});


app.get('/',function(req,resp){
    var name="999";
    resp.render(__dirname + "/ind.ejs",{name:name});
});


app.post('/login',function(res,resp){
    var name="7";
resp.render(__dirname + "/ind.ejs",{name:name});
});


app.post('/lo',function(res,resp){
    var name="7";
resp.render(__dirname + "/log.ejs",{name:name});
});


app.post('/log',function(req,resp){
    var f1=req.body.acno;
    var f2=req.body.pass;
    var sql=`SELECT password,name,ccv,email,id,bit FROM mysample WHERE id=?`
     connection.query(sql,f1,function(error,rows){
        if(error){
            console.log(error);
            var name="1";
            resp.render(__dirname + "/log.ejs",{name:name});
        }
        else{
        if(rows==[]){
            var name="1"
            resp.render(__dirname + "/log.ejs",{name:name});
        }
        else if(f2==rows[0].password){
            var name=rows[0].name;
            var cv=rows[0].ccv;
            var email=rows[0].email;
            var id=rows[0].id;
            var status=0;
            var bit=rows[0].bit;
            resp.render(__dirname + "/banking.ejs",{name:name,cv:cv,id:id,email:email,status:status,bit:bit});
           const sgMail=require('@sendgrid/mail');
            sgMail.setApiKey('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');
             var tt=now.format('YYYY-MM-DD HH:mm:ss')
            const fs=require("fs");
            const msg={
            to:rows[0].email,
            from:"rajeshrlion@gmail.com",
            subject:"Dark Bank",
            text:"HELLO , "+name+" you have logged in "+tt+" With IP:20.105.172.35 location  10.9601° N, 78.0766° E",
            };
        sgMail.send(msg).catch(err=>{
        console.log(err);
        connection.query(sql,f1,(error,results,fields)=>{
          if(error)
            console.log(error);
      })
  });
        }
        else{
            var name="1";
            resp.render(__dirname + "/log.ejs",{name:name});
        }
           
          }
    });

});


app.post('/return',function(req,resp){
    var ena=req.body.name;
    var sql=`SELECT password,name,ccv,email,id,bit FROM mysample WHERE id=?`
     connection.query(sql,ena,function(error,rows){
        if(error){
            console.log(error);
        }
        else{
            var name=rows[0].name;
            var cv=rows[0].ccv;
            var email=rows[0].email;
            var id=rows[0].id;
            var status=1;
            var bit=rows[0].bit;
    resp.render(__dirname + "/banking.ejs",{name:name,cv:cv,id:id,email:email,status:status,bit:bit});
        }});
})


app.post('/cal',function(req,resp){
     var ena=req.body.name;
    var tid=req.body.tid;
    var amt=req.body.amt;
    var bit=req.body.bit;
    var ena=req.body.name;
    if(parseInt(bit)<parseInt(amt)){
        var status=0;
        var onetp=generateotp();
        var bit=req.body.bit;
        resp.render(__dirname + "/otp2.ejs",{onetp:onetp,ena:ena,status:status,bit:bit});
        console.log("yes")
    }
    else{
        var tid=req.body.tid;
        console.log(tid);
        var sql=`SELECT bit,email FROM mysample WHERE id=?`
     connection.query(sql,tid,function(error,rows){
        if(error){
            console.log(error);
            console.log("error disp");
        }
        else{
            var tid=req.body.tid;
            var amt=req.body.amt;
            var bit=req.body.bit;
            var ena=req.body.name;
            console.log(tid,amt,bit,ena);
           var oldid=parseInt(bit)-parseInt(amt);
            var neid=parseInt(rows[0].bit)+parseInt(amt);

            var sql1=`UPDATE mysample SET bit=? WHERE id=?`;
            connection.query(sql1,[oldid,ena],function(error,rows){});
            

            var sql2=`UPDATE mysample SET bit=? WHERE id=?`;
            connection.query(sql2,[neid,tid],function(error,rows){});

            const sgMail=require('@sendgrid/mail');
  sgMail.setApiKey('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');
  const fs=require("fs");
  const msg={
      to:rows[0].email,
      from:"rajeshrlion@gmail.com",
      subject:"Dark Bank",
      text:"Your have received bit coin from acno: "+ena+" rs: "+amt+ " your new balance is: "+neid
  };
  sgMail.send(msg).catch(err=>{
      console.log(err);
      connection.query(sql,f1,(error,results,fields)=>{
          if(error)
            console.log(error);
      })
  });

        }

    });
    }
    var ena=req.body.name;
var sql=`SELECT password,name,ccv,email,id,bit FROM mysample WHERE id=?`
     connection.query(sql,ena,function(error,rows){
        if(error){
            console.log(error);
        }
        else{
             var name=rows[0].name;
            var cv=rows[0].ccv;
            var email=rows[0].email;
            var id=rows[0].id;
            var status=1;
            var amt=req.body.amt;
            var bit=req.body.bit;
           var oldid=parseInt(bit)-parseInt(amt);
            console.log("final :"+oldid);
            const sgMail=require('@sendgrid/mail');
  sgMail.setApiKey('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');
  
  const fs=require("fs");
  const msg={
      to:rows[0].email,
      from:"rajeshrlion@gmail.com",
      subject:"Dark Bank",
      text:"Your transaction is success your bit coins is "+oldid,
  };
  sgMail.send(msg).catch(err=>{
      console.log(err);
      connection.query(sql,f1,(error,results,fields)=>{
          if(error)
            console.log(error);
      })
  });
  
    resp.render(__dirname + "/banking.ejs",{name:name,cv:cv,id:id,email:email,status:status,bit:oldid});
        }
})
     });
     


app.post('/otp2',function(req,resp){
    var ena=req.body.name;
    var bit=req.body.bit;
    var sql=`SELECT password,name,ccv,email,id,bit FROM mysample WHERE id=?`
     connection.query(sql,ena,function(error,rows){
        if(error){
            console.log(error);
        }
        else{
            var name=rows[0].name;
            var cv=rows[0].ccv;
            var email=rows[0].email;
            var id=rows[0].id;
    var onetp=generateotp();
    console.log(onetp,name,cv,email,id);
    const sgMail=require('@sendgrid/mail');
  sgMail.setApiKey('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');
  
  const fs=require("fs");
  const msg={
      to:rows[0].email,
      from:"rajeshrlion@gmail.com",
      subject:"Dark Bank",
      text:"Your One Time Passord IS***"+onetp+"****",
  };
  sgMail.send(msg).catch(err=>{
      console.log(err);
      connection.query(sql,f1,(error,results,fields)=>{
          if(error)
            console.log(error);
      })
  });
  var status=1;
   resp.render(__dirname + "/otp2.ejs",{onetp:onetp,ena:ena,status:status,bit:bit});
  }
    
});
});

app.post('/otp',function(req,resp){
    var ena=req.body.name;
    var sql=`SELECT password,name,ccv,email,id,bit FROM mysample WHERE id=?`
     connection.query(sql,ena,function(error,rows){
        if(error){
            console.log(error);
        }
        else{
            var name=rows[0].name;
            var cv=rows[0].ccv;
            var email=rows[0].email;
            var id=rows[0].id;
    var onetp=generateotp();
    console.log(onetp,name,cv,email,id);
    const sgMail=require('@sendgrid/mail');
  sgMail.setApiKey('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');
  
  const fs=require("fs");
  const msg={
      to:rows[0].email,
      from:"rajeshrlion@gmail.com",
      subject:"Dark Bank",
      text:"Your One Time Passord IS***"+onetp+"****",
  };
  sgMail.send(msg).catch(err=>{
      console.log(err);
      connection.query(sql,f1,(error,results,fields)=>{
          if(error)
            console.log(error);
      })
  });
   resp.render(__dirname + "/otp.ejs",{onetp:onetp,ena:ena});
  }
    
});
});


app.post('/',function(req,resp){
    var f1=req.body.acno;
    var f2=req.body.fna;
    var f3=req.body.pass;
    var f4=req.body.em;
    var f5=100;
    var values=[f1,f2,f3,f4,f5,ccv]
    console.log(values);
    var sql="INSERT INTO mysample(id,name,password,email,bit,ccv) VALUES(?,?,?,?,?,?)";
    connection.query(sql,values,function(err,res){
        if(err){
            console.log(err);
            var name="1";
            resp.render(__dirname + "/ind.ejs",{name:name});
        }
        else{
            console.log("recorded");
            resp.render(__dirname + "/log.ejs",{name:name})


  const sgMail=require('@sendgrid/mail');
  sgMail.setApiKey('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');
  
  const fs=require("fs");
  
  pathToAttachment=`${__dirname}/logo.jpg`;
  samp=fs.readFileSync(pathToAttachment).toString("base64");
  const msg={
      to:f4,
      from:"rajeshrlion@gmail.com",
      subject:"Dark Bank",
      text:"welcome to our bank "+f2+" you have successfully singned in our bank you have an initial amount of 100 bit coin start your banking note:***Yout ccv no is**** :"+ccv,
      attachments:[
          {
          content:samp,
          filename:"logo.jpg",
          type:"application/jpg",
          disposition:"attachment"
          }
  
      ]
  };
  sgMail.send(msg).catch(err=>{
      console.log(err);
      var name="2";
      resp.render(__dirname + "/ind.ejs",{name:name});
      var sql=`DELETE FROM mysample WHERE id=?`
      connection.query(sql,f1,(error,results,fields)=>{
          if(error)
            console.log(error);
      })
  });
        }
    })
    
});
app.listen(3000);