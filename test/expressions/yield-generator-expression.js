/**
 * Copyright 2015 Shape Security, Inc.
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


var Shift = require("shift-ast");

var testParse = require("../assertions").testParse;
var testParseFailure = require("../assertions").testParseFailure;
var expr = require("../helpers").expr;
var stmt = require("../helpers").stmt;

suite("Parser", function () {
  var emptyBody = new Shift.FunctionBody([], []);

  suite("yield", function () {
    function yd(p) {
      return p.body.statements[0].body.statements.map(function (es) {
        return es.expression
      });
    }

    testParse("function*a(){yield*a}", yd, [new Shift.YieldGeneratorExpression(new Shift.IdentifierExpression(new Shift.Identifier("a")))]);
    testParse("function a(){yield*a}", yd, [new Shift.BinaryExpression("*", new Shift.IdentifierExpression(new Shift.Identifier("yield")), new Shift.IdentifierExpression(new Shift.Identifier("a")))]);

    testParseFailure("function *a(){yield\n*a}", "Unexpected token *");
    testParseFailure("function *a(){yield*}", "Unexpected token }");
  });
});