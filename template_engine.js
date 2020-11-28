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
  let splittedTemplate = tmpl.split(PLACEHOLDERS)
  let result = []
  let code = ''
  for (let i = 0; i < splittedTemplate.length; i += 1) {
    let codeString = CODE_REGEX.exec(splittedTemplate[i])
    let substitutionString = VARIABLE_REGEX.exec(splittedTemplate[i])
    if (substitutionString) {
      code += substitutionString[1]
      result.push(parseVariableString(code, query))
      code = ''
    }
    else if (codeString) {
      code += codeString[1]
      if (code.endsWith('}')) {
        result.push(parseCodeString(code, query))
        code = ''
      }
    }
    else if (isUncomleted(code)) {
      code = addString2Code(code, splittedTemplate[i])
    }
    else {
      addString2Result(result, splittedTemplate[i])
    }
  }
  return result.join('')
}
