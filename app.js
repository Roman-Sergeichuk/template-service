// import bodyParser from 'body-parser';
// import express from 'express';


// const app = express();
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));


// app.post('/render', (req, res) => {
//   if(!req.body.template) {
//     return res.status(400).send({
//       erorrMessage: 'template is required'
//     });
//   }
  
//   const template = req.body.template;
//   const substitutions = req.body.substitutions;

//   // Put here template parser - function
//   // Sent error message if parser can't parse the template
//   //  Add tests

//   return res.status(200).send({
//     result: "Put result here"
//   })
// });

// const PORT = 3000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// });


// var str = "Hello <? if (gender === 'male') { ?>Mr.<? } else { ?>Mrs.<? } ?> <?= last_name?>";
// var str_arr = str.split(/(<\?.*?\?>)/);
// console.log(str_arr)

// let result = ''
// let js_code = ''

// for (let i = 0; i < str_arr.length; i += 1) {
//     if str_arr[i] 
// }


const query = {
    "template": "Hello <? if (gender === 'male') { ?>Mr.<? } else { ?>Mrs.<? } ?> <?= last_name?>",
    "substitutions": {"last_name": "Doe", "gender": "male"}
}



let str1 = query.template
str1 = str1.replace(/\{ \?>/g, '{ "').replace(/<\? }/g, '" }')
let str1_list = str1.split(/(<\?.*?\?>)/)
let code = str1_list[1].replace(/<\? /g, '').replace(/ \?>/g, '')

const parseCode = (code) => {
    Object.entries(query.substitutions).forEach(([key, val]) => {
        // console.log(`${key}: ${val}`);
        code = `const ${key} = '${val}';` + code;
    });
    
    return eval(code)
}



console.log(parseCode(code))

