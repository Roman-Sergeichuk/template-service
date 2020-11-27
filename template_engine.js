const parseCode = (code, query) => {
    let resultCode = ''
    Object.keys(query.substitutions).forEach(key => {
        resultCode = `let ${key} = query.substitutions.${key}; ${code}`;
    });
    resultCode = `
            let result = [];
            ${resultCode};
            result.join(", ")`
    return eval(resultCode)

}

const parseVariable = (variable, query) => {
    Object.entries(query.substitutions).forEach(([key, val]) => {
        variable = `let ${key} = query.substitutions.${key}; ` + variable;
    });
    return eval(variable)
}


export function parseQuery (query) {
    const tmpl = query.template
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
                code = code.replace('{', '{ result.push(').replace('}', ') }')
                // console.log(parseVariable(code))
                resList.push(parseCode(code, query))
                code = ''
            }
        }
        else if (code && !code.endsWith('}')) {
            code += `"${tmpltList[i]}"`
        }
        else {
            resList.push(tmpltList[i])
        }
    }
    return resList.join('')
    }
