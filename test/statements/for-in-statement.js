/**
 * Copyright 2014 Shape Security, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var testParse = require("../assertions").testParse;
var testParseFailure = require("../assertions").testParseFailure;
var stmt = require("../helpers").stmt;

suite("Parser", function () {
  suite("for in statement", function () {

    testParse("for(x in list) process(x);", stmt,
      { type: "ForInStatement",
        body:
          { type: "ExpressionStatement",
            expression:
              { type: "CallExpression",
                callee: { type: "IdentifierExpression", name: "process" },
                arguments:
                  [ { type: "IdentifierExpression", name: "x" } ] } },
        left: { type: "BindingIdentifier", name: "x" },
        right: { type: "IdentifierExpression", name: "list" } }
    );

    testParse("for (var x in list) process(x);", stmt,
      {
        type: "ForInStatement",
        left: {
          type: "VariableDeclaration",
          kind: "var",
          declarators: [{ type: "VariableDeclarator", binding: { type: "BindingIdentifier", name: "x" }, init: null }]
        },
        right: { type: "IdentifierExpression", name: "list" },
        body: {
          type: "ExpressionStatement",
          expression: {
            type: "CallExpression",
            callee: { type: "IdentifierExpression", name: "process" },
            arguments: [{ type: "IdentifierExpression", name: "x" }]
          }
        }
      }
    );

    testParse("for (let x in list) process(x);", stmt,
      {
        type: "ForInStatement",
        left: {
          type: "VariableDeclaration",
          kind: "let",
          declarators: [{ type: "VariableDeclarator", binding: { type: "BindingIdentifier", name: "x" }, init: null }]
        },
        right: { type: "IdentifierExpression", name: "list" },
        body: {
          type: "ExpressionStatement",
          expression: {
            type: "CallExpression",
            callee: { type: "IdentifierExpression", name: "process" },
            arguments: [{ type: "IdentifierExpression", name: "x" }]
          }
        }
      }
    );

    testParse("for(var a in b);", stmt,
      {
        type: "ForInStatement",
        left: {
          type: "VariableDeclaration",
          kind: "var",
          declarators: [{ type: "VariableDeclarator", binding: { type: "BindingIdentifier", name: "a" }, init: null }]
        },
        right: { type: "IdentifierExpression", name: "b" },
        body: { type: "EmptyStatement" }
      }
    );

    testParse("for(a in b);", stmt,
      { type: "ForInStatement",
        body: { type: "EmptyStatement" },
        left: { type: "BindingIdentifier", name: "a" },
        right: { type: "IdentifierExpression", name: "b" } }
    );

    testParse("for(a in b);", stmt,
      {
        type: "ForInStatement",
        left: { type: "BindingIdentifier", name: "a" },
        right: { type: "IdentifierExpression", name: "b" },
        body: { type: "EmptyStatement" }
      }
    );

    testParse("for(a.b in c);", stmt,
      {
        type: "ForInStatement",
        left: { type: "StaticMemberExpression", object: { type: "IdentifierExpression", name: "a" }, property: "b" },
        right: { type: "IdentifierExpression", name: "c" },
        body: { type: "EmptyStatement" }
      }
    );

    testParse("for(let of in of);", stmt, {
      type: "ForInStatement",
      left: {
        type: "VariableDeclaration",
        kind: "let",
        declarators: [{ type: "VariableDeclarator", binding: { type: "BindingIdentifier", name: "of" }, init: null }]
      },
      right: { type: "IdentifierExpression", name: "of" },
      body: { type: "EmptyStatement" }
    });

    testParse("for(const a in b);", stmt, {
      type: "ForInStatement",
      left: {
        type: "VariableDeclaration",
        kind: "const",
        declarators: [{ type: "VariableDeclarator", binding: { type: "BindingIdentifier", name: "a" }, init: null }]
      },
      right: { type: "IdentifierExpression", name: "b" },
      body: { type: "EmptyStatement" }
    });

    testParse("for({a=0} in b);", stmt, {
      type: "ForInStatement",
      left: {
        type: "ObjectBinding",
        properties: [{
          type: "BindingPropertyIdentifier",
          binding: { type: "BindingIdentifier", name: "a" },
          init: { type: "LiteralNumericExpression", value: 0 } }]
      },
      right: { type: "IdentifierExpression", name: "b" },
      body: { type: "EmptyStatement" }
    });

    testParseFailure("for(let a = 0 in b);", "Invalid variable declaration in for-in statement");
    testParseFailure("for(const a = 0 in b);", "Invalid variable declaration in for-in statement");
    testParseFailure("for(let ? b : c in 0);", "Invalid left-hand side in for-in");
  });
});
