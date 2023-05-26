/**
 * Copyright (c) 2013-present, creativeLabs Lukasz Holeczek.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// 'use strict'

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,jsx}'],
  coverageDirectory: 'coverage',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['src/jest.setup.js'],
  transformIgnorePatterns: [
    "node_modules/(?!(@coreui|tippy.js|perfect-scrollbar)/)"
  ],
  moduleDirectories:[
    'node_modules',
    '__test__',
    __dirname,
  ],
  
};

