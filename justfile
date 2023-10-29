#!/usr/bin/env just -f

# Ledget global options: 
# -N - no total
# -B - Cost
# -V - Value

TODAY := `date +%Y-%m-%d`
ALLSYMBOLS := replace(`hledger -f main.ledger account trading | cut -d: -f3`,"\n"," ")

# This help
@help:
    just -lu --list-heading=$'{{ file_name(justfile()) }} commands:\n'

# Get trading ledger symbols
@symbols:
   echo {{ALLSYMBOLS}} 

# Report investment transaction
@investment *ARGS:
    hledger -f main.ledger bs --drop 1 {{ ARGS }}

# Download price from provider
@prices provider:
    LEDGER_FILE_PRICES=prices/tradingview/prices.ledger deno run -A prices/{{ provider }}/get_prices.ts

# Show Return Of Investment
roi symbols=ALLSYMBOLS: 
    #!/usr/bin/env sh
    for symbol in {{symbols}}; do 
        echo "== '$symbol' =="
        hledger roi -f main.ledger -Y --inv $symbol --pnl "unrealized" --value=then -e 2024 -Y
    done

# Update help documentation
@updatedochelp:
    sed -i '0,/## Help/!d' README.md
    echo "\`\`\`text" >> README.md
    just >> README.md
    echo "\`\`\`" >> README.md


# Run command interactively, view the result in realtime
@view:
    just --choose --chooser="fzf --margin 0% --reverse --preview-window=right,80% --preview='bkt --ttl=15m --stale=15s -- just {}'"
