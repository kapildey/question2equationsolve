$(document).ready(function () {
  $("#form__solve").on("click", function () {
    const eqn1 = $("#eq1").val();
    const eqn2 = $("#eq2").val();
    var equation = parseEquation(eqn1);

    if (equation === null) alert("null");
    var inpDataset = [];
    for (var i = -10; i <= 10; i += 0.1) {
      console.log(parseFloat(i.toFixed(1)));
      let xVal = parseFloat(i.toFixed(1));
      let temp = {
        x: xVal,
        y: equation(xVal),
      };
      inpDataset.push(temp);
    }
    var scatterChart = new Chart($("#myChart"), {
      type: "scatter",
      data: {
        datasets: [
          {
            label: "Graph for x from -10 to 10 for the given Equation",
            data: inpDataset,
          },
        ],
      },
      pointBackgroundColor: "red",
      options: {
        scales: {
          xAxes: [
            {
              type: "linear",
              position: "bottom",
            },
          ],
        },
      },
    });
  });

  var codeText = "";
  function parseEquation(input) {
    try {
      input = input.replace(/\s+/g, "");
      input = input.replace(/([\-\+])([xy])/g, "$11$2");

      var newTerm = () => {
        term = { variable: null, integer: 1, left: left };
      };
      var pushTerm = () => {
        terms.push(term);
        term = null;
      };

      var reg = /[xy=]|[\-\+]??[0-9\.eE]+/g;
      var parts = input.match(reg);
      var terms = [];
      var term = null;
      var left = true;
      parts.forEach((p) => {
        if (p === "x" || p === "y") {
          if (term !== null && term.variable !== null) {
            pushTerm();
          }
          if (term === null) {
            newTerm();
          }
          term.variable = p;
        } else if (p === "=") {
          if (!left) {
            alert("Unxpected `=` in equation.");
          }
          if (term === null) {
            alert("No left hand side of equation.");
          }
          terms.push(term);
          term = null;
          left = false;
        } else {
          if (isNaN(p)) {
            alert("Unknown variableue '" + p + "' in equation");
          }
          if (term !== null && (p[0] === "+" || p[0] === "-")) {
            pushTerm();
          }
          if (term === null) {
            newTerm();
          }
          term.integer *= Number(p);
        }
      });

      if (term !== null) {
        pushTerm();
      }

      var integerX = 0;
      var integerY = 0;
      var variableC = 0;
      terms.forEach((t) => {
        t.integer *= !t.left ? -1 : 1;
        if (t.variable === "y") {
          integerY += -t.integer; // reverse sign
        } else if (t.variable === "x") {
          integerX += t.integer;
        } else {
          variableC += t.integer;
        }
      });

      var code =
        "return (" +
        integerX +
        " * x  + (" +
        variableC +
        ")) / " +
        integerY +
        ";\n";
      codeText = code;
      var equation = new Function("x", code);
      $("#equationformed").replaceWith(
        `<div id="equationformed"><p>Formulated Equation: y = ${
          code.split("return ")[1]
        }</p></div>`
      );
      return equation;
    } catch (e) {
      alert("Please enter a proper Linear equation");
    }
  }
});
