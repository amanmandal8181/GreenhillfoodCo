/* =====================================================
   GREENHILL FOOD CO-OP
   PRICING RULES

   The co-op sells products in two ways:
     - "unit" products are ordered as whole numbers
       (a jar of tahini, a dozen eggs)
     - "kg" products are scooped from bulk sacks and
       ordered as decimal kilograms (1.5 kg of oats)

   These functions contain no DOM code so they can be
   reused by the application and by the test page.
===================================================== */


/* Round a money value to the nearest cent. */
function roundToCents(value) {

    return Math.round((value + Number.EPSILON) * 100) / 100;

}


/* Round a weight to the nearest gram. */
function roundToGrams(value) {

    return Math.round((value + Number.EPSILON) * 1000) / 1000;

}


/* Is this a quantity the co-op can actually supply? */
function isValidQuantity(product, quantity) {

    const amount = Number(quantity);

    if (!product)
        return false;

    if (isNaN(amount) || amount <= 0)
        return false;

    if (product.saleType === "unit" && !Number.isInteger(amount))
        return false;

    return true;

}


/* Line total for one order line. */
function calculateLineTotal(product, quantity) {

    if (!isValidQuantity(product, quantity))
        return 0;

    return roundToCents(product.price * Number(quantity));

}


/* Order total is the sum of the rounded line totals. */
function calculateOrderTotal(items) {

    return roundToCents(
        items.reduce(
            (sum, item) => sum + item.total,
            0
        )
    );

}


/* How much a +/- button moves the quantity. */
function quantityStep(product) {

    return product.saleType === "kg" ? 0.25 : 1;

}


/* Display helpers. */
function unitLabel(product) {

    return product.saleType === "kg" ? "per kg" : "each";

}


function quantityLabel(product, quantity) {

    return product.saleType === "kg"
        ? `${quantity} kg`
        : `${quantity}`;

}


/* Exported for the Node test runner. */
if (typeof module !== "undefined") {

    module.exports = {
        roundToCents,
        roundToGrams,
        isValidQuantity,
        calculateLineTotal,
        calculateOrderTotal,
        quantityStep,
        unitLabel,
        quantityLabel
    };

}
