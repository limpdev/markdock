# ENDPOINTS

_Some streams of interest..._

## Alpha Vantage

### `NEWS_SENTIMENT`

> Looking for market news data to train your LLM models or to augment your trading strategy? You have just found it. This API returns live and historical market news & sentiment data from a large & growing selection of premier news outlets around the world, covering stocks, cryptocurrencies, forex, and a wide range of topics such as fiscal policy, mergers & acquisitions, IPOs, etc. This API, combined with our core stock API, fundamental data, and technical indicator APIs, can provide you with a 360-degree view of the financial market and the broader economy.

- tickers: (one or more)
- topics: blockchain, earnings, ipo, mergers_and_acquisitions, financial_markets, economy_fiscal, economy_monetary, economy_macro, energy_transportation, finance, life_sciences, real_estate, retail_wholesale, technology
- time_from & time_to: `YYYYMMDDTHHMM`
- sort: LATEST, EARLIEST, RELEVANCE
- limit: ⩽1000
