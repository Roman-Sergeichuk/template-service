const codeRegex = /<\? ([^\?>]+)? \?>/g;
const variableRegex = /<\?= ([^\?>]+)? \?>/g;
const placeholders = /(<\?[^\?>]+? \?>)/g;

const isUncomleted = (code) => {
  return code && !code.endsWith("}");
};

const addString2Code = (code, string) => {
  code += `"${string}"`;
  return code;
};

const addString2Result = (result, string) => {
  return result.push(string);
};

const parseCodeString = (code, query) => {
  code = code.replace("{", "{ result.push(").replace("}", ") }");
  if (query.substitutions) {
    Object.keys(query.substitutions).forEach((key) => {
      code = `
              let ${key} = query.substitutions.${key}; 
              ${code}
             `;
    });
  }
  code = `
          let result = [];
          ${code};
          result.join(", ")
         `;
  return eval(code);
};

const parseVariableString = (variable, query) => {
  if (query.substitutions) {
    Object.keys(query.substitutions).forEach((key) => {
      variable = `
                  let ${key} = query.substitutions.${key}; 
                  ${variable}
                 `;
    });
  }
  return eval(variable);
};

export function parseTemplate(query) {
  const template = query.template;
  const splittedTemplate = template.split(placeholders);
  let result = [];
  let code = "";
  splittedTemplate.forEach((templateElement) => {
    let matchCode = codeRegex.exec(templateElement);
    let matchVariable = variableRegex.exec(templateElement);
    if (matchVariable) {
      result.push(parseVariableString(matchVariable[1], query));
    } else if (matchCode) {
      code += matchCode[1];
      if (code.endsWith("}")) {
        result.push(parseCodeString(code, query));
        code = "";
      }
    } else if (isUncomleted(code)) {
      code = addString2Code(code, templateElement);
    } else {
      addString2Result(result, templateElement);
    }
  });
  return result.join("");
}
