const codeRegex = /<\? ([^\?>]+)? \?>/g;
const substitutionRegex = /<\?= ([^\?>]+)? \?>/g;
const placeholders = /(<\?[ |=][^\?>]+? \?>)/g;

const isUncomleted = (code) => {
  return code && !code.endsWith("}");
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

const parseSubstitutionString = (substitution, query) => {
  return eval(`query.substitutions.${substitution}`);
};

export function parseTemplate(query) {
  const template = query.template;
  const splittedTemplate = template.split(placeholders);
  let result = [];
  let code = "";
  splittedTemplate.forEach((templateElement) => {
    let matchCode = codeRegex.exec(templateElement);
    let matchSubstitution = substitutionRegex.exec(templateElement);
    if (matchSubstitution) {
      const substitutionVal = parseSubstitutionString(
        matchSubstitution[1],
        query
      );
      result.push(substitutionVal);
    } else if (matchCode) {
      code += matchCode[1];
      if (code.endsWith("}")) {
        const codeResult = parseCodeString(code, query);
        result.push(codeResult);
        code = "";
      }
    } else if (isUncomleted(code)) {
      code += `"${templateElement}"`;
    } else {
      result.push(templateElement);
    }
  });
  return result.join("");
}
