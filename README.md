# ledger-tools

Some tools for using with ledger or hledger software.

<!--toc:start-->
- [ledger-tools](#ledger-tools)
  - [Commands](#commands)
<!--toc:end-->

- [Get symbol prices from Tradingview](./prices/tradingview/)

## Sample ROI
<!-- BEGIN ROI -->
```text
=== ETH ===
+---++------------+------------++------------------------------------+-----------+------------------------------------+-------------------------------------++---------+---------+
|   ||      Begin |        End ||                      Value (begin) |  Cashflow |                        Value (end) |                                 PnL ||     IRR |     TWR |
+===++============+============++====================================+===========+====================================+=====================================++=========+=========+
| 1 || 2021-01-01 | 2021-12-31 ||                                  0 | 97.50 EUR |  0.02686323 ETH @@ 97.50010889 EUR |   0.02686323 ETH @@ 97.50010889 EUR ||   0.00% |   0.00% |
|   ||            |            ||                                    |           |                                    |                          -97.50 EUR ||         |         |
| 2 || 2022-01-01 | 2022-12-31 ||  0.02686323 ETH @@ 97.50010889 EUR |  9.75 EUR | 0.03168646 ETH @@ 107.25011394 EUR |    0.00482323 ETH @@ 9.75000505 EUR ||   0.00% |   0.00% |
|   ||            |            ||                                    |           |                                    |                           -9.75 EUR ||         |         |
| 3 || 2023-01-01 | 2023-12-31 || 0.03168646 ETH @@ 107.25011394 EUR |         0 |                          53.98 EUR | -0.03168646 ETH @@ 107.25011394 EUR || -49.67% | -49.67% |
|   ||            |            ||                                    |           |                                    |                           53.98 EUR ||         |         |
+---++------------+------------++------------------------------------+-----------+------------------------------------+-------------------------------------++---------+---------+

=== BTC ===
+---++------------+------------++-----------------------------------+-----------+-----------------------------------+------------------------------------++--------+--------+
|   ||      Begin |        End ||                     Value (begin) |  Cashflow |                       Value (end) |                                PnL ||    IRR |    TWR |
+===++============+============++===================================+===========+===================================+====================================++========+========+
| 1 || 2022-01-01 | 2022-12-31 ||                                 0 | 13.65 EUR | 0.00049285 BTC @@ 13.65008586 EUR |  0.00049285 BTC @@ 13.65008586 EUR ||  0.00% |  0.00% |
|   ||            |            ||                                   |           |                                   |                         -13.65 EUR ||        |        |
| 2 || 2023-01-01 | 2023-12-31 || 0.00049285 BTC @@ 13.65008586 EUR |         0 |                         16.15 EUR | -0.00049285 BTC @@ 13.65008586 EUR || 18.29% | 18.29% |
|   ||            |            ||                                   |           |                                   |                          16.15 EUR ||        |        |
+---++------------+------------++-----------------------------------+-----------+-----------------------------------+------------------------------------++--------+--------+

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
