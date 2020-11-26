import bodyParser from 'body-parser';
import express, { query } from 'express';
import { parseQuery } from './template_engine.js';





// "<? for (let i = 0; i < 5; i++) { ?>Gleb<? + i } ?>"
// "Hello <? if (gender === 'male') { ?>Mr.<? } else { ?>Mrs.<? } ?> <?= last_name ?>"
// "<? for (let i = 0; i < 5; i++) { ?>line<? } ?>Hello<? if (gender === 'male') { ?>Mr.<? } else { ?>Mrs.<? } ?> <?= last_name ?>"

// const query = {
//     "template": "Hello <? if (gender === 'male') { ?>Mr.<? } else { ?>Mrs.<? } ?> <?= last_name ?>",
//     "substitutions": {"last_name": "Doe", "gender": "male"}
// }



// let template = query.template
// console.log(template.split(/(<\?.*?\?>)/))
// template = template.replace(/\{ \?>/g, '{ "').replace(/<\? }/g, '" }')
// // console.log(template)
// let str1_list = template.split(/(<\?.*?\?>)/)
// let code = str1_list[1].replace(/<\? /g, '').replace(/ \?>/g, '')

// const parseCode = (code, query) => {
//     Object.entries(query.substitutions).forEach(([key, val]) => {
//         // console.log(`${key}: ${val}`);
//         code = `const ${key} = '${val}'; ` + code;
//     });
//     code = 'let result = []; ' + code + '; result'
//     console.log(code)
    
//     return eval(code)
// }

// const parseVariable = (variable, query) => {
//     Object.entries(query.substitutions).forEach(([key, val]) => {
//         // console.log(`${key}: ${val}`);
//         variable = `const ${key} = '${val}'; ` + variable;
//     });
    
//     return eval(variable)
// }


// function parseQuery (query) {
//     let tmpl = query.template
//     let tmpltList = tmpl.split(/(<\?[^\?>]+?\?>)/g)
//     // console.log(tmpltList)
//     let resList = []
//     let code = ''
//     for (let i = 0; i < tmpltList.length; i += 1) {
//         let re1 = /<\? ([^\?>]+)? \?>/g;
//         let re2 = /<\?=([^\?>]+)? \?>/g;
//         let codeString = re1.exec(tmpltList[i])
//         let substitutionString = re2.exec(tmpltList[i])
//         // console.log(match1)
//         if (substitutionString) {
//             code += substitutionString[1]
//             // console.log(code)
//             resList.push(parseVariable(code, query))
//             code = ''
//         }
//         else if (codeString) {
//             code += codeString[1]
//             if (code.endsWith('}')) {
//                 code = code.replace(/{/g, '{ result.push(').replace(/}/g, ') }')
//                 // console.log(parseVariable(code))
//                 resList.push(parseCode(code, query))
//                 code = ''
//             }
//         }

//         else if (code && ! code.endsWith('}')) {
//             code += `"${tmpltList[i]}"`
//         }
//         else {
//             resList.push(tmpltList[i])
//         }
//     }
//     return resList.join('')
//     }

// console.log(parseQuery(query))


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.post('/render', (req, res) => {
  if(!req.body.template) {
    return res.status(400).send({
      erorrMessage: 'template is required'
    });
  }
  
  const query = req.body
  

  // Put here template parser - function
  // Sent error message if parser can't parse the template
  //  Add tests

  return res.status(200).send({
    result: parseQuery(req.body)
  })
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});


// console.log(str1_list)
// console.log(parseCode(code))

// function parseQuery (query) {
    // template = query.template
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


// function parseQuery (query) {
//     template = query.template
//     template = template.replace(/\{ \?>/g, '{ result.push("').replace(/<\? }/g, '") }')
//     let templateList = template.split(/(<\?.*?\?>)/)
//     let resultList = []
//     for (let i = 0; i < templateList.length; i += 1) {
//         if (templateList[i].startsWith('<? ')) {
//             let code = templateList[i].replace(/<\? /g, '').replace(/ \?>/g, '')
//             resultList.push(parseCode(code))
//         }
//         else if (templateList[i].startsWith('<?= ')) {
//             let variable = templateList[i].replace(/<\?\= /g, '').replace(/\?>/g, '')
//             resultList.push(parseVariable(variable))
//         }
//         else {
//             resultList.push(templateList[i])
//         }
//     }
//     return resultList.join('')
// };



// console.log(parseQuery(query))


// var re = /<\?([^\?>]+)?\?>/g, match;
// while(match = re.exec(query.template)) {
//     console.log(match);
// }
