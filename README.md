# ledger-tools

Some tools for using with ledger or hledger software.

<!--toc:start-->
- [ledger-tools](#ledger-tools)
  - [Provider](#provider)
    - [Prices](#prices)
  - [Sample ROI](#sample-roi)
  - [Commands](#commands)
<!--toc:end-->

## Provider

### Prices

| Provider                             | Symbols                                             | Price | History |
| -                                    | -                                                   | -     | -       |
| [tradingview](./prices/tradingview/) | bonds, crypto, forex, funds, futures, index, stocks | ✔️     | ❌      |
| [yahoo](./prices/yahoo/)             | bonds, crypto, forex, funds, futures, index, stocks | ✔️     | ✔️       |

## Sample ROI
<!-- BEGIN ROI -->
```text
=== ETH ===
+---++------------+------------++---------------+------------+-------------+------------++---------+---------+
|   ||      Begin |        End || Value (begin) |   Cashflow | Value (end) |        PnL ||     IRR |     TWR |
+===++============+============++===============+============+=============+============++=========+=========+
| 1 || 2021-12-24 | 2023-10-30 ||             0 | 107.25 EUR |   53.98 EUR | -53.27 EUR || -31.50% | -30.98% |
+---++------------+------------++---------------+------------+-------------+------------++---------+---------+

=== BTC ===
+---++------------+------------++---------------+-----------+-------------+----------++--------+--------+
|   ||      Begin |        End || Value (begin) |  Cashflow | Value (end) |      PnL ||    IRR |    TWR |
+===++============+============++===============+===========+=============+==========++========+========+
| 1 || 2022-06-07 | 2023-10-30 ||             0 | 13.65 EUR |   16.15 EUR | 2.50 EUR || 12.75% | 12.75% |
+---++------------+------------++---------------+-----------+-------------+----------++--------+--------+

=== TOTAL ===
+---++------------+------------++---------------+------------+-------------+-------------++---------+---------+
|   ||      Begin |        End || Value (begin) |   Cashflow | Value (end) |         PnL ||     IRR |     TWR |
+===++============+============++===============+============+=============+=============++=========+=========+
| 1 || 2021-12-24 | 2023-10-30 ||             0 | 316.53 EUR |  138.02 EUR | -178.51 EUR || -36.76% | -36.12% |
+---++------------+------------++---------------+------------+-------------+-------------++---------+---------+

```
<!-- END ROI -->

## Commands
<!-- BEGIN COMMAND -->
```text
justfile commands:
    help                   # This help
    symbols                # Get trading ledger symbols
    investment *ARGS       # Report investment transaction
    prices provider        # Download price from provider
    roi symbols=ALLSYMBOLS # Show Return Of Investment
    updatecommand          # Update commands documentation
    updateroi              # Update Return Of Investment
    updatedoc              # Update all documentation
    view                   # Run command interactively, view the result in realtime
```
<!-- END COMMAND -->
