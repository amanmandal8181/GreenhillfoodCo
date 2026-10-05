# Greenhill Food Co-op — Weekly Ordering System

A web application for Greenhill Food Co-op, a volunteer-run community food
co-operative. It replaces the paper order form and the coordinator's
spreadsheet, so members enter their own weekly orders and the coordinator can
see what the round adds up to.

Built for COMP6012 Managing Information Technology Projects, Assessment 2.

## What it does

**Members**

- View the products available in the current ordering round
- Place an order, using whole numbers for products sold by the unit and
  decimal kilograms for products sold by weight
- Change or cancel an order while the round is open
- View their own orders only

**Coordinator**

- Add, edit and withdraw products, each sold either per unit or per kilogram
- View every order placed in the current round

## Running the application

No build step, no server and no dependencies.

1. Clone the repository.
2. Open `index.html` in a web browser.

Data is stored in the browser's local storage, so it stays on the machine
between visits. To reset to the sample data, clear the site data for the page.

## Running the tests

The pricing rules are the core of the application, so they are tested
separately from the user interface.

- **In a browser:** open `tests.html`. Each test shows its requirement,
  expected result, actual result and pass or fail.
- **In Node:** run `node tests.js` from the project folder.

The test data uses the figures from the Round 33 order form in the case study,
so the expected values can be checked against the client's own paperwork.

## Project structure

| File | Purpose |
|---|---|
| `index.html` | Page structure: shop, my orders, coordinator dashboard |
| `style.css` | All styling |
| `pricing.js` | Pricing and quantity rules, with no DOM code so they can be tested |
| `script.js` | Application logic, rendering and local storage |
| `tests.js` | Pricing test cases |
| `tests.html` | Test runner page |

## Pricing rules

Products are sold in one of two ways, which is the rule the paper process kept
getting wrong:

- **Per unit** — ordered as whole numbers. A dozen eggs at $7.50, ordered 2, is
  $15.00.
- **Per kilogram** — ordered as decimals. 1.5 kg of oats at $3.40 per kg is
  $5.10, and 0.25 kg of coffee at $32.00 per kg is $8.00.

Line totals are rounded to the nearest cent. They are not rounded to the
nearest ten cents, because the treasurer needs the exact figure.

Each order line stores the price that applied when the order was placed, so a
later price change does not alter an existing order.

## Known limitations

- Data is held in browser local storage rather than a shared database, so
  orders are not shared between devices.
- Charges are based on the quantity ordered, not the weight actually packed on
  Thursday. Recording packed weights is in the product backlog.
- Login is a role selector rather than authenticated accounts with passwords.
- Ordering rounds are not modelled in software, so the Sunday cutoff is not
  enforced by the application.
- The coordinator cannot yet see the round totalled by product. This is the
  highest-priority item in the remaining product backlog.
- Orders are not linked to individual member accounts, and there is no member
  management or login.

## Out of scope

Online payments, bank reconciliation, accounting integration, supplier
integration, SMS and email notifications, a mobile app, the delivery run, the
seed library and the compost scheme. These are recorded in the product backlog
in Jira.
