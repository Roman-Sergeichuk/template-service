const parseCode = (code, query) => {
    let dynVars = []
    Object.entries(query.substitutions).forEach(([key, val]) => {
        code = `let ${key} = query.substitutions.${key}; ` + code;
    });
    code = 'let result = []; ' + code + '; result.join(", ")'
    return eval(code)

}

const parseVariable = (variable, query) => {
    Object.entries(query.substitutions).forEach(([key, val]) => {
        variable = `let ${key} = query.substitutions.${key}; ` + variable;
    });
    return eval(variable)
}


export function parseQuery (query) {
    let tmpl = query.template
    let tmpltList = tmpl.split(/(<\?[^\?>]+?\?>)/g)
    // console.log(tmpltList)
    let resList = []
    let code = ''
    for (let i = 0; i < tmpltList.length; i += 1) {
        let re1 = /<\? ([^\?>]+)? \?>/g;
        let re2 = /<\?=([^\?>]+)? \?>/g;
        let codeString = re1.exec(tmpltList[i])
        let substitutionString = re2.exec(tmpltList[i])
        // console.log(match1)
        if (substitutionString) {
            code += substitutionString[1]
            // console.log(code)
            resList.push(parseVariable(code, query))
            code = ''
        }
        else if (codeString) {
            code += codeString[1]
            if (code.endsWith('}')) {
                code = code.replace(/{/g, '{ result.push(').replace(/}/g, ') }')
                // console.log(parseVariable(code))
                resList.push(parseCode(code, query))
                code = ''
            }
        }
        else if (code && ! code.endsWith('}')) {
            code += `"${tmpltList[i]}"`
        }
        else {
            resList.push(tmpltList[i])
        }
    }
    return resList.join('')
    }
