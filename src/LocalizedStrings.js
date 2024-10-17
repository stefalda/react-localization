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

import React from 'react';
import LocalizedStrings from 'localized-strings';
const placeholderRegex = /(\{[\d|\w]+\})/;

/**
 * Format the passed string replacing the numbered or tokenized placeholders
 * eg. 1: I'd like some {0} and {1}, or just {0}
 * eg. 2: I'd like some {bread} and {butter}, or just {bread}
 * Use example:
 * eg. 1: strings.formatString(strings.question, strings.bread, strings.butter)
 * eg. 2: strings.formatString(strings.question, { bread: strings.bread, butter: strings.butter }
 *
 * THIS METHOD OVERRIDE the one of the parent class by adding support for JSX code
*/
LocalizedStrings.prototype.formatString = (str, ...valuesForPlaceholders) => {
        let hasObject = false;
        const res = (str || '')
            .split(placeholderRegex)
            .filter(textPart => !!textPart)
            .map((textPart, index) => {
                if (textPart.match(placeholderRegex)) {
                    const matchedKey = textPart.slice(1, -1);
                    let valueForPlaceholder = valuesForPlaceholders[matchedKey];

                    // If no value found, check if working with an object instead
                    if(valueForPlaceholder == undefined && valuesForPlaceholders?.[0]?.[matchedKey]) {
                      const valueFromObjectPlaceholder = valuesForPlaceholders[0][matchedKey];
                      if(valueFromObjectPlaceholder !== undefined) {
                        valueForPlaceholder = valueFromObjectPlaceholder;
                      } else {
                        // If value still isn't found, then it must have been undefined/null
                        return valueForPlaceholder;
                      }
                    }

                    if(React.isValidElement(valueForPlaceholder)) {
                      hasObject = true;
                      return React.Children.toArray(valueForPlaceholder).map(component => ({...component, key: index.toString()}));
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
