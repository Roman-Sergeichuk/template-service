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





const query = {
    "template": "Hello <? if (gender === 'male') { ?>Mr.<? } else { ?>Mrs.<? } ?> <?= last_name?>",
    "substitutions": {"last_name": "Doe", "gender": "male"}
}



let template = query.template
template = template.replace(/\{ \?>/g, '{ "').replace(/<\? }/g, '" }')
let str1_list = template.split(/(<\?.*?\?>)/)
let code = str1_list[1].replace(/<\? /g, '').replace(/ \?>/g, '')

const parseCode = (code) => {
    Object.entries(query.substitutions).forEach(([key, val]) => {
        // console.log(`${key}: ${val}`);
        code = `const ${key} = '${val}'; ` + code;
    });
    code = 'let result = []; ' + code + '; result'
    
    return eval(code)
}

const parseVariable = (variable) => {
    Object.entries(query.substitutions).forEach(([key, val]) => {
        // console.log(`${key}: ${val}`);
        variable = `const ${key} = '${val}'; ` + variable;
    });
    
    return eval(variable)
}

// console.log(str1_list)
// console.log(parseCode(code))

// function parseQuery (query) {
//     template = query.template
//     template = template.replace(/\{ \?>/g, '{ "').replace(/<\? }/g, '" }')
//     let templateList = template.split(/(<\?.*?\?>)/)
//     let resultList = []
//     for (let i = 0; i < templateList.length; i += 1) {
//         if (templateList[i].startsWith('<? ')) {
//             let code = templateList[i].replace(/<\? /g, '').replace(/ \?>/g, '')
//             resultList.push(parseCode(code))
//         }
//         else if (templateList[i].startsWith('<?= ')) {
//             let code = templateList[i].replace(/<\?\= /g, '').replace(/\?>/g, '')
//             resultList.push(parseCode(code))
//         }
//         else {
//             resultList.push(templateList[i])
//         }
//     }
//     return resultList.join('')
// };


function parseQuery (query) {
    template = query.template
    template = template.replace(/\{ \?>/g, '{ result.push("').replace(/<\? }/g, '") }')
    console.log(template)
    let templateList = template.split(/(<\?.*?\?>)/)
    let resultList = []
    for (let i = 0; i < templateList.length; i += 1) {
        if (templateList[i].startsWith('<? ')) {
            let code = templateList[i].replace(/<\? /g, '').replace(/ \?>/g, '')
            console.log(code)
            resultList.push(parseCode(code))
            console.log(code)
        }
        else if (templateList[i].startsWith('<?= ')) {
            let variable = templateList[i].replace(/<\?\= /g, '').replace(/\?>/g, '')
            resultList.push(parseVariable(variable))
        }
        else {
            resultList.push(templateList[i])
        }
    }
    return resultList.join('')
};

console.log(parseQuery(query))
