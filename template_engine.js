const CODE_REGEX = /<\? ([^\?>]+)? \?>/g;
const VARIABLE_REGEX = /<\?= ([^\?>]+)? \?>/g;
const PLACEHOLDERS = /(<\?[^\?>]+? \?>)/g


const isUncomleted = (code) => {
    return code && !code.endsWith('}')
}


const addString2Code = (code, string) => {
  code += `"${string}"`
  return code
}


const addString2Result = (result, string) => {
  return result.push(string)
}


const parseCodeString = (code, query) => {
  code = code.replace('{', '{ result.push(').replace('}', ') }')
  Object.keys(query.substitutions).forEach(key => {
    code = `let ${key} = query.substitutions.${key}; ${code}`;
  });
  code = `
          let result = [];
          ${code};
          result.join(", ")
          `
    return eval(code)

}


const parseVariableString = (variable, query) => {
    Object.entries(query.substitutions).forEach(([key, val]) => {
      variable = `let ${key} = query.substitutions.${key}; ${variable}`;
    });
    return eval(variable)
}


export function parseTemplate (query) {
  const tmpl = query.template
  let tmpltList = tmpl.split(PLACEHOLDERS)
  let resList = []
  let code = ''
  for (let i = 0; i < tmpltList.length; i += 1) {
    let codeString = CODE_REGEX.exec(tmpltList[i])
    let substitutionString = VARIABLE_REGEX.exec(tmpltList[i])
    if (substitutionString) {
      code += substitutionString[1]
      resList.push(parseVariableString(code, query))
      code = ''
    }
    else if (codeString) {
      code += codeString[1]
      if (code.endsWith('}')) {
        resList.push(parseCodeString(code, query))
        code = ''
      }
    }
    else if (isUncomleted(code)) {
      code = addString2Code(code, tmpltList[i])
    }
    else {
      addString2Result(resList, tmpltList[i])
    }
  }
  return resList.join('')
}
