'use strict';
/**
 * Simple module to localize the React interface using the same syntax
 * used in the ReactNativeLocalization module
 * (https://github.com/stefalda/ReactNativeLocalization)
 *
 * Originally developed by Stefano Falda (stefano.falda@gmail.com)
 *
 * It uses a call to the Navigator/Browser object to get the current interface language,
 * then display the correct language strings or the default language (the first
 * one if a match is not found).
 *
 * This library has been refactored to use the newly created localized-strings package so to
 * unify the code and make it easier to mantain
 *
 * How to use:
 * Check the instructions at:
 * https://github.com/stefalda/react-localization
 */

import LocalizedStrings, { type LocalizedStringsMethods } from 'localized-strings';
import React from 'react';
const placeholderRegex = /(\{\w+\})/;
const referenceRegex = /(\$ref\{[\w|.]+\})/;

/**
 * Format the passed string replacing the numbered or tokenized placeholders
 * eg. 1: I'd like some {0} and {1}, or just {0}
 * eg. 2: I'd like some {bread} and {butter}, or just {bread}
 * Use example:
 * eg. 1: strings.formatString(strings.question, strings.bread, strings.butter)
 * eg. 2: strings.formatString(strings.question, { bread: strings.bread, butter: strings.butter }
 *
 * THIS METHOD OVERRIDE the one of the parent class only to add support for JSX
 * values. The string-key resolution (dot-notation) and the $ref{...} expansion
 * are kept in sync with the localized-strings implementation so that the
 * behaviour doesn't diverge from the parent package.
*/
LocalizedStrings.prototype.formatString = function (
  this: LocalizedStringsMethods,
  str: string,
  ...valuesForPlaceholders: any
) {
  // Resolve the passed string as a key (dot-notation supported), falling back
  // to the string itself when it isn't a known key, exactly like the parent.
  const source = str ? this.getString(str, null, true) || str : '';
  // Expand any $ref{...} reference before doing the placeholder substitution.
  const resolved = source
    .split(referenceRegex)
    .filter(textPart => !!textPart)
    .map(textPart => {
      if (textPart.match(referenceRegex)) {
        const referenceKey = textPart.slice(5, -1);
        return this.getString(referenceKey) || `$ref(id:${referenceKey})`;
      }
      return textPart;
    })
    .join('');

  let hasObject = false;
  const res = resolved
    .split(placeholderRegex)
    .filter(textPart => !!textPart)
    .map((textPart, index) => {
      if (textPart.match(placeholderRegex)) {
        const matchedKey = textPart.slice(1, -1);
        let valueForPlaceholder = valuesForPlaceholders[matchedKey];

        // If no value found, check if working with an object instead
        if (valueForPlaceholder == undefined) {
          const valueFromObjectPlaceholder = valuesForPlaceholders[0]?valuesForPlaceholders[0][matchedKey]:undefined;
          if (valueFromObjectPlaceholder !== undefined) {
            valueForPlaceholder = valueFromObjectPlaceholder;
          } else {
            // If value still isn't found, then it must have been undefined/null
            return valueForPlaceholder;
          }
        }

        if (React.isValidElement(valueForPlaceholder)) {
          hasObject = true;
          // cloneElement is the supported way to add a key to an existing
          // element; spreading the element object is discouraged in React
          return React.Children.toArray(valueForPlaceholder).map(component =>
            React.cloneElement(component as React.ReactElement, { key: index.toString() })
          );
        }

        return valueForPlaceholder;
      }
      return textPart;
    });
  // If the results contains a object return an array otherwise return a string
  if (hasObject) return res;
  return res.join('');
};

export default LocalizedStrings;
