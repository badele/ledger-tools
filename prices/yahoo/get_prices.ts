import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";
import { format } from "https://deno.land/std@0.204.0/datetime/mod.ts";
import { parse } from "https://deno.land/std@0.202.0/csv/mod.ts";

// List of symbols to retrieve prices
const searchsymbols: SymbolConversion[] = [
  { ledger: "ETH", yahoo: "ETH-EUR" },
  { ledger: "BTC", yahoo: "BTC-EUR" },
  { ledger: "DOGE", yahoo: "DOGE-EUR" },
  { ledger: "MATIC", yahoo: "MATIC-EUR" },
  { ledger: "ADA", yahoo: "ADA-EUR" },
];

// A ledger journal price item
type PriceLine = {
  comment: string;
  key: string;
  date: string;
  symbol: string;
  price: string;
  currency: string;
};

// Convert ledger journal to yahoo journal
type SymbolConversion = {
  ledger: string;
  yahoo: string;
};

// yahoo symbols
const yahoo_symbols: Record<string, PriceLine> = {};

/**
 * Get symbol prices from yahoo website
 * @param symbols - yahoo symbols list
 *
 * @returns yahoo symbol prices
 */
const getYahooPrices = async function (
  symbols: SymbolConversion[],
): Promise<PriceLine[]> {
  // Yahoo scraping information
  const url = "https://finance.yahoo.com/quote";
  const downloadurl = "https://query1.finance.yahoo.com/v7/finance/download";

  const xsel_btncookies =
    `/html/body/div/div/div/div/form/div[2]/div[2]/button[2]`;

  const xsel_currency =
    `/html/body/div[1]/div/div/div[1]/div/div[2]/div/div/div[6]/div/div/div/div[2]/div[1]/div[2]/span`;

  const values: PriceLine[] = [];
  console.log(`Try get prices`);

  for (let i = 0; i < symbols.length; i++) {
    const symbol = symbols[i];

    try {
      console.log(`Get ${symbol.yahoo}`);

      // Launch Puppeteer
      const browser = await puppeteer.launch();

      // Create a new page
      const page = await browser.newPage();
      await page.setDefaultTimeout(5000);
      await page.setViewport({ width: 1920, height: 1080 });
      await page.goto(`${url}/${symbol.yahoo}`);

      // ignore cookies
      const ecookies = await page.waitForXPath(xsel_btncookies);
      ecookies.click();

      // get currency
      const ecurrency = await page.waitForXPath(xsel_currency);
      const vcurrency = await page.evaluate(
        // deno-lint-ignore no-explicit-any
        (ecurrency: any) => ecurrency.textContent,
        ecurrency,
      );

      const regex = /Currency in ([A-Z]+)$/;
      const match = vcurrency.match(regex);

      let currency = "";
      if (regex.test(vcurrency) && match) {
        currency = match[1];
      }

      const resp = await fetch(
        `${downloadurl}/${symbol.yahoo}?period1=1577836800&period2=1698699282&interval=1mo&events=history&includeAdjustedClose=true`,
      );

      const history = parse(await resp.text(), {
        skipFirstRow: true,
        strip: true,
      });

      for (let i = 0; i < history.length; i++) {
        const h = history[i];

        const price: PriceLine = {
          comment: "P",
          key: `${h.Date}-${symbol.ledger}-${currency}`,
          date: h.Date || "",
          symbol: symbol.ledger,
          price: h.Close || "",
          currency: currency,
        };

        values.push(price);
      }

      browser.close();
    } catch (error) {
      console.log(error);
    }
  }

  return values;
};

/**
 * Get symbol informations from ledger journal line
 */
const getSymbolInfoFromLedgerLine = function (line: string): PriceLine {
  const price: PriceLine = {
    comment: "",
    key: "",
    date: "",
    symbol: "",
    price: "",
    currency: "",
  };

  const regex =
    /^([;\sP]{1,2}) ([0-9]{4}-[0-9]{2}-[0-9]{2})\s{2}([A-Z0-9]+) (\d+\.\d+) ([A-Z]+)$/;
  const match = line.match(regex);
  if (regex.test(line) && match) {
    price.comment = match[1];
    price.key = `${match[2]}-${match[3]}-${match[5]}`;
    price.date = match[2];
    price.symbol = match[3];
    price.price = match[4];
    price.currency = match[5];
  }

  return price;
};

/**
 * read ledger prices and convert to Record<string, PriceLine>
 *
 * @param filename - ledger journal filename
 * @param prices - A Record<string, PriceLine> object
 */
const LedgerToPrices = function (
  filename: string,
  prices: Record<string, PriceLine>,
): void {
  if (!filename) {
    console.log("Please define the LEDGER_FILE_PRICES variable");
    Deno.exit(1);
  }

  let journal = "";
  try {
    journal = Deno.readTextFileSync(filename);
  } catch (_) {
    //
  }

  const lines = journal.toString().split("\n");

  lines.forEach((item) => {
    const symbol = getSymbolInfoFromLedgerLine(item);
    if (symbol.key != "") {
      prices[symbol.key] = symbol;
    }
  });
};

/**
 * Add a yahoo symbol prices to Record<string, PriceLine> object
 * @param prices - A Record<string, PriceLine> object
 */
const addYahooPricesToPrices = function (
  symbolprices: PriceLine[],
  prices: Record<string, PriceLine>,
): void {
  for (const k in symbolprices) {
    prices[symbolprices[k].key] = symbolprices[k];
  }
};

/**
 * Write Record<string, PriceLine> to ledger journal
 * @param p - Record<string, PriceLine>
 * @param filename - ledger journal filename
 */
const pricesToLedger = function (
  p: Record<string, PriceLine>,
  filename: string,
): void {
  let journal = "; DO NOT EDIT THIS FILE, IT'S GENERATED AUTOMATICALLY\n\n";
  for (const k in p) {
    const line = `${p[k].comment} ${p[k].date}  ${p[k].symbol} ${p[k].price} ${
      p[k].currency
    }\n`;
    journal += line;
  }
  Deno.writeTextFileSync(filename, journal);
};

///////////////////////////////////////////////////////////////////////////////
// main
///////////////////////////////////////////////////////////////////////////////

// Read ledger journal
const LEDGER_FILE_PRICES = Deno.env.get("LEDGER_FILE_PRICES") || "";
LedgerToPrices(LEDGER_FILE_PRICES, yahoo_symbols);

// Get yahoo prices
const symbolprices = await getYahooPrices(searchsymbols);

addYahooPricesToPrices(symbolprices, yahoo_symbols);

// Write ledger journal
pricesToLedger(yahoo_symbols, LEDGER_FILE_PRICES);
