import { colorList, colors } from './colors/_colorlist.js';

/**
 * replace _vars.scss values with values from varEditor()
 *
 * function replacer(inputString, varEditor, replacementValue, callback) {
 *   let varNames = [];
 *   let testPatterns = [];
 *   inputString = inputString.replace(regexPatternCreator(varEditor, varNames, testPatterns), (...args) => {
 *     return callback(varNames, replacementValue, ...args);
 *   });
 *   return inputString;
 * }
 */
export default function replacer(inputString, varType, replacementValue, variable = null) {
  // edit _vars.scss
  function varEditor(input, varNameArray, regexArray) {
    /**
    * search for capital letters and convert to hyphen + lowercase letter
    * e.g. darkPrimary => dark-primary
    */
    if (input.match(/[A-Z]/g) !== null) {
      let capitalLetters = input.match(/[A-Z]/g);

      // check if variable name contains more than 1 capital letter
      if (capitalLetters.length > 1) {
        capitalLetters.forEach((element, index, array) => {
          input = input.replace(capitalLetters[index], `-${capitalLetters[index].toLowerCase()}`);
        });
      } else {
        [capitalLetters] = input.match(/[A-Z]/g);
        input = input.replace(capitalLetters, `-${capitalLetters.toLowerCase()}`);
      }
      regexArray.push(`(\\$${input}: .*?;)`)
      varNameArray.push(input);
    } else {
      regexArray.push(`(\\$${input}: .*?;)`)
      varNameArray.push(input);
    }
  }

  // create regexp patterns
  function regexPatternCreator(callback, varNameArray, regexArray) {
    callback(varNameArray, regexArray);
    return new RegExp(regexArray.join('|'), 'g');
  }

  // callback for booleans
  function booleanCallback(varNames, replacementValue, ...args) {
    if (args[1]) {
      return `$${varNames[0]}: ${replacementValue};`;
    }
  }

  let varNames = [];
  let testPatterns = [];

  // replace color variables
  if (varType === 'color') {
    inputString = inputString.replace(regexPatternCreator((varNames, testPatterns) => {
      for (var key in colors) {
        if (colors.hasOwnProperty(key)) {
          varEditor(key, varNames, testPatterns);
        }
      }
    }, varNames, testPatterns), (...args) => {
      for (var i = 0; i < replacementValue.length; i++) {
        if (args[i + 1]) {
          /**
           * since the default color values are objects
           * we need to evaluate differently if unchanged by user
           */
          if (typeof colors[replacementValue[i]] === 'object') {
            let color = colors[replacementValue[i]];
            return `$${varNames[i]}: ${colorList[color.color][color.colorCode]};`;
          } else if (typeof colors[replacementValue[i]] === 'string') {
            return `$${varNames[i]}: ${colors[replacementValue[i]]};`;
          }
        }
      }
    });
    return inputString;
  }

  // replace boolean variables
  if (varType === 'bool') {
    inputString = inputString.replace(regexPatternCreator((varNames, testPatterns) => {
      varEditor(variable, varNames, testPatterns);
    }, varNames, testPatterns), (...args) => {
      return booleanCallback(varNames, replacementValue, ...args);
    });
    return inputString;
  }
}