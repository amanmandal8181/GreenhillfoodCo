/* =====================================================
   GREENHILL FOOD CO-OP
   PRICING TESTS

   Run in the browser by opening tests.html,
   or in Node with:  node tests.js
===================================================== */

if (typeof require !== "undefined") {

    var {
        roundToCents,
        isValidQuantity,
        calculateLineTotal,
        calculateOrderTotal
    } = require("./pricing.js");

}


const results = [];


function check(id, requirement, description, expected, actual) {

    const pass = expected === actual;

    results.push({
        id: id,
        requirement: requirement,
        description: description,
        expected: expected,
        actual: actual,
        pass: pass
    });

}


/* Test data taken from the Round 33 order form in the case study. */

const oats = { name: "Rolled Oats", price: 3.40, saleType: "kg" };
const coffee = { name: "Coffee Beans", price: 32.00, saleType: "kg" };
const pumpkin = { name: "Pumpkin", price: 2.60, saleType: "kg" };
const eggs = { name: "Eggs, Dozen", price: 7.50, saleType: "unit" };
const tahini = { name: "Tahini 375 g Jar", price: 9.80, saleType: "unit" };


/* --- Weight-based pricing --- */

check("T01", "US12", "1.5 kg of oats at $3.40 per kg",
    5.10, calculateLineTotal(oats, 1.5));

check("T02", "US12", "0.25 kg of coffee at $32.00 per kg",
    8.00, calculateLineTotal(coffee, 0.25));

check("T03", "US12", "1.5 kg of pumpkin at $2.60 per kg",
    3.90, calculateLineTotal(pumpkin, 1.5));

check("T04", "US12", "1.58 kg of oats rounds to the nearest cent",
    5.37, calculateLineTotal(oats, 1.58));


/* --- Unit-based pricing --- */

check("T05", "US12", "2 dozen eggs at $7.50 each",
    15.00, calculateLineTotal(eggs, 2));

check("T06", "US12", "1 jar of tahini at $9.80",
    9.80, calculateLineTotal(tahini, 1));


/* --- Quantity validation --- */

check("T07", "US02", "A unit product rejects a decimal quantity",
    false, isValidQuantity(eggs, 1.5));

check("T08", "US02", "A weighed product accepts a decimal quantity",
    true, isValidQuantity(oats, 1.5));

check("T09", "US02", "A quantity of zero is rejected",
    false, isValidQuantity(oats, 0));

check("T10", "US02", "A negative quantity is rejected",
    false, isValidQuantity(oats, -2));


/* --- Order totals --- */

check("T11", "US02", "Order total is the sum of its line totals",
    54.85,
    calculateOrderTotal([
        { total: calculateLineTotal(oats, 1.5) },
        { total: calculateLineTotal({ price: 4.10, saleType: "kg" }, 2) },
        { total: calculateLineTotal({ price: 4.85, saleType: "kg" }, 1) },
        { total: calculateLineTotal(coffee, 0.25) },
        { total: calculateLineTotal(tahini, 1) },
        { total: calculateLineTotal(eggs, 2) },
        { total: calculateLineTotal(pumpkin, 1.5) }
    ]));

check("T12", "US12", "Totals are not rounded to the nearest ten cents",
    5.37, roundToCents(5.372));
    
check("T13", "US02", "An order containing one line item returns the correct total",
    5.10,
    calculateOrderTotal([
        { total: calculateLineTotal(oats, 1.5) }
    ]));

/* --- Reporting --- */

const passed = results.filter(r => r.pass).length;


if (typeof document !== "undefined") {

    document.getElementById("summary").innerHTML = `
        <strong>${passed} of ${results.length} tests passed</strong>
    `;

    document.getElementById("summary").className =
        passed === results.length ? "summary pass" : "summary fail";

    document.getElementById("resultsBody").innerHTML =
        results.map(result => `
            <tr>
                <td>${result.id}</td>
                <td>${result.requirement}</td>
                <td>${result.description}</td>
                <td>${result.expected}</td>
                <td>${result.actual}</td>
                <td class="${result.pass ? "pass" : "fail"}">
                    ${result.pass ? "PASS" : "FAIL"}
                </td>
            </tr>
        `).join("");

} else {

    results.forEach(result => {

        console.log(
            `${result.pass ? "PASS" : "FAIL"}  ${result.id}  ${result.description}` +
            `  (expected ${result.expected}, got ${result.actual})`
        );

    });

    console.log(`\n${passed} of ${results.length} tests passed`);

    if (passed !== results.length)
        process.exitCode = 1;

}
